import React from 'react';
import { Link } from 'react-router-dom';
import '../CoursesCard.css';

function CourseCard({course, loggedIn}) {
  // const [course, setCourse] = useState(null);
  // const [loading, setLoading] = useState(true);
  // const [error, setError] = useState(null);

  return (
    <div className="course-card">
      <div
        className="course-image"
        style={{ backgroundImage: `url(${course.imageUrl || 'default-image.jpg'})` }}
      ></div>

      <div className="course-info">
        <p className="course-subject">🏷 {course.subject}</p>
        <p className="course-duration">⏳ {course.duration} Weeks</p>
        <h3 className="course-title">{course.title}</h3>
        <p className="course-description">
          {course.description.length > 80 ? `${course.description.substring(0, 80)}...` : course.description}
        </p>
          <Link to={`/Courses`} className="view-course">
          View Course →
        </Link>
      </div>
    </div>
  );
}

export default CourseCard;
