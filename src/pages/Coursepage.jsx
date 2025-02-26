import { useState, useEffect } from "react";
import {Link} from 'react-router-dom';

const CoursesPage = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCourses = () => {
      fetch("http://127.0.0.1:5555/unauthCourses")
        .then((response) => response.json())
        .then((data) => {
          setCourses(data);
          setLoading(false);
        })
        .catch((error) => {
          setError(error.message);
          setLoading(false);
        });
    };
  
    fetchCourses();
    const interval = setInterval(fetchCourses, 5000); // Auto-refresh every 5 seconds
  
    return () => clearInterval(interval); // Cleanup on unmount
  }, []);
  

  if (loading) return <p className="text-center text-gray-500">Loading courses...</p>;
  if (error) return <p className="text-center text-red-500">Error: {error}</p>;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold text-center mb-6">Available Courses</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {courses.map((course) => (
          <div key={course.id} className="bg-white p-4 rounded-lg shadow-md border border-gray-200">
            <h2 className="text-xl font-semibold mb-2">{course.title}</h2>
            <p className="text-gray-700 mb-2">{course.description}</p>
            <p className="text-gray-500 text-sm">Duration: {course.duration} years</p>
            <p className="text-gray-500 text-sm">Teacher: {course.teacher_id}</p>
            <Link to={`/courses/${course.id}/lessons`} className="mt-4 inline-block bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
             Start Lessons
             </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CoursesPage;
