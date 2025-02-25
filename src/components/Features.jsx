import React from 'react';
import { Link } from 'react-router-dom';
import '../Features.css'; 

function Features() {
  return (
    <div className="features">
      <div className="info">
        <p>🚀 Unlock the Future with STEMLearn! 🌍🔬</p>
        <p>
          At STEMLearn, our mission is to foster a love for science, technology, engineering, and mathematics among students of all ages.
        </p>
        <p>
          We believe that every child has the potential to excel in these fields with the right guidance and resources.
          Start learning today and shape the future with STEM! 🚀🔍 #LearnWithSTEMLearn
        </p>
        <button className="btn-primary">Get Started</button>
      </div>

      <div className="feature-cards">
        <div className="feature-card">
          <span className="icon">🔍</span>
          <h3>Find a Course</h3>
          <p>Search by subject, course, or region to find the right course for you.</p>
          <Link to="/courses" className="btn-link">Get Started →</Link>
        </div>

        <div className="feature-card">
          <span className="icon">📅</span>
          <h3>Get Enrolled</h3>
          <p>Search for STEM courses and enroll in expert-led lessons.</p>
          <Link to="/signup" className="btn-link">Get Started →</Link>
        </div>

        <div className="feature-card">
          <span className="icon">🏆</span>
          <h3>Find Lessons</h3>
          <p>Complete interactive lessons with quizzes and assignments.</p>
          <Link to="/lessons" className="btn-link">Get Started →</Link>
        </div>
      </div>
    </div>
  );
}

export default Features;
