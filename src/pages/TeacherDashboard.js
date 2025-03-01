import { useState, useEffect, useCallback } from "react";

function TeacherDashboard({ baseURL }) {
  const [courses, setCourses] = useState([]);
  const [lessons, setLessons] = useState([]);
  const [studentProgress, setStudentProgress] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [newLesson, setNewLesson] = useState({
    title: "",
    content: "",
    video_url: "",
    course_id: "",
  });

  // Reusable API request function
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

  // Fetch courses taught by the teacher
  const fetchCourses = useCallback(async () => {
    setLoading(true);
    setError(null);
    const data = await apiRequest(`${baseURL}/courses`, "GET");
    if (data) {
      setCourses(data);
    }
    setLoading(false);
  }, [baseURL]);

  // Fetch lessons for a specific course
  const fetchLessons = useCallback(async (courseId) => {
    setLoading(true);
    setError(null);
    const data = await apiRequest(`${baseURL}/courses/${courseId}/lessons`, "GET");
    if (data) {
      setLessons(data);
    }
    setLoading(false);
  }, [baseURL]);

  // Fetch student progress for a specific course
  const fetchStudentProgress = useCallback(async (courseId) => {
    setLoading(true);
    setError(null);
    const data = await apiRequest(`${baseURL}/courses/${courseId}/progress`, "GET");
    if (data) {
      console.log("Student Progress Data:", data); // Debug: Log the data
      setStudentProgress(data);
    }
    setLoading(false);
  }, [baseURL]);

  // Upload a new lesson
  const handleUploadLesson = async (e) => {
    e.preventDefault();
    const data = await apiRequest(`${baseURL}/lessons`, "POST", newLesson);
    if (data) {
      setNewLesson({ title: "", content: "", video_url: "", course_id: "" }); // Reset form
      fetchLessons(newLesson.course_id); // Refresh the lessons list
    }
  };

  // Provide feedback on student progress
  const handleProvideFeedback = async (progressId, feedback) => {
    const data = await apiRequest(`${baseURL}/progress/${progressId}/feedback`, "PATCH", { feedback });
    if (data) {
      fetchStudentProgress(data.courseId); // Refresh the progress list
    }
  };

  useEffect(() => {
    fetchCourses();
  }, [fetchCourses]);

  return (
    <div className="max-w-4xl mx-auto p-6 bg-gray-100 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Teacher Dashboard</h2>

      {error && <p className="text-red-500 bg-red-100 p-2 rounded">{error}</p>}

      {/* Course List */}
      <h3 className="text-lg font-semibold mb-2">Your Courses</h3>
      {loading ? (
        <p className="text-gray-600">Loading...</p>
      ) : (
        <ul className="space-y-2">
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

      {/* Lesson Upload Form */}
      <div className="mt-6 bg-white p-4 rounded shadow">
        <h3 className="text-lg font-semibold mb-2">Upload New Lesson</h3>
        <form onSubmit={handleUploadLesson} className="space-y-2">
          <input
            type="text"
            placeholder="Lesson Title"
            value={newLesson.title}
            onChange={(e) => setNewLesson({ ...newLesson, title: e.target.value })}
            className="w-full border p-2 rounded"
            required
          />
          <textarea
            placeholder="Lesson Content"
            value={newLesson.content}
            onChange={(e) => setNewLesson({ ...newLesson, content: e.target.value })}
            className="w-full border p-2 rounded"
            required
          />
          <input
            type="text"
            placeholder="Video URL (optional)"
            value={newLesson.video_url}
            onChange={(e) => setNewLesson({ ...newLesson, video_url: e.target.value })}
            className="w-full border p-2 rounded"
          />
          <select
            value={newLesson.course_id}
            onChange={(e) => setNewLesson({ ...newLesson, course_id: e.target.value })}
            className="w-full border p-2 rounded"
            required
          >
            <option value="">Select Course</option>
            {courses.map((course) => (
              <option key={course._id} value={course._id}>
                {course.title}
              </option>
            ))}
          </select>
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded w-full"
          >
            Upload Lesson
          </button>
        </form>
      </div>

      {/* Lessons List */}
      {lessons.length > 0 && (
        <div className="mt-6">
          <h3 className="text-lg font-semibold mb-2">Lessons</h3>
          <ul className="space-y-2">
            {lessons.map((lesson) => (
              <li key={lesson._id} className="bg-white p-4 rounded shadow">
                <h4 className="text-xl font-bold">{lesson.title}</h4>
                <p className="text-gray-600">{lesson.content}</p>
                {lesson.video_url && (
                  <a
                    href={lesson.video_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 hover:underline"
                  >
                    Watch Video
                  </a>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Student Progress List */}
      {studentProgress.length > 0 && (
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
                <p className="text-gray-600">Completion: {progress.completion_percentage}%</p>
                <textarea
                  placeholder="Provide feedback"
                  onChange={(e) => handleProvideFeedback(progress._id, e.target.value)}
                  className="w-full border p-2 rounded mt-2"
                />
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default TeacherDashboard;