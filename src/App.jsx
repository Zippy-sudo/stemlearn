import "./App.css";
import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Homepage from "./pages/Homepage";
import SignUp from "./components/SignUp";
import Login from "./components/Login";
import Navbar from "./components/Navbar";
import AdmDashboard from "./pages/AdmDashboard";
import CoursesPage from "./pages/Coursepage";
import StudentDashboard from "./pages/StudentDashboard";
import MyCourses from "./components/MyCourses";
import Enrollment from "./components/Enrollment";
import TeacherDashboard from "./pages/TeacherDashboard";
import StudentQuizDashboard from "./pages/StudentQuizDashboard";
import LessonsPage from "./pages/LessonsPage";

import QuizPage from "./components/QuizPage";

import TeacherQuizzesDashboard from "./pages/TeacherQuizzesDashboard";
import CreateQuiz from "./pages/CreateQuiz";

function App() {
  const baseURL = "http://127.0.0.1:5555";
  const [loggedIn, setLoggedIn] = useState(false);
  useEffect(() => {
    if (sessionStorage.getItem("Token")) {
      setLoggedIn(true);
    }
  }, []);

  console.log(loggedIn);

  return (
    <Router>
      <Navbar loggedIn={loggedIn} setLoggedIn={setLoggedIn} />
      <Routes>
        <Route
          path="/"
          element={<Homepage loggedIn={loggedIn} baseURL={baseURL} />}
        />
        <Route
          path="/Signup"
          element={<SignUp setLoggedIn={setLoggedIn} baseURL={baseURL} />}
        />
        <Route
          path="/Login"
          element={<Login setLoggedIn={setLoggedIn} baseURL={baseURL} />}
        />
        <Route
          path="/AdmDashboard"
          element={<AdmDashboard baseURL={baseURL} />}
        />
        <Route
          path="/admin/dashboard"
          element={<AdmDashboard baseURL={baseURL} />}
        />
        <Route
          path="/TeacherDashboard"
          element={<TeacherDashboard baseURL={baseURL} />}
        />
        <Route
          path="/teacher/dashboard"
          element={<TeacherDashboard baseURL={baseURL} />}
        />
        <Route
          path="/Courses"
          element={<CoursesPage baseURL={baseURL} loggedIn={loggedIn} />}
        />
        <Route
          path="/StudentDashboard"
          element={<StudentDashboard baseURL={baseURL} />}
        />
        <Route path="/Mycourses" element={<MyCourses />} />
        <Route
          path="/Enroll/:courseId"
          element={<Enrollment baseURL={baseURL} />}
        />
        <Route
          path="/teacher-quizpage"
          element={<StudentQuizDashboard baseURL={baseURL} />}
        />
        <Route path="/lessons" element={<LessonsPage baseURL={baseURL} />} />
        <Route
          path="/studentquiz"
          element={<StudentQuizDashboard baseURL={baseURL} />}
        />

        <Route path="/quiz/:quizId" element={<QuizPage baseURL={baseURL} />} />
        <Route
          path="/Teacherquiz"
          element={<TeacherQuizzesDashboard baseURL={baseURL} />}
        />
        <Route path="/create-quiz" element={<CreateQuiz baseURL={baseURL} />} />
      </Routes>
    </Router>
  );
}

export default App;
