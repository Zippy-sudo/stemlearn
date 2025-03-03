import React, { useEffect, useState } from 'react';
import CourseCard from './CourseCard'; 
import '../Courselist.css';

function CourseList({loggedIn, baseURL}) {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await fetch(`${baseURL}/courses`, {
          method: "GET", 
          headers: {
            "Content-Type": "application/json",
            "Accept": "application/json",
            Authorization: `Bearer ${sessionStorage.getItem("Token")}`, 
          },
        });
  
        if (!response.ok) {
          throw new Error(`Failed to fetch courses. Status: ${response.status}`);
        }
  
        const data = await response.json();
        setCourses(data.slice(0, 3)); // Limiting to 3 courses
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
  
    fetchCourses();
  }, [baseURL]);
  

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
