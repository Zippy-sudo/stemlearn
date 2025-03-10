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

function EnrollmentForm({baseURL}) {
  const [students, setStudents] = useState([]);
  const [courses, setCourses] = useState([]);
  const [enrollments, setEnrollments] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState("");
  const [selectedCourse, setSelectedCourse] = useState("");
  const [editingEnrollment, setEditingEnrollment] = useState(null);

  useEffect(() => {
    async function fetchData() {
      const studentData = await apiRequest(`${baseURL}/users`, "GET");
      const courseData = await apiRequest(`${baseURL}/courses`, "GET");
      const enrollmentData = await apiRequest(`${baseURL}/enrollments`, "GET");

      if (studentData) setStudents(studentData);
      if (courseData) setCourses(courseData);

      if (enrollmentData) {
        const updatedEnrollments = enrollmentData.map((enrollment) => {
          const student = studentData.find((s) => s.public_id === enrollment.student_id);
          const course = courseData.find((c) => c._id === enrollment.course_id);
          return {
            ...enrollment,
            student_name: student ? student.name : "Unknown Student",
            course_title: course ? course.title : "Unknown Course",
          };
        });

        setEnrollments(updatedEnrollments);
      }
    }
    fetchData();
  }, [baseURL]);

  // Handles enrollment Submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedStudent || !selectedCourse) {
      alert("Please select a student and a course.");
      return;
    }

    const enrollmentData = {
      student_id: selectedStudent,
      course_id: selectedCourse,
    };

    const response = await apiRequest(`${baseURL}/enrollments`, "POST", enrollmentData);

    if (response) {
      alert("Student enrolled successfully!");
      const student = students.find((s) => s.public_id === selectedStudent);
      const course = courses.find((c) => c._id === selectedCourse);

      setEnrollments([...enrollments, {
        ...response,
        student_name: student ? student.name : "Unknown Student",
        course_title: course ? course.title : "Unknown Course",
      }]);

      setSelectedStudent("");
      setSelectedCourse("");
    } else {
      alert("Failed to enroll student.");
    }
  };

  // Handles editing an enrollment
  const handleEdit = (enrollment) => {
    setEditingEnrollment(enrollment);
    setSelectedStudent(enrollment.student_id);
    setSelectedCourse(enrollment.course_id);
  };

  // Handles updating an enrollment
  const handleUpdate = async (e) => {
    e.preventDefault();

    if (!selectedStudent || !selectedCourse) {
      alert("Please select a student and a course.");
      return;
    }

    const updatedEnrollment = {
      student_id: selectedStudent,
      course_id: selectedCourse,
    };

    const response = await apiRequest(`${baseURL}/enrollments/${editingEnrollment._id}`, "PATCH", updatedEnrollment);

    if (response) {
      alert("Enrollment updated successfully!");
      setEnrollments(
        enrollments.map((enroll) =>
          enroll._id === editingEnrollment._id
            ? {
                ...response,
                student_name: students.find((s) => s.public_id === selectedStudent)?.name || "Unknown Student",
                course_title: courses.find((c) => c._id === selectedCourse)?.title || "Unknown Course",
              }
            : enroll
        )
      );
      setEditingEnrollment(null);
      setSelectedStudent("");
      setSelectedCourse("");
    } else {
      alert("Failed to update enrollment.");
    }
  };

  // Handles deleting an enrollment
  const handleDelete = async (id) => {
    const response = await apiRequest(`${baseURL}/enrollments/${id}`, "DELETE");

    if (response) {
      alert("Enrollment deleted successfully!");
      setEnrollments(enrollments.filter((enrollment) => enrollment._id !== id));
    } else {
      alert("Failed to delete enrollment.");
    }
  };

  return (
    <div className="max-w-lg mx-auto bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4">
        {editingEnrollment ? "Edit Enrollment" : "Enroll a Student"}
      </h2>

      <form onSubmit={editingEnrollment ? handleUpdate : handleSubmit} className="space-y-4">
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

        {/* Course Selection */}
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

        <button
          type="submit"
          className="w-full bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          {editingEnrollment ? "Update Enrollment" : "Enroll Student"}
        </button>

        {editingEnrollment && (
          <button
            type="button"
            className="w-full bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500 mt-2"
            onClick={() => {
              setEditingEnrollment(null);
              setSelectedStudent("");
              setSelectedCourse("");
            }}
          >
            Cancel
          </button>
        )}
      </form>

      {/* Enrollment List */}
      <h3 className="text-lg font-semibold mt-6">Enrollment List</h3>
      <ul className="mt-4 space-y-2">
        {enrollments.map((enrollment) => (
          <li key={enrollment._id} className="flex justify-between p-2 border rounded">
            <span>
              {enrollment.student_name} - {enrollment.course_title}
            </span>
            <div>
              <button
                className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600 mr-2"
                onClick={() => handleEdit(enrollment)}
              >
                Edit
              </button>
              <button
                className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                onClick={() => handleDelete(enrollment._id)}
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default EnrollmentForm;


// The data is sent in_ID's form but converted to the names/title for rendering
