import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

const CoursesPage = ({baseURL, loggedIn}) => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

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
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
  
    fetchCourses();
  }, [baseURL]);
  

  function HandleEnroll(e) {
    navigate(`/Enroll/${e.target.id}`)
  }



  if (loading) return <p className="text-center text-gray-500">Loading courses...</p>;
  if (error) return <p className="text-center text-red-500">Error: {error}</p>;

  return (
    <div className="flex">
      {/* Sidebar */}
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
        {courses.length > 0 ? (
          courses.map((course) => (
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
                {/* <Link to={`/courses/${course._id}/lessons`} className="text-blue-500 hover:underline">
                  Go to Lessons
                </Link> */}
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
                  <Link
                    id={course._id}
                    to={`/StudentDashboard`}
                    className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600"
                    onClick={(e) => HandleEnroll(e)}
                  >
                  Enroll Now
                  </Link>:
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
  );
};

export default CoursesPage;
