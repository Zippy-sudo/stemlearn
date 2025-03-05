import React, { useState, useEffect, useCallback } from "react";

function Enrollments({ baseURL }) {
  const [enrollments, setEnrollments] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [courseId, setCourseId] = useState("");

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

  const fetchEnrollments = useCallback(async () => {
    setLoading(true);
    setError(null);
    const url = courseId
      ? `${baseURL}/enrollments/${courseId}`
      : `${baseURL}/enrollments`;
    const data = await apiRequest(url, "GET");

    if (data) {
      console.log("API Response:", data);
      setEnrollments(data);
      let completions = 0
      for (const enrollment of enrollments){
        completions += enrollment.completion_percentage
      }
      setAnalytics({total_students:data.length, average_completion : Math.round(completions/enrollments.length * 100)});
    }
    setLoading(false);
  }, [baseURL, courseId]);

  useEffect(() => {
    fetchEnrollments();
  }, [fetchEnrollments]);

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-lg mt-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Enrollments</h2>
      <div className="mb-4">
        <input
          type="text"
          placeholder="Enter Course ID"
          value={courseId}
          onChange={(e) => setCourseId(e.target.value)}
          className="p-2 border border-gray-300 rounded-lg"
        />
        <button
          onClick={fetchEnrollments}
          className="ml-2 p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
        >
          Filter
        </button>
      </div>
      {loading && <p className="text-blue-500">Loading...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {analytics && (
        <div className="bg-gray-100 p-4 rounded-lg mb-6">
          <h3 className="text-lg font-semibold text-gray-700">Analytics</h3>
          <p className="text-gray-600">Total Students: {analytics.total_students}</p>
          <p className="text-gray-600">Average Completion: {analytics.average_completion}%</p>
        </div>
      )}

      <ul className="space-y-4">
        {enrollments.map((enrollment) => (
          <li key={enrollment._id} className="p-4 border border-gray-200 rounded-lg shadow-md">
            <p className="text-gray-700 font-medium">Student Name: <span className="text-gray-900">{enrollment.student_name}</span></p>
            <p className="text-gray-700 font-medium">Course Title: <span className="text-gray-900">{enrollment.course_title}</span></p>
            <p className="text-gray-700 font-medium">Completion: <span className="text-blue-600">{enrollment.completion_percentage}%</span></p>
          </li>
        ))}
      </ul>
    </div>
  );
}


export default Enrollments;
