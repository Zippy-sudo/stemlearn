
import './App.css';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Homepage from './pages/Homepage';
import SignUp from "./components/SignUp";
import Login from "./components/Login";

function App() {
  return (
    <>
    <Router>
      <Routes>
        <Route path="/" element={<SignUp />} />
        <Route path="/Login" element={<Login />} />
      </Routes>
    </Router>
    <Homepage/>
    </>
  )}

export default App;
