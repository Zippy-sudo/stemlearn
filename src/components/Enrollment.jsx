import React, { useState, useEffect, useCallback } from 'react';
import { Navigate, useParams, useNavigate } from 'react-router-dom';

function Enrollment({baseURL}) {
    const { courseId } = useParams(); // Get the course ID from the URL
    const [enrollmentStatus, setEnrollmentStatus] = useState(null);
    const token = sessionStorage.getItem('Token');
    const navigate = useNavigate();
    console.log("Token from localStorage:", token); // Assuming the token is stored in sessionStorage

    // Memoize the handleEnroll function using useCallback
    const handleEnroll = useCallback(async () => {
    
        console.log("Attempting Enrollment...");
        console.log("Course ID:", courseId);
        console.log("Authorization Header:", `Bearer ${token}`);
    
        try {
            const response = await fetch(`${baseURL}/enrollments`, {
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
            console.log("Server Response:", data); // Log full response
    
            if (response.ok) {
                setEnrollmentStatus("Enrollment successful!");
                navigate("/StudentDashboard")
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