import React from "react"
import { Link } from "react-router-dom"
import { FaHome, FaBook, FaChartBar, FaCommentDots } from "react-icons/fa";

  
function Sidebar(){
    return (
        <div className="h-screen w-64 bg-blue-900 text-white flex flex-col items-center py-6">
          {/* Logo */}
          <h2 className="text-2xl font-bold mb-8">STEMLearn</h2>
    
          {/* Navigation */}
          <nav className="w-full">
            <ul className="space-y-4">
              <li>
                <Link
                  to="/dashboard"
                  className="flex items-center px-6 py-3 w-full hover:bg-blue-700 transition"
                >
                  <FaHome className="mr-3" /> Home
                </Link>
              </li>
              <li>
                <Link
                  to="/mycourses"
                  className="flex items-center px-6 py-3 w-full hover:bg-blue-700 transition"
                >
                  <FaBook className="mr-3" /> My Courses
                </Link>
              </li>
              <li>
                <Link
                  to="/grades"
                  className="flex items-center px-6 py-3 w-full hover:bg-blue-700 transition"
                >
                  <FaChartBar className="mr-3" /> Grades
                </Link>
              </li>
              <li>
                <Link
                  to="/feedback"
                  className="flex items-center px-6 py-3 w-full hover:bg-blue-700 transition"
                >
                  <FaCommentDots className="mr-3" /> Feedback
                </Link>
              </li>
            </ul>
          </nav>
    
          {/* Profile Section */}
          <div className="mt-auto flex flex-col items-center">
            <img
              src="https://via.placeholder.com/50"
              alt="User Avatar"
              className="w-12 h-12 rounded-full mb-2"
            />
            <p className="text-sm">Student Name</p>
          </div>
        </div>
      );
    }
export default Sidebar
