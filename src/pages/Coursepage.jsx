import { useState, useEffect, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";

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
    alert("Enrollment successful!");
    navigate("/StudentDashboard")
    } else {
    alert(data.error || "Failed to enroll in the course. Please try again.");
    }
  } catch (error) {
    console.error("Enrollment Error:", error);
    alert("An error occurred. Please check your connection and try again.");
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
      <aside className="w-1/4 bg-gray-100 p-4 h-screen overflow-y-auto border-r">
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

      {/* Main Content */}
      <div className="w-3/4 p-6">
        {coursesToDisplay.length > 0 ? (
          coursesToDisplay.map((course) => (
            <div
              key={course._id}
              id={`course-${course._id}`}
              className="bg-white p-6 rounded-lg shadow-md border border-gray-200 mb-6"
            >
              <h1 className="text-3xl font-bold text-center">{course.title}</h1>
              <p className="text-center text-gray-600 mb-4">Duration: {course.duration} Years</p>

              {/* Course Overview */}
              <div className="mb-4">
                <h2 className="text-lg font-semibold">Overview</h2>
                <p className="text-gray-700">{course.description}</p>
              </div>

              {/* Lessons List */}
              <div className="mb-4">
                <h2 className="text-lg font-semibold">Lessons</h2>
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
                <h2 className="text-lg font-semibold">Teacher</h2>
                <p className="font-semibold">
                  Teacher: {course.teacher.name}
                </p>
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
                    to={"/login"}
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
