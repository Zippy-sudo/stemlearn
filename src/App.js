
import './App.css';
import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Homepage from './pages/Homepage';
import SignUp from "./components/SignUp";
import Login from "./components/Login";
import Navbar from './components/Navbar';

function App() {
  const [loggedIn, setLoggedIn] = useState(false)

  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Homepage loggedIn={loggedIn}/>} />
        <Route path="/signup" element={<SignUp setLoggedIn={setLoggedIn}/>} />
        <Route path="/login" element={<Login setLoggedIn={setLoggedIn}/>} />
      </Routes>
    </Router>
  )
}

export default App;
