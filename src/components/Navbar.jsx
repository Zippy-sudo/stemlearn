import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '../App.css';

function Navbar({loggedIn}) {
  const [searchTerm, setSearchTerm] = useState('');
  const whoami = sessionStorage.getItem("Role")
  
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        
        <div className="logo">STEMLearn</div>

        
        <ul className="navbar-list">
          <li><Link to="/">Home</Link></li>
          {whoami === "STUDENT" && loggedIn ? 
          <li><Link to="/StudentDashboard">Dashboard</Link></li>
          : whoami === "ADMIN" && loggedIn ?
          <li><Link to="/admin/dashboard">Dashboard</Link></li>
          : null
          }
          <li><Link to="/courses">Courses</Link></li>
          <li><Link to="/lessons">Lessons</Link></li>
          <li><Link to="/StudentDashboard">Feedback</Link></li>
        </ul>

      
        <input
          type="text"
          placeholder="Search..."
          value={searchTerm}
          onChange={handleSearchChange}
          className="search-input"
        />

        
        <div className="auth-buttons">
          <button className="login-btn">
            <Link to="/login">Login</Link>
          </button>
          <button className="signup-btn">
            <Link to="/signup">Sign Up</Link>
          </button>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
