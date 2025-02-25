import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import '../Courses.css';

function CourseCard({ courseId }) {
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch(`http://127.0.0.1:5555/courses/${courseId}`) 
      .then((response) => {
        if (!response.ok) {
          throw new Error('Failed to fetch course');
        }
        return response.json();
      })
      .then((data) => {
        setCourse(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, [courseId]);

  if (loading) return <p>Loading course...</p>;
  if (error) return <p>Error: {error}</p>;

  const defaultImage =  { Image: 'https://via.placeholder.com/200x200'};
  const imageUrl =  defaultImage["Image"];


  return (
    <div className="course-card">
      <div
        className="course-image"
         style={{ backgroundImage: `url(${imageUrl})` }}
      ></div>

      <div className="course-info">
        <p className="course-subject">🏷 {course.subject}</p>
        <p className="course-duration">⏳ {course.duration} Weeks</p>
        <h3 className="course-title">{course.title}</h3>
        <p className="course-description">
          {course.description.length > 80 ? `${course.description.substring(0, 80)}...` : course.description}
        </p>

        
        <Link to={`/courses/${course._id}`} className="view-course">
          View Course →
        </Link>
      </div>
    </div>
  );
}

export default CourseCard;
