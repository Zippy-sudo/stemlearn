import React from 'react';
import '../Courses.css';

const courses = [
  {
    id: 1,
    title: "Science",
    description: "Explore the wonders of science.",
    imageUrl: "https://www.google.com/url?sa=i&url=https%3A%2F%2Fkmco.co.ke%2Frole-of-science-and-technology-in-environmental-management-in-kenya%2F&psig=AOvVaw0nO1QnLqljBaYLCcpCAzpx&ust=1740481430585000&source=images&cd=vfe&opi=89978449&ved=0CBQQjRxqFwoTCMjurOKU3IsDFQAAAAAdAAAAABAE",
    link: "/courses/science"
  },
  {
    id: 2,
    title: "Technology",
    description: "Learn about the latest in tech.",
    link: "/courses/technology"
  },
  {
    id: 3,
    title: "Mathematics",
    description: "Master the world of numbers.",
    link: "/courses/mathematics"
  },
  {
    id: 4,
    title: "Engineering",
    description: "Innovate and build the future.",
    link: "/courses/engineering"
  }
];

function PopularCourses() {
  return (
    <div className="popular-courses">
      <h2>Most Popular Courses</h2>
      <div className="courses-container">
        {courses.map((course) => (
          <div 
            key={course.id} 
            className="course-card" 
            style={{ backgroundImage: `url(${course.imageUrl})` }}
          >
            <div className="overlay">
              <h3>{course.title}</h3>
              <p>{course.description}</p>
              <a href={course.link} className="course-link">
                See Course Guide →
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default PopularCourses;
