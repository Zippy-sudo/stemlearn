import React, { useEffect, useState } from 'react';
import StudentSidebar from '../components/StudentSidebar';

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
                    console.error('Failed to fetch courses:', data.Error);
                    let capname = ""
                    for (const word of data.Name.split(" ")) 
                        {capname += (word).slice(0,1).toUpperCase() + word.slice(1).toLowerCase() + " "}
                    setStudentName(capname)
                }
            } catch (error) {
                console.error(`Failed to fetch courses:`, error);
            }
        }

        fetchMyCourses();
    }, [token, baseURL]);

    return (
        <div className='flex'>
            <StudentSidebar studentName={studentName}/>
            <button onClick={() => document.getElementById('my-courses-section').scrollIntoView({ behavior: 'smooth' })}>
            </button>

            <div id="my-courses-section" className='flex-grow text-center'>
                <div className='text-center  mt-4 pt-4 pb-4 bg-main-yellow'>
                <h2 className='text-xl'>My Courses</h2>
                </div>
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
                    <p>You are not enrolled in any courses.</p>
                )}
            </div>
        </div>
    );
}

export default StudentDashboard;