import { useState, useEffect, useCallback } from "react";
import AddTeacherForm from "../components/AddTeacherForm";

function AdmDashboard({baseURL}) {
  const [courses, setCourses] = useState([]);
  const [newCourse, setNewCourse] = useState({
    title: "",
    description: "",
    subject: "",
    duration: "",
  });
  const [editCourse, setEditCourse] = useState({
    _id: "",
    title: "",
    description: "",
    subject: "",
    duration: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    console.log("edit course updated:", editCourse);
  }, [editCourse]);

  async function apiRequest(url, method, body = null) {
    const token = localStorage.getItem("Token");
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
          localStorage.removeItem("Token");
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
      console.log(data);
      setCourses(data);}
    setLoading(false);
  }, [baseURL]);

  useEffect(() => {
    fetchCourses();
  }, [fetchCourses]);

  async function handleAddCourse(e) {
    e.preventDefault();
    if (!newCourse.title.trim() || !newCourse.description.trim()) {
      alert("Title and Description are required.");
      return;
    }
    const addedCourse = await apiRequest(`${baseURL}/courses`, "POST", newCourse);
    if (addedCourse) {
      setNewCourse({ title: "", description: "", subject: "", duration: "" });
      fetchCourses();
    }
  }

  async function handleEditCourse(e) {
    e.preventDefault();
    if (!editCourse.title.trim() || !editCourse.description.trim()) {
      alert("Title and Description cannot be empty.");
      return;
    }
    const updatedCourse = await apiRequest(`${baseURL}/courses/${editCourse._id}`, "PATCH", editCourse);
    if (updatedCourse) {
      setEditCourse({ _id: null, title: "", description: "", subject: "", duration: "" });
      fetchCourses();
    }
  }

  async function handleDeleteCourse(id) {
    if (!window.confirm("Are you sure you want to delete this course?")) return;
    const deleted = await apiRequest(`${baseURL}/courses/${id}`, "DELETE");
    if (deleted) fetchCourses();
  }

  return (
    <div className="max-w-4xl mx-auto p-6 bg-gray-100 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Admin Dashboard</h2>

      {error && <p className="text-red-500 bg-red-100 p-2 rounded">{error}</p>}

      {/* Add Course Form */}
      <form onSubmit={handleAddCourse} className="bg-white p-4 rounded shadow space-y-2">
        <h3 className="text-lg font-semibold">Add New Course</h3>
        <input
          type="text"
          placeholder="Course Title"
          value={newCourse.title}
          onChange={(e) => setNewCourse({ ...newCourse, title: e.target.value })}
          className="w-full border p-2 rounded"
        />
        <textarea
          placeholder="Course Description"
          value={newCourse.description}
          onChange={(e) => setNewCourse({ ...newCourse, description: e.target.value })}
          className="w-full border p-2 rounded"
        />
        <input
          type="text"
          placeholder="Subject (e.g., STEM)"
          value={newCourse.subject}
          onChange={(e) => setNewCourse({ ...newCourse, subject: e.target.value })}
          className="w-full border p-2 rounded"
        />
        <input
          type="number"
          placeholder="Duration (hours)"
          value={newCourse.duration}
          onChange={(e) => setNewCourse({ ...newCourse, duration: e.target.value })}
          className="w-full border p-2 rounded"
        />
        <button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded w-full">
          Add Course
        </button>
      </form>

      {/* Add Teacher Form */}
      <div className="mt-6 bg-white p-4 rounded shadow">
        <h3 className="text-lg font-semibold">Add New Teacher</h3>
        <AddTeacherForm baseURL={baseURL} />
      </div>

      {/* Edit Course Form */}
      {editCourse._id !== null && (
        <form onSubmit={handleEditCourse} className="bg-yellow-50 p-4 rounded shadow mt-4 space-y-2">
          <h3 className="text-lg font-semibold">Edit Course</h3>
          <input
            type="text"
            value={editCourse.title}
            onChange={(e) => setEditCourse({ ...editCourse, title: e.target.value })}
            className="w-full border p-2 rounded"
            id="edit-title"
            name="edit-title"
          />
          <textarea
            value={editCourse.description}
            onChange={(e) => setEditCourse({ ...editCourse, description: e.target.value })}
            className="w-full border p-2 rounded"
            id="edit-description"
            name="edit-description"
          />
          <input
            type="text"
            value={editCourse.subject}
            onChange={(e) => setEditCourse({ ...editCourse, subject: e.target.value })}
            className="w-full border p-2 rounded"
            id="edit-subject"
            name="edit-subject"
          />
          <input
            type="number"
            value={editCourse.duration}
            onChange={(e) => setEditCourse({ ...editCourse, duration: e.target.value })}
            className="w-full border p-2 rounded"
            id="edit-duration"
            name="edit-duration"
          />
          <div className="flex space-x-2">
            <button type="submit" className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">
              Save
            </button>
            <button
              type="button"
              onClick={() => setEditCourse({ _id: null, title: "", description: "", subject: "", duration: "" })}
              className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {/* Course List */}
      {loading ? (
        <p className="text-gray-600">Loading...</p>
      ) : (
        <ul className="mt-4">
          {courses.map((course) => (
            <li key={course._id ?? course.title} className="flex justify-between items-center bg-white p-4 rounded shadow mb-2">
              <div>
                <p className="text-lg font-semibold">{course.title}</p>
                <p className="text-sm text-gray-600">{course.description}</p>
                <p className="text-sm text-gray-500">Subject: {course.subject}</p>
                <p className="text-sm text-gray-500">Duration: {course.duration} hours</p>
              </div>
              <div className="space-x-2">
                <button className="bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-1 px-2 rounded" onClick={() => {setEditCourse({_id: course._id ?? course.title, ...course})}}>
                  Edit
                </button>
                <button className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded" onClick={() => handleDeleteCourse(course._id)}>
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default AdmDashboard;
