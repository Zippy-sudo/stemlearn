import { useState } from "react";
import { toast } from "react-toastify";

function AddStudentForm({ baseURL }) {
  const [studentData, setStudentData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate input fields
    if (!studentData.name || !studentData.email || !studentData.password) {
      setError("All fields are required.");
      return;
    }

    const token = sessionStorage.getItem("Token");
    if (!token) {
      toast.error("Unauthorized! Please log in.");
      window.location.href = "/Login";
      return;
    }

    try {
      // Send a POST request to create the student
      const response = await fetch(`${baseURL}/users`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: studentData.name,
          email: studentData.email,
          password: studentData.password,
          role: "STUDENT",
        }),
      });

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      await response.json(); 
      alert("Student added successfully!");
      setStudentData({ name: "", email: "", password: "" });
      setError(null);
    } catch (error) {
      console.error("Error adding student:", error);
      setError("Failed to add student. Please try again.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-2">
      <h3 className="text-lg font-semibold">Add New Student</h3>
      <input
        type="text"
        placeholder="Student Name"
        value={studentData.name}
        onChange={(e) => setStudentData({ ...studentData, name: e.target.value })}
        className="w-full border p-2 rounded"
      />
      <input
        type="email"
        placeholder="Student Email"
        value={studentData.email}
        onChange={(e) => setStudentData({ ...studentData, email: e.target.value })}
        className="w-full border p-2 rounded"
      />
      <input
        type="password"
        placeholder="Student Password"
        value={studentData.password}
        onChange={(e) => setStudentData({ ...studentData, password: e.target.value })}
        className="w-full border p-2 rounded"
      />
      {error && <p className="text-red-500">{error}</p>}
      <button
        type="submit"
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded w-full"
      >
        Add Student
      </button>
    </form>
  );
}

export default AddStudentForm;