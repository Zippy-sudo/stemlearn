import React, { useState, useEffect } from "react";
import {jwtDecode} from "jwt-decode";

function MyCourses() {
  const [courses, setCourses] = useState([]);
  const token = sessionStorage.getItem("Token");
  const publicId = token ? jwtDecode(token).public_id : null; // Extract `public_id` from the token

  useEffect(() => {
    if (!publicId) return; // Skip if `public_id` is not available

    // Fetch enrolled courses
    async function fetchMyCourses() {
      try {
        const response = await fetch("http://127.0.0.1:5555/courses", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await response.json();
        if (response.ok) {
          // Filter enrollments for the logged-in student
          const filteredCourses = data
            .map((course) => ({
              ...course,
              enrollments: course.enrollments.filter(
                (enrollment) => enrollment.student_id === publicId // Use `public_id` here
              ),
            }))
            .filter((course) => course.enrollments.length > 0); // Only include courses with enrollments
          setCourses(filteredCourses);
        } else {
          console.error("Failed to fetch courses:", data.error);
        }
      } catch (error) {
        console.error("Failed to fetch courses:", error);
      }
    }

    fetchMyCourses();
  }, [token, publicId]);

  if (!publicId) {
    return <p className="text-gray-600">Please log in to view your courses.</p>;
  }

  return (
    <div className="bg-gray-100 text-gray-800 min-h-screen p-6">
      <div className="container mx-auto">
        {/* My Courses Section */}
        <section className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold mb-4">My Courses</h2>
          {courses.length > 0 ? (
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="py-3 text-left">Course Name</th>
                  <th className="py-3 text-left">Subject</th>
                  <th className="py-3 text-left">Duration</th>
                  <th className="py-3 text-left">Enrolled On</th>
                  <th className="py-3 text-left">Progress</th>
                </tr>
              </thead>
              <tbody>
                {courses.map((course) =>
                  course.enrollments.map((enrollment) => (
                    <tr key={enrollment._id} className="border-b">
                      <td className="py-4">{course.description}</td>
                      <td className="py-4">{course.subject}</td>
                      <td className="py-4">{course.duration} hours</td>
                      <td className="py-4">{enrollment.enrolled_on}</td>
                      <td className="py-4">
                        <progress
                          value={enrollment.completion_percentage}
                          max="100"
                          className="w-full"
                        ></progress>
                        <span className="text-sm">
                          {enrollment.completion_percentage}%
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          ) : (
            <p className="text-gray-600">You are not enrolled in any courses yet.</p>
          )}
        </section>
      </div>
    </div>
  );
}

export default MyCourses;