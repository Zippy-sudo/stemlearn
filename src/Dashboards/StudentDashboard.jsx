import React, { useEffect, useState } from "react";

const StudentDashboard = () => {
  const [courses, setCourses] = useState([]); // ✅ Initialize as an empty array
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch("http://127.0.0.1:5555/unauthCourses")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch courses");
        }
        return response.json();
      })
      .then((data) => {
        setCourses(data.courses || []); // ✅ Ensure it's an array
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching courses:", error);
        setError(error.message);
        setLoading(false);
      });
  }, []);

  return (
    <div className="flex h-screen">
      <div className="w-1/5 bg-gray-900 text-white p-5">
        <h2 className="text-2xl font-bold mb-6">Student Dashboard</h2>
      </div>

      <div className="w-4/5 p-8">
        <h1 className="text-3xl font-semibold mb-4">Welcome Back!</h1>

        {loading && <p>Loading courses...</p>}
        {error && <p className="text-red-500">{error}</p>}

        <div>
          <h2 className="text-xl font-semibold mb-3">Your Courses</h2>
          <div className="space-y-4">
            {courses.length === 0 && !loading && !error && <p>No courses found.</p>}
            {courses.map((course) => (
              <div key={course.id} className="bg-white shadow p-4 rounded-lg">
                <h3 className="text-lg font-bold">{course.title}</h3>
                <p>Progress: {course.progress}%</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;
