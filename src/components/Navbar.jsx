import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '../App.css';

function Navbar() {
  const [searchTerm, setSearchTerm] = useState('');
  const [isDropdown, setIsDropdown] = useState(false);

  
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        
        <div className="logo">STEMLearn</div>

        
        <ul className="navbar-list">
          <li><Link to="/">Home</Link></li>
          <li className="relative">
          <button
            onClick={() => setIsDropdown(!isDropdown)}
            className="focus:outline-none"
          >
            Dashboards ▼
          </button>

          {isDropdown && (
            <ul className="absolute bg-white text-gray-800 mt-2 w-40 rounded-lg shadow-lg">
              <li className="px-4 py-2 hover:bg-gray-200">
                <Link to="/dashboard/student">Student </Link>
              </li>
              <li className="px-4 py-2 hover:bg-gray-200">
                <Link to="/dashboard/teacher">Teacher </Link>
              </li>
              <li className="px-4 py-2 hover:bg-gray-200">
                <Link to="/dashboard/admin">Admin </Link>
              </li>
            </ul>
          )}
        </li>
          <li><Link to="/courses">Courses</Link></li>
          <li><Link to="/lessons">Lessons</Link></li>
          <li><Link to="/feedback">Feedback</Link></li>
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
