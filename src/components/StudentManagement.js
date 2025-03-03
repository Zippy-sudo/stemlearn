import { useEffect, useState } from "react";

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
    alert("Failed to connect to the server.");
    return null;
  }
}

function EnrollmentForm() {
  const [students, setStudents] = useState([]);
  const [courses, setCourses] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState("");
  const [selectedCourse, setSelectedCourse] = useState("");
  
  useEffect(() => {
    async function fetchData() {
      const studentData = await apiRequest("/users", "GET");
      const courseData = await apiRequest("/courses", "GET");

      if (studentData) setStudents(studentData);
      if (courseData) setCourses(courseData);
    }
    fetchData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedStudent || !selectedCourse) {
      alert("Invalid selection. Please select a student and a course.");
      return;
    }
    // Data is sent in the form of student name but received in _id form.
    const enrollmentData = {
      student_id: selectedStudent,
      course_id: selectedCourse,
    };

    const response = await apiRequest("/enrollments", "POST", enrollmentData);

    if (response) {
      alert("Student enrolled successfully!");
      setSelectedStudent("");
      setSelectedCourse("");
    } else {
      alert("Failed to enroll student.");
    }
  };

  return (
    <div className="max-w-lg mx-auto bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4">Enroll a Student</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Student Selection */}
        <label className="block">
          Select Student:
          <select
            className="w-full border p-2 rounded"
            value={selectedStudent}
            onChange={(e) => setSelectedStudent(e.target.value)}
            required
          >
            <option value="">-- Choose a Student --</option>
            {students.map((student) => (
              <option key={student.public_id} value={student.public_id}>
                {student.name}
              </option>
            ))}
          </select>
        </label>

        {/* Course Selection in a dropdown form and a submit button for enrollment*/}
        <label className="block">
          Select Course:
          <select
            className="w-full border p-2 rounded"
            value={selectedCourse}
            onChange={(e) => setSelectedCourse(e.target.value)}
            required
          >
            <option value="">-- Choose a Course --</option>
            {courses.map((course) => (
              <option key={course._id} value={course._id}>
                {course.title}
              </option>
            ))}
          </select>
        </label>
        <button type="submit" className="w-full bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
          Enroll Student
        </button>
      </form>
    </div>
  );
}

export default EnrollmentForm;
