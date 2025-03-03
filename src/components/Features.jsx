import React from 'react';
import { Link, useNavigate} from 'react-router-dom';
import '../Features.css'; 

function Features() {
  const navigate = useNavigate()
  function HandleClick() {
    navigate("/signup")
  }

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
        <button className="btn-primary" onClick={HandleClick}>Get Started</button>
      </div>

      <div className="feature-cards">
        <div className="feature-card">
          <span className="icon">🔍</span>
          <h3>Find a Course</h3>
          <p>Search by subject, course, or region to find the right course for you.</p>
          <Link to="/Courses" className="btn-link">Get Started →</Link>
        </div>

        <div className="feature-card">
          <span className="icon">📅</span>
          <h3>Get Enrolled</h3>
          <p>Search for STEM courses and enroll in expert-led lessons.</p>
        </div>

        <div className="feature-card">
          <span className="icon">🏆</span>
          <h3>Find Lessons</h3>
          <p>Complete interactive lessons with quizzes and assignments.</p>
        </div>
      </div>
    </div>
  );
}

export default Features;
