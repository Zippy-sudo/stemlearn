import { useState, useEffect } from "react";

function AdmDashboard() {
  const [courses, setCourses] = useState([]);
  const [newCourse, setNewCourse] = useState({
    title: "",
    description: "",
    subject: "",
    duration: "",
  });
  const [editCourse, setEditCourse] = useState({
    id: null,
    title: "",
    description: "",
    subject: "",
    duration: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchCourses();
  }, []);

  async function fetchCourses() {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("http://localhost:5000/courses");
      if (!response.ok) throw new Error("Failed to fetch courses");
      const data = await response.json();
      setCourses(data);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleAddCourse(e) {
    e.preventDefault();
    if (!newCourse.title.trim() || !newCourse.description.trim()) return;
    try {
      const response = await fetch("http://localhost:5000/courses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newCourse),
      });
      if (!response.ok) throw new Error("Failed to add course");
      setNewCourse({ title: "", description: "", subject: "", duration: "" });
      fetchCourses();
    } catch (error) {
      setError(error.message);
    }
  }

  async function handleEditCourse(e) {
    e.preventDefault();
    if (!editCourse.title.trim() || !editCourse.description.trim()) return;
    try {
      const response = await fetch(`http://localhost:5000/courses/${editCourse.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: editCourse.title,
          description: editCourse.description,
          subject: editCourse.subject,
          duration: editCourse.duration,
        }),
      });
      if (!response.ok) throw new Error("Failed to edit course");
      setEditCourse({ id: null, title: "", description: "", subject: "", duration: "" });
      fetchCourses();
    } catch (error) {
      setError(error.message);
    }
  }

  async function handleDeleteCourse(id) {
    try {
      const response = await fetch(`http://localhost:5000/courses/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error("Failed to delete course");
      fetchCourses();
    } catch (error) {
      setError(error.message);
    }
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

      {/* Edit Course Form */}
      {editCourse.id && (
        <form onSubmit={handleEditCourse} className="bg-yellow-50 p-4 rounded shadow mt-4 space-y-2">
          <h3 className="text-lg font-semibold">Edit Course</h3>
          <input
            type="text"
            value={editCourse.title}
            onChange={(e) => setEditCourse({ ...editCourse, title: e.target.value })}
            className="w-full border p-2 rounded"
          />
          <textarea
            value={editCourse.description}
            onChange={(e) => setEditCourse({ ...editCourse, description: e.target.value })}
            className="w-full border p-2 rounded"
          />
          <input
            type="text"
            value={editCourse.subject}
            onChange={(e) => setEditCourse({ ...editCourse, subject: e.target.value })}
            className="w-full border p-2 rounded"
          />
          <input
            type="number"
            value={editCourse.duration}
            onChange={(e) => setEditCourse({ ...editCourse, duration: e.target.value })}
            className="w-full border p-2 rounded"
          />
          <div className="flex space-x-2">
            <button type="submit" className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">
              Save
            </button>
            <button
              type="button"
              onClick={() => setEditCourse({ id: null, title: "", description: "", subject: "", duration: "" })}
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
            <li key={course._id} className="flex justify-between items-center bg-white p-4 rounded shadow mb-2">
              <div>
                <p className="text-lg font-semibold">{course.title}</p>
                <p className="text-sm text-gray-600">{course.description}</p>
                <p className="text-sm text-gray-500">Subject: {course.subject}</p>
                <p className="text-sm text-gray-500">Duration: {course.duration} hours</p>
              </div>
              <div className="space-x-2">
                <button
                  className="bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-1 px-2 rounded"
                  onClick={() => setEditCourse(course)}
                >
                  Edit
                </button>
                <button
                  className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded"
                  onClick={() => handleDeleteCourse(course._id)}
                >
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
