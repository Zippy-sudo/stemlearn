
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
  const [loggedIn, setLoggedIn] = useState(false)

  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Homepage loggedIn={loggedIn}/>} />
        <Route path="/signup" element={<SignUp setLoggedIn={setLoggedIn}/>} />
        <Route path="/login" element={<Login setLoggedIn={setLoggedIn}/>} />
        <Route path="/AdmDashboard" element={<AdmDashboard />} />
        <Route path="/admin/dashboard" element={<AdminRoute><AdmDashboard /></AdminRoute>} />
      </Routes>
    </Router>
  )
}

export default App;
