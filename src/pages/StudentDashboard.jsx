import React, { useEffect, useState } from 'react';
import Sidebar from '../components/Sidebar';

function StudentDashboard({baseURL}) {
    const [enrollments, setEnrollments] = useState([]);
    const [studentName, setStudentName] = useState("")
    const token = sessionStorage.getItem('Token'); // Assuming the token is stored in sessionStorage

    useEffect(() => {
        // Fetch enrolled courses
        async function fetchMyCourses() {
            try {
                const response = await fetch(`${baseURL}/enrollments`, {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                });
                const data = await response.json();
                if (response.ok) {
                    setEnrollments(data);
                    let capname = ""
                    for (const word of data[0].student.name.split(" ")) 
                        {capname += (word).slice(0,1).toUpperCase() + word.slice(1).toLowerCase() + " "}
                    setStudentName(capname)
                } else {
                    console.error('Failed to fetch courses:', data.error);
                }
            } catch (error) {
                console.error(`Failed to fetch courses:`, error);
            }
        }

        fetchMyCourses();
    }, [token]);

    return (
        <div>
            <h1>Student Dashboard</h1>
            <Sidebar studentName={studentName}/>
            <button onClick={() => document.getElementById('my-courses-section').scrollIntoView({ behavior: 'smooth' })}>
                My Courses
            </button>

            <div id="my-courses-section">
                <h2>My Courses</h2>
                {enrollments.length > 0 ? (
                    <ul>
                        {enrollments.map((enrollment) => (
                            <li key={enrollment._id}>
                                <h3>{enrollment.course.title}</h3>
                                <p>{enrollment.course.description}</p>
                                <p><strong>Subject:</strong> {enrollment.course.subject}</p>
                                <p><strong>Duration:</strong> {enrollment.course.duration} Years</p>
                                <p><strong>Enrolled On:</strong> {enrollment.enrolled_on}</p>
                                <p><strong>Completion:</strong> {(enrollment.progresses).length > 0 ? `${Math.round((enrollment.progresses).length/(enrollment.course.lessons).length) * 100} %`  : "0%"}</p>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p>You are not enrolled in any courses yet.</p>
                )}
            </div>
        </div>
    );
}

export default StudentDashboard;