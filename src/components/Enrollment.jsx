import React, { useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

function Enrollment({baseURL}) {
    const { courseId } = useParams();
    const [enrollmentStatus, setEnrollmentStatus] = useState(null);
    const token = sessionStorage.getItem('Token');
    const navigate = useNavigate();
    console.log("Token from localStorage:", token); 

    const handleEnroll = useCallback(async () => {
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
            console.log("Server Response:", data);

            if (response.ok) {
                setEnrollmentStatus("Enrollment successful!");
                navigate("/StudentDashboard")
               // setTimeout(() => navigate('/my-courses'), 2000);
            } else {
                setEnrollmentStatus(data.error || "Failed to enroll in the course. Please try again.");
            }
        } catch (error) {
            console.error("Enrollment Error:", error);
            setEnrollmentStatus("An error occurred. Please check your connection and try again.");
        }
    }, [token, courseId, baseURL, navigate]);

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