import React from 'react';
import '../Hero.css';

function HeroSection() {
  return (
    <div className="hero">
      <div className="hero-overlay">
        <div className="hero-content">
          <h1>Learn <span className="highlight">STEM</span> Today!</h1>
          <p>Your Gateway to Free & Interactive STEM Education</p>
          <p>Learn. Explore. Innovate – Your STEM Journey Starts Here!</p>
        </div>
      </div>
    </div>
  );
}

export default HeroSection;
