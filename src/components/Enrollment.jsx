import React, { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode'; // Correct import

function Enrollment() {
    const { courseId } = useParams(); // Get the course ID from the URL
    const [enrollmentStatus, setEnrollmentStatus] = useState(null);
    const token = localStorage.getItem('Token');
    console.log("Token from localStorage:", token); // Assuming the token is stored in localStorage

    // Function to decode the token and get the student's public_id
    const getStudentIdFromToken = (token) => {
        try {
            const decoded = jwtDecode(token); // Use the named import
            return decoded.public_id; // Assuming the token contains the student's public_id
        } catch (error) {
            console.error("Failed to decode token:", error);
            return null;
        }
    };

    // Memoize the handleEnroll function using useCallback
    const handleEnroll = useCallback(async () => {
        const studentId = getStudentIdFromToken(token);
        if (!studentId) {
            setEnrollmentStatus("Failed to fetch student ID. Please sign in again.");
            return;
        }
    
        console.log("Attempting Enrollment...");
        console.log("Student ID:", studentId);
        console.log("Course ID:", courseId);
        console.log("Authorization Header:", `Bearer ${token}`);
    
        try {
            const response = await fetch('http://127.0.0.1:5555/enrollments', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                credentials: 'include',
                body: JSON.stringify({
                    student_id: studentId,
                    course_id: courseId,
                }),
            });
    
            const data = await response.json();
            console.log("Server Response:", data); // Log full response
    
            if (response.ok) {
                setEnrollmentStatus("Enrollment successful!");
               // setTimeout(() => navigate('/my-courses'), 2000);
            } else {
                setEnrollmentStatus(data.error || "Failed to enroll in the course.");
            }
        } catch (error) {
            console.error("Enrollment Error:", error);
            setEnrollmentStatus("An error occurred. Please check the console.");
        }
    }, [token, courseId]);
    

    // Automatically trigger enrollment when the page loads
    useEffect(() => {
        handleEnroll();
    }, [handleEnroll]); // Add handleEnroll to the dependency array

    return (
        <div className="p-4">
            <h1 className="text-2xl font-bold mb-4">Enrollment Page</h1>
            {enrollmentStatus && (
                <p className={`mt-4 ${enrollmentStatus.includes("success") ? "text-green-600" : "text-red-600"}`}>
                    {enrollmentStatus}
                </p>
            )}
        </div>
    );
}

export default Enrollment;