import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const StudentQuizDashboard = ({ baseURL }) => {
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const token = sessionStorage.getItem("Token");

  useEffect(() => {
    const fetchQuizzes = async () => {
      try {
        const response = await fetch(`${baseURL}/quizzes`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        console.log("Fetching quizzes from:", `${baseURL}/quizzes`);
        if (!response.ok) {
          throw new Error("Failed to fetch quizzes");
        }

        const data = await response.json();
        setQuizzes(data);
      } catch (err) {
        console.error("Fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchQuizzes();
  }, [token, baseURL]);

  const handleStartQuiz = (quizId) => {
    console.log("Starting quiz with ID:", quizId);
    if (!quizId) {
      console.error("Quiz ID is undefined!");
      return;
    }
    navigate(`/quiz/${quizId}`);
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="student-dashboard">
      <header>
        <h1>Student Dashboard</h1>
        <nav>
          <span>Home</span> &gt; <span>Quizzes</span>
        </nav>
      </header>

      <div className="upcoming-quizzes">
        <h3>Upcoming Quizzes</h3>
        <table>
          <thead>
            <tr>
              <th>Quiz</th>
              <th>Course</th>
              <th>Created At</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {quizzes.map((quiz, index) => (
              <tr key={index}>
                <td>{quiz.lesson.title}</td>
                <td>{quiz.lesson.course.title}</td>
                <td>{new Date(quiz.created_at).toLocaleDateString()}</td>
                <td>{quiz.attempts}</td>
                <td>
                  <button onClick={() => handleStartQuiz(quiz._id)}>
                    {" "}
                    Start Quiz
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default StudentQuizDashboard;
