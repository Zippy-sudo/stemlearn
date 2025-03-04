import React from "react"
import { Link } from "react-router-dom"
import { FaHome, FaBook, FaChartBar, FaCommentDots } from "react-icons/fa";
import profile from "../images/profile.png"
  
function Sidebar({studentName}){
  console.log(studentName)
    return (
        <div className="h-screen w-64 bg-blue-900 text-white flex flex-col items-center py-6">
          {/* Logo */}
          <h2 className="text-2xl font-bold mb-8">STEMLearn</h2>
    
          {/* Navigation */}
          <nav className="w-full">
            <ul className="space-y-4">
              <li>
                <Link
                  to="/"
                  className="flex items-center px-6 py-3 w-full hover:bg-blue-700 transition"
                >
                  <FaHome className="mr-3" /> Home
                </Link>
              </li>
              <li>
                <Link
                  to="/Mycourses"
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
              src={profile}
              alt="User Avatar"
              className="w-12 h-12 rounded-full mb-2"
            />            <p className="text-sm">{studentName}</p>

          </div>
        </div>
      );
    }
export default Sidebar
