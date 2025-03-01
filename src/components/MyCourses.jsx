import React, { useState, useEffect } from 'react';

function MyCourses(){

    const [courses, setCourses] = useState([]);
    const token = localStorage.getItem('token'); // Assuming the token is stored in localStorage

    useEffect(() => {
        // Fetch enrolled courses
        async function fetchMyCourses() {
            try {
                const response = await fetch('http://127.0.0.1:5555/my-courses', {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                });
                const data = await response.json();
                if (response.ok) {
                    setCourses(data);
                } else {
                    console.error('Failed to fetch courses:', data.error);
                }
            } catch (error) {
                console.error('Failed to fetch courses:', error);
            }
        }

        fetchMyCourses();
    }, [token]);

    return (
        <div>
        
            <div id="my-courses-section">
                <h2>My Courses</h2>
                {courses.length > 0 ? (
                    <ul>
                        {courses.map(course => (
                            <li key={course.id}>
                                <h3>{course.title}</h3>
                                <p>{course.description}</p>
                                <p><strong>Subject:</strong> {course.subject}</p>
                                <p><strong>Duration:</strong> {course.duration} hours</p>
                                <p><strong>Enrolled On:</strong> {course.enrolled_on}</p>
                                <p><strong>Completion:</strong> {course.completion_percentage}%</p>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p>You are not enrolled in any courses yet.</p>
                )}
            </div>
        </div>
  
  )

}



export default MyCourses
