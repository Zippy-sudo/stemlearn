import React, { useState, useEffect } from 'react';

function MyCourses({baseURL}){

    const [courses, setCourses] = useState([]);
    const token = sessionStorage.getItem('Token'); // Assuming the token is stored in localStorage

    useEffect(() => {
        // Fetch enrolled courses
        async function fetchMyCourses() {
            try {
                const response = await fetch(`${baseURL}/courses`, {
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
                <div>
                <h2>My Courses</h2>
                </div>
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
