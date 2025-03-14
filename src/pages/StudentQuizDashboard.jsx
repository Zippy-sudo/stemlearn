import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../StudentQuizDashboard.css";

const StudentQuizDashboard = ({ baseURL }) => {
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  let error = "";

  const token = sessionStorage.getItem("Token");

  useEffect(() => {
    const fetchQuizzes = async () => {
      try {
        const response = await fetch(`${baseURL}/quizzes`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

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
    if (!quizId) {
      console.error("Quiz ID is undefined!");
      return;
    }
    navigate(`/Quiz/${quizId}`);
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="student-dashboard">
      <div className="w-full">
        <h1 className="text-center">Quiz Page</h1>
      </div>

      <div className="upcoming-quizzes">
        <h3>Upcoming Quizzes</h3>
        <table>
          <thead>
            <tr>
              <th>Lesson</th>
              <th>Course</th>
              <th>Due Date</th>
              <th>Attempts</th>
              <th>Top Score</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {quizzes.map((quiz, index) => (
              <tr key={index}>
                <td>{quiz.lesson.title}</td>
                <td>{quiz.lesson.course.title}</td>
                <td>{quiz.due_date}</td>
                <td>{quiz.quiz_attempts.length}</td>
                <td>{quiz.quiz_attempts.length > 0 ? quiz.quiz_attempts.sort((a, b) => b.grade - a.grade)[0]['grade']: 0}</td>
                <td>
                  {quiz.quiz_attempts.length !== 3 ? 
                  <button onClick={() => handleStartQuiz(quiz._id)}>
                    {" "}
                    Start Quiz
                  </button>
                  :
                  <p>You're out of attempts</p>
                }
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
