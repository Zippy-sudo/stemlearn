
import './App.css';
import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Homepage from './pages/Homepage';
import SignUp from "./components/SignUp";
import Login from "./components/Login";
import Navbar from './components/Navbar';

import AdmDashboard from './pages/AdmDashboard';
import AdminRoute from './components/protectedRoute';

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
      </Routes>
    </Router>
 
    
  )}

export default App;
