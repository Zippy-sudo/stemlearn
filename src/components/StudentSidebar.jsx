import React from "react";
import { Link } from "react-router-dom";
import { FaHome, FaBook, FaChartBar, FaCommentDots, FaCertificate } from "react-icons/fa";
import profile from "../images/profile.png";

function StudentSidebar({ studentName }) {
  return (
    <div className="h-screen bg-gray-700 mr-2">
      <div className="w-64 bg-gray-700 text-white flex flex-col items-start  items-center mr-6 p-4">
        {/* Profile Section */}
        <div className="mt-auto flex flex-col items-center">
          <img
            src={profile}
            alt="User Avatar"
            className="w-12 h-12 rounded-full mb-2"
          />{" "}
          <p className="text-smm bg-transparent text-white">{studentName}</p>
        </div>

        {/* Navigation */}
        <nav className="w-full">
          <ul className="space-y-4">
            <li>
              <Link
                to="/"
                className="flex items-center px-6 py-3 w-full hover:bg-gray-700 transition"
              >
                <FaHome className="mr-3" /> Home
              </Link>
            </li>
            <li>
              <Link
                to="/StudentDashboard"
                className="flex items-center px-6 py-3 w-full hover:bg-gray-700 transition"
              >
                <FaBook className="mr-3" /> My Courses
              </Link>
            </li>
            <li>
              <Link
                to="/grades"
                className="flex items-center px-6 py-3 w-full hover:bg-gray-700 transition"
              >
                <FaChartBar className="mr-3" /> Grades
              </Link>
            </li>
            <li>
              <Link
                to="/feedback"
                className="flex items-center px-6 py-3 w-full hover:bg-gray-700 transition"
              >
                <FaCommentDots className="mr-3" /> Feedback
              </Link>
            </li>
            <li>
              <Link
                to="/StudentCertificates"
                className="flex items-center px-6 py-3 w-full hover:bg-gray-700 transition"
              >
                <FaCertificate className="mr-3" /> Certifications
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </div>
  );
}
export default StudentSidebar;
