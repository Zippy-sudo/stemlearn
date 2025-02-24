import React from 'react';
import { Link } from 'react-router-dom';
import '../App.css';

function Features() {
  return (
    <div className="features">
      <div className="feature-card">
        <h3>Find a course</h3>
        <p>Search for courses that match your needs.</p>
        <Link to="/courses">Start Now →</Link>
      </div>

      <div className="feature-card">
        <h3>Get Enrolled</h3>
        <p>Enroll in courses and start your STEM journey.</p>
        <Link to="/signup">Join Now →</Link>
      </div>

      <div className="feature-card">
        <h3>Find Lessons</h3>
        <p>Access hands-on lessons to improve your skills.</p>
        <Link to="/lessons">Explore →</Link>
      </div>
    </div>
  );
}

export default Features;
