
import './App.css';
import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Homepage from './pages/Homepage';
import SignUp from "./components/SignUp";
import Login from "./components/Login";
import Navbar from './components/Navbar';

import AdmDashboard from './pages/AdmDashboard';
import AdminRoute from './components/protectedRoute';
import CoursesPage from './pages/Coursepage';
import StudentDashboard from './pages/StudentDashboard';
import MyCourses from './components/MyCourses';
import Enrollment from './components/Enrollment';

function App() {
  const baseURL = "http://127.0.0.1:5555"
  const [loggedIn, setLoggedIn] = useState(false)

  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Homepage loggedIn={loggedIn} baseURL={baseURL}/>} />
        <Route path="/signup" element={<SignUp setLoggedIn={setLoggedIn} baseURL={baseURL}/>} />
        <Route path="/login" element={<Login setLoggedIn={setLoggedIn} baseURL={baseURL}/>} />
        <Route path="/AdmDashboard" element={<AdmDashboard baseURL={baseURL}/>} />
        <Route path="/admin/dashboard" element={<AdminRoute><AdmDashboard baseURL={baseURL}/></AdminRoute>} />
        <Route path="/courses" element={<CoursesPage/>}/>
        <Route path="/studentDashboard" element={<StudentDashboard/>}/>
        <Route path="/mycourses" element ={<MyCourses/>}/>
        <Route path="/enroll/:courseId" element={<Enrollment/>}/>

      </Routes>
    </Router>
 
    
  )}

export default App;
