import React, { useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
//import { jwtDecode } from 'jwt-decode';

function Enrollment() {
    const { courseId } = useParams();
    const navigate = useNavigate();
    const [enrollmentStatus, setEnrollmentStatus] = useState(null);
    const token = sessionStorage.getItem('Token');
    console.log("Course ID:", courseId); // Debugging line


    /*const getStudentIdFromToken = (token) => {
        try {
            const decoded = jwtDecode(token);
            return decoded.student_id; // Ensure this matches the token field
        } catch (error) {
            console.error("Failed to decode token:", error);
            return null;
        }
    };*/

    const handleEnroll = useCallback(async () => {

        try {
            const response = await fetch('http://127.0.0.1:5555/enrollments', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                credentials: 'include',
                body: JSON.stringify({
                    course_id: courseId,
                }),
            });

            const data = await response.json();
            console.log("Server Response:", data);

            if (response.ok) {
                setEnrollmentStatus("Enrollment successful!");
                setTimeout(() => navigate('/mycourses?refresh=true'), 2000);
            } else {
                setEnrollmentStatus(data.error || "Failed to enroll in the course. Please try again.");
            }
        } catch (error) {
            console.error("Enrollment Error:", error);
            setEnrollmentStatus("An error occurred. Please check your connection and try again.");
        }
    }, [token, courseId, navigate]);

    return (
        <div className="p-4">
            <h1 className="text-2xl font-bold mb-4">Enrollment Page</h1>
            <button
                onClick={handleEnroll}
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
                Enroll in this Course
            </button>
            {enrollmentStatus && (
                <p className={`mt-4 ${enrollmentStatus.includes("success") ? "text-green-600" : "text-red-600"}`}>
                    {enrollmentStatus}
                </p>
            )}
        </div>
    );
}

export default Enrollment;