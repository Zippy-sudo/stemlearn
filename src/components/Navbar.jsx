import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '../App.css';

function Navbar({loggedIn, setLoggedIn}) {
  const whoami = sessionStorage.getItem("Role")

  function handleLogout() {
    sessionStorage.removeItem("Token")
    sessionStorage.removeItem("Role")
    setLoggedIn(!loggedIn)
  }

  return (
    <nav className="navbar">
      <div className="navbar-container">
        
        <div className="logo">STEMLearn</div>

        
        <ul className="navbar-list">
          <li><Link to="/">Home</Link></li>
          {whoami === "STUDENT" ? 
          <li><Link to="/StudentDashboard">Dashboard</Link></li>
          : whoami === "ADMIN" ?
          <li><Link to="/admin/dashboard">Dashboard</Link></li>
          : whoami === "TEACHER" ?
          <li><Link to="teacher/dashboard">Dashboard</Link></li>
          :null
          }
          <li><Link to="/courses">Courses</Link></li>
          { whoami === "STUDENT" ?
          <>
          <li><Link to="/StudentDashboard">Feedback</Link></li>
          <li><Link to="/lessons">Lessons</Link></li>
          </>
          : whoami === "TEACHER" ?
          <li><Link to="/teacher/dashboard">Feedback</Link></li>
          : null}
        </ul>
        {loggedIn ?
        <div className="auth-buttons">
          <button className="login-btn" onClick={handleLogout}>
            <Link to="/">Logout</Link>
          </button>
        </div>
        :
        <div className="auth-buttons">
        <button className="login-btn">
          <Link to="/login">Login</Link>
        </button>
        <button className="signup-btn bg-main-yellow">
          <Link to="/signup">Sign Up</Link>
        </button>
        </div>
        }
      </div>
    </nav>
  );
}

export default Navbar;
