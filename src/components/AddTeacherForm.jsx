import { useState } from "react";

function AddTeacherForm({ baseURL }) {
  const [teacherData, setTeacherData] = useState({
    name: "",
    email: "",
    password: "",
    courseId: "",
  });
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!teacherData.name || !teacherData.email || !teacherData.password || !teacherData.courseId) {
      setError("All fields are required.");
      return;
    }

    const token = sessionStorage.getItem("Token");
    if (!token) {
      alert("Unauthorized! Please log in.");
      window.location.href = "/login";
      return;
    }

    try {
      // Create the teacher user
      const userResponse = await fetch(`${baseURL}/users`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: teacherData.name,
          email: teacherData.email,
          password: teacherData.password,
          role: "TEACHER",
        }),
      });

      if (!userResponse.ok) {
        throw new Error(`Error ${userResponse.status}: ${userResponse.statusText}`);
      }

      const newTeacher = await userResponse.json();

      // Assign the teacher to the course
      const courseResponse = await fetch(`${baseURL}/courses/${teacherData.courseId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          public_id: newTeacher.public_id,
        }),
      });

      if (!courseResponse.ok) {
        throw new Error(`Error ${courseResponse.status}: ${courseResponse.statusText}`);
      }

      alert("Teacher added and assigned to the course successfully!");
      setTeacherData({ name: "", email: "", password: "", courseId: "" });
      setError(null);
    } catch (error) {
      console.error("Error adding teacher:", error);
      setError("Failed to add teacher. Please try again.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-2">
      <input
        type="text"
        placeholder="Teacher Name"
        value={teacherData.name}
        onChange={(e) => setTeacherData({ ...teacherData, name: e.target.value })}
        className="w-full border p-2 rounded"
      />
      <input
        type="email"
        placeholder="Teacher Email"
        value={teacherData.email}
        onChange={(e) => setTeacherData({ ...teacherData, email: e.target.value })}
        className="w-full border p-2 rounded"
      />
      <input
        type="password"
        placeholder="Teacher Password"
        value={teacherData.password}
        onChange={(e) => setTeacherData({ ...teacherData, password: e.target.value })}
        className="w-full border p-2 rounded"
      />
      <input
        type="text"
        placeholder="Course ID"
        value={teacherData.courseId}
        onChange={(e) => setTeacherData({ ...teacherData, courseId: e.target.value })}
        className="w-full border p-2 rounded"
      />
      {error && <p className="text-red-500">{error}</p>}
      <button type="submit" className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded w-full">
        Add Teacher
      </button>
    </form>
  );
}

export default AddTeacherForm;
