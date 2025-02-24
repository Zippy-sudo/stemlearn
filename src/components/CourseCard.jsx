import React, { useEffect, useState } from 'react';

function PopularCourses() {
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    fetch("http://127.0.0.1:5000/api/courses")  // Replace with your actual API URL
      .then(response => response.json())
      .then(data => setCourses(data))
      .catch(error => console.error("Error fetching courses:", error));
  }, []);

  return (
    <div className="popular-courses">
      <h2>Most Popular Courses</h2>
      <div className="courses-container">
        {courses.map((course) => (
          <div key={course.id} className="course-card">
            <h3>{course.title}</h3>
            <p>{course.description}</p>
            <p><strong>Subject:</strong> {course.subject}</p>
            <p><strong>Duration:</strong> {course.duration} weeks</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default PopularCourses;
