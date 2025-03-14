import React from 'react';
import { Link } from 'react-router-dom';
import '../App.css';

function Navbar({loggedIn, setLoggedIn}) {
  const whoami = sessionStorage.getItem("Role")

  function handleLogout() {
    sessionStorage.removeItem("Token")
    sessionStorage.removeItem("Role")
    setLoggedIn(false)
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
          <li><Link to="/AdminDashboard">Dashboard</Link></li>
          : whoami === "TEACHER" ?
          <li><Link to="/TeacherDashboard">Dashboard</Link></li>
          :null
          }
          <li><Link to="/Courses">Courses</Link></li>
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
          <Link to="/Login">Login</Link>
        </button>
        <button className="signup-btn bg-main-yellow">
          <Link to="/Signup">Sign Up</Link>
        </button>
        </div>
        }
      </div>
    </nav>
  );
}

export default Navbar;
