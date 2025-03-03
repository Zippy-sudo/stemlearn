
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
  const baseURL = "https://stemlearn-app-db.onrender.com"
  const [loggedIn, setLoggedIn] = useState(false)

  return (
    <Router>
      <Navbar loggedIn={loggedIn}/>
      <Routes>
        <Route path="/" element={<Homepage loggedIn={loggedIn} baseURL={baseURL}/>} />
        <Route path="/Signup" element={<SignUp setLoggedIn={setLoggedIn} baseURL={baseURL}/>} />
        <Route path="/Login" element={<Login setLoggedIn={setLoggedIn} baseURL={baseURL}/>} />
        <Route path="/AdmDashboard" element={<AdmDashboard baseURL={baseURL}/>} />
        <Route path="/admin/dashboard" element={<AdminRoute><AdmDashboard baseURL={baseURL}/></AdminRoute>} />
        <Route path="/Courses" element={<CoursesPage baseURL={baseURL} loggedIn={loggedIn}/>}/>
        <Route path="/StudentDashboard" element={<StudentDashboard baseURL={baseURL}/>}/>
        <Route path="/Mycourses" element ={<MyCourses/>}/>
        <Route path="/Enroll/:courseId" element={<Enrollment baseURL={baseURL}/>}/>

      </Routes>
    </Router>
 
    
  )}

export default App;
