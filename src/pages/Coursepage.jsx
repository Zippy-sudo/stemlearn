import { useState, useEffect, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import biology from "../images/Biology.jpg"
import compsci from "../images/CompSci.jpeg"
import engineering from "../images/Engineering.png"
import math from "../images/Math.jpg"
import physics from "../images/Physics.jpg"
import science from "../images/Science.jpg"

const CoursesPage = ({baseURL, loggedIn}) => {
  const [courses, setCourses] = useState([]);
  const [coursesToDisplay, setCoursesToDisplay] = useState([])
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("")
  const [subject, setSubject] = useState('All')
  const [error, setError] = useState(null);
  const token = sessionStorage.getItem('Token');
  const navigate = useNavigate();

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value)
    if (subject === "All"){
      let ctd = courses.filter((course) => course.title.trim().toUpperCase().includes(e.target.value.trim().toUpperCase()))
      setCoursesToDisplay(ctd)
      return
    }
    let ctd = courses.filter((course) => course.title.trim().toUpperCase().includes(e.target.value.trim().toUpperCase()) && course.subject === subject)
    setCoursesToDisplay(ctd)
  };

  const handleSubjectChange = (e) => {
    setSubject(e.target.value)
    if(e.target.value === "All") {
      let ctd = courses.filter((course) => course.title.trim().toUpperCase().includes(searchTerm.trim().toUpperCase()))
      setCoursesToDisplay(ctd)
      return
    }
    let ctd = courses.filter((course) => course.title.trim().includes(searchTerm.trim().toUpperCase()) && course.subject === e.target.value)
    setCoursesToDisplay(ctd)
  }

  useEffect(() => {
    const fetchCourses = async () => {
      try {  
        const response = await fetch(`${baseURL}/unauthCourses`, {
          method: "GET", // Explicitly setting the method
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${sessionStorage.getItem("Token")}`, // If authentication is needed
          },
        });
  
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
  
        const data = await response.json();
        setCourses(data);
        setCoursesToDisplay(data)
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
  
    fetchCourses();
  }, [baseURL]);
  

const HandleEnroll = useCallback(async (e) => {
  try {
    const response = await fetch(`${baseURL}/enrollments`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
        },
      credentials: 'include',
      body: JSON.stringify({
      course_id: e.target.id,
      }),
    });
    const data = await response.json();
    if (response.ok) {
    toast.success("Enrollment successful!");
    navigate("/StudentDashboard")
    } else {
    toast.error(`${data["Error"]}`);
    }
  } catch (error) {
    console.error("Enrollment Error:", error);
    toast.error("An error occurred. Please check your connection and try again.");
  }
}, [token, baseURL, navigate]);


  if (loading) return <p className="text-center text-gray-500">Loading courses...</p>;
  if (error) return <p className="text-center text-red-500">Error: {error}</p>;

  return (
  <div className="flex flex-col">
    <div className="mx-auto p-4 place-content-between">
    {/* Search Here */}
      <input type="text"
      placeholder="Search..."
      onChange={handleSearchChange}
      className="bg-aliceblue border border-black"
      >
      </input>
      <select onChange={handleSubjectChange}>
        <option value={subject}>{subject}</option>
        { subject === "All" ?  null : <option value="All">All</option>}
        { subject === "Mathematics" ? null : <option value="Mathematics">Mathematics</option>}
        { subject === "Physics" ? null : <option value="Physics">Physics</option>}
        { subject === "Biology" ? null : <option value="Biology">Biology</option>}
        { subject === "Computer Science" ? null : <option value="Computer Science">Computer Science</option>}
        { subject === "Engineering" ? null : <option value="Engineering">Engineering</option>}
      </select>
      </div>

      {/* Sidebar */}
      <div className="flex">
      <div className="fixed h-screen mr-2 z-0 min-w-80">
      <div className="relative">
      <aside className="absolute top-20 left-0 min-w-1/4 bg-gray-100 p-4 h-screen overflow-y-auto border-r">
        <h2 className="text-lg font-semibold mb-3">Courses</h2>
        <ul>
          {courses.map((course) => (
            <li key={course._id} className="mb-2">
              <a
                href={`#course-${course._id}`}
                className="block p-2 bg-blue-100 hover:bg-blue-200 rounded-md"
              >
                {course.title}
              </a>
            </li>
          ))}
        </ul>
      </aside>
      </div>
      </div>

      {/* Main Content */}
      <div className="w-3/4 p-6">
        {coursesToDisplay.length > 0 ? (
          coursesToDisplay.map((course) => (
            <div
              key={course._id}
              id={`course-${course._id}`}
              className="flex flex-col items-center bg-white p-6 rounded-lg shadow-md border border-gray-200 mb-6"
            >
              <div className="flex w-1/2 m-5">
                {course.subject === "Mathematics" ?
                <img src={math} alt="math" title="Math"/>:
                course.subject === "Physics" ?
                <img src={physics} alt="physics" title="Physics"/>:
                course.subject === "Biology" ?
                <img src={biology} alt="biology" title="Biology"/>:
                course.subject === "Computer Science" ? 
                <img src={compsci} alt="computer science" title="Computer Science"/>:
                course.subject === "Engineering" ?
                <img src={engineering} alt="engineering" title="Engineering"/>:
                <img src={science} alt="generic science" title="Generic"/>
                }
              </div>
              <h1 className="text-3xl font-bold text-center">{course.title}</h1>
              <p className="text-center text-gray-600 mb-4">Duration: {course.duration} Years</p>

              {/* Course Overview */}
              <div className="mb-4 w-64">
                <h2 className="text-lg font-semibold text-center">Overview</h2>
                <p className="text-gray-700">{course.description}</p>
              </div>

              {/* Lessons List */}
              <div className="mb-4 ">
                <h2 className="text-lg font-semibold text-center">Lessons</h2>
                <ul className="list-disc list-inside">
                  {course.lessons?.map((lesson, index) => (
                    <li key={index} className="text-gray-700 font-medium">
                      {lesson.title}
                    </li>
                  
                  ))}
                </ul>
              </div>
              {/* Teacher Details */}
              {course.teacher ? 
              <div className="mb-4">
                <h2 className="text-lg font-semibold text-center">Teacher</h2>
                <ul className="list-disc list-inside">
                <li className="font-semibold">
                  {course.teacher.name}
                </li>
                </ul>
              </div>:
              null}

              {/* Enroll Button */}
              <div className="text-center mb-4">
                {loggedIn ?
                  <button
                    id={course._id}
                    className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600"
                    onClick={(e) => HandleEnroll(e)}
                  >
                  Enroll Now
                  </button>:
                  <Link
                    to={"/Login"}
                      className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600"
                  >
                  Enroll Now
                  </Link>
                }
              </div>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-500">No courses available</p>
        )}
      </div>
      </div>
    </div>
  );
};

export default CoursesPage;
