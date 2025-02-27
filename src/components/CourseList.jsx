import React, { useEffect, useState } from 'react';
import CourseCard from './CourseCard'; 
import '../Courselist.css';

function CourseList({loggedIn, baseURL}) {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch(`${baseURL}/unauthCourses`) 
      .then((response) => {
        if (!response.ok) {
          throw new Error('Failed to fetch courses');
        }
        return response.json();
      })
      .then((data) => {
        setCourses(data.slice(0, 3)); 
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  if (loading) return <p>Loading courses...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="popular-courses">
      <h2>Most Popular Courses</h2>
      <div className="courses-container">
        {courses.map((course) => (
          <CourseCard key={course._id} course={course} loggedIn={loggedIn} />
        ))}
      </div>
    </div>
  );
}

export default CourseList;
