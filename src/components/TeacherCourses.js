import React, { useState, useEffect, useCallback } from "react";
import UploadLesson from "./UploadLesson";
import LessonItem from "./LessonItem";

function TeacherCourses({ baseURL }) {
  const [courses, setCourses] = useState([]);
  const [lessons, setLessons] = useState([]);
  const [studentProgress, setStudentProgress] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedCourseId, setSelectedCourseId] = useState(null);

  async function apiRequest(url, method, body = null) {
    const token = sessionStorage.getItem("Token");
    if (!token) {
      alert("Unauthorized! Please log in.");
      window.location.href = "/login";
      return;
    }

    const options = {
      method,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      ...(body && { body: JSON.stringify(body) }),
    };

    try {
      const response = await fetch(url, options);
      if (!response.ok) {
        if (response.status === 401) {
          alert("Session expired. Please log in again.");
          sessionStorage.removeItem("Token");
          window.location.href = "/login";
        }
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }
      return await response.json();
    } catch (error) {
      console.error("API request error:", error);
      setError("Failed to connect to the server.");
      return null;
    }
  }

  const fetchCourses = useCallback(async () => {
    setLoading(true);
    setError(null);
    const data = await apiRequest(`${baseURL}/courses`, "GET");
    if (data) {
      setCourses(data);
    }
    setLoading(false);
  }, [baseURL]);

  const fetchLessons = useCallback(async (courseId) => {
    setLoading(true);
    setError(null);
    setSelectedCourseId(courseId);
    const data = await apiRequest(`${baseURL}/courses//${courseId}/lessons`, "GET");
    if (data) {
      setLessons(data);
    }
    setLoading(false);
  }, [baseURL]);

  const fetchStudentProgress = useCallback(async (courseId) => {
    setLoading(true);
    setError(null);
    setSelectedCourseId(courseId);
    const data = await apiRequest(`${baseURL}/courses/${courseId}/progress`, "GET");
    if (data) {
      setStudentProgress(data);
    }
    setLoading(false);
  }, [baseURL]);

  const deleteLesson = async (lessonId) => {
    if (!window.confirm("Are you sure you want to delete this lesson?")) return;
    setLoading(true);
    const response = await apiRequest(`${baseURL}/lessons/${lessonId}`, "DELETE");
    if (response) {
      alert("Lesson deleted successfully!");
      fetchLessons(selectedCourseId);
    }
    setLoading(false);
  };

  const editLesson = async (lessonId, updatedLesson) => {
    setLoading(true);
    const response = await apiRequest(`${baseURL}/lessons/${lessonId}`, "PATCH", updatedLesson);
    if (response) {
      alert("Lesson updated successfully!");
      fetchLessons(selectedCourseId);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchCourses();
  }, [fetchCourses]);

  return (
    <div>
      <h2>Your Courses</h2>
      {loading && <p>Loading...</p>}
      {error && <p className="text-red-500">{error}</p>}
      {courses.length === 0 ? (
        <p>No courses available.</p>
      ) : (
        <ul>
          {courses.map((course) => (
            <li key={course._id} className="bg-white p-4 rounded shadow">
              <h4 className="text-xl font-bold">{course.title}</h4>
              <p className="text-gray-600">{course.description}</p>
              <button
                onClick={() => fetchLessons(course._id)}
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded mt-2"
              >
                View Lessons
              </button>
              <button
                onClick={() => fetchStudentProgress(course._id)}
                className="bg-green-500 hover:bg-green-700 text-white font-bold py-1 px-2 rounded mt-2 ml-2"
              >
                View Student Progress
              </button>
            </li>
          ))}
        </ul>
      )}

      <UploadLesson baseURL={baseURL} fetchLessons={fetchLessons} />   

      {/* Lessons List */}
      {selectedCourseId && lessons.length > 0 && (
        <div className="mt-6">
          <h3 className="text-lg font-semibold mb-2">Lessons</h3>
          <ul className="space-y-2">
            {lessons.map((lesson) => (
              <LessonItem
                key={lesson._id}
                lesson={lesson}
                deleteLesson={deleteLesson}
                editLesson={editLesson}
              />
            ))}
          </ul>
        </div>
      )}

      {/* Student Progress List */}
      {selectedCourseId && studentProgress.length > 0 && (
        <div className="mt-6">
          <h3 className="text-lg font-semibold mb-2">Student Progress</h3>
          <ul className="space-y-2">
            {studentProgress.map((progress) => (
              <li key={progress._id} className="bg-white p-4 rounded shadow">
                <h4 className="text-xl font-bold">
                  {progress.enrollment?.student?.name || "Unknown Student"}
                </h4>
                <p className="text-gray-600">
                  Course: {progress.enrollment?.course?.title || "Unknown Course"}
                </p>
                <p className="text-gray-600">Completion: {progress.enrollment?.completion_percentage ?? 0}%</p>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default TeacherCourses;
// Fetches courses assigned to the teacher and displays them in a list.
// The teacher can view lessons and student progress for each course.
// The teacher can also upload new lessons to a course.
// The teacher can delete a lesson or update its content.
