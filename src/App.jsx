/* eslint-disable no-unused-vars */
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
import TeacherDashboard from "./pages/TeacherDashboard";
import StudentQuizDashboard from "./pages/StudentQuizDashboard";
import LessonsPage from "./pages/LessonsPage";
import StudentCertificates from "./components/StudentCertificates";
import AssignmentSubmissionForm from "./components/AssignmentSubmit";

import QuizPage from "./components/QuizPage";

import TeacherQuizzesDashboard from "./pages/TeacherQuizzesDashboard";
import CreateQuiz from "./pages/CreateQuiz";
import EditQuiz from "./pages/EditQuiz";

function App() {
  const baseURL = "https://stemlearn-db.onrender.com";
  const [loggedIn, setLoggedIn] = useState(false);
  useEffect(() => {
    if (sessionStorage.getItem("Token")) {
      setLoggedIn(true);
    }
  }, []);

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
        <Route
          path="/teacher-quizpage"
          element={<StudentQuizDashboard baseURL={baseURL} />}
        />
        <Route
          path="/lessons/:courseId"
          element={<LessonsPage baseURL={baseURL} />}
        />
        <Route
          path="/studentquiz"
          element={<StudentQuizDashboard baseURL={baseURL} />}
        />
        <Route
          path="/StudentCertificates"
          element={<StudentCertificates baseURL={baseURL} />}
        />

        <Route path="/quiz/:quizId" element={<QuizPage baseURL={baseURL} />} />
        <Route
          path="/Teacherquiz"
          element={<TeacherQuizzesDashboard baseURL={baseURL} />}
        />
        <Route path="/create-quiz" element={<CreateQuiz baseURL={baseURL} />} />

        <Route
          path="/assignments/:lessonsId"
          element={<AssignmentSubmissionForm baseURL={baseURL} />}
        />
        <Route path="/edit-quiz/:id" element={<EditQuiz baseURL={baseURL} />} />
      </Routes>
    </Router>
  );
}

export default App;
