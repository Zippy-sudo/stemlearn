import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const TeacherQuizzesDashboard = ({ baseURL }) => {
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingQuizId, setEditingQuizId] = useState(null);
  const [editData, setEditData] = useState({});
  const token = sessionStorage.getItem("Token");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchQuizzes = async () => {
      try {
        const response = await fetch(`${baseURL}/quizzes`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await response.json();
        if (!response.ok)
          throw new Error(data.Error || "Failed to fetch quizzes");
        setQuizzes(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchQuizzes();
  }, [token, baseURL]);

  const handleCreateQuiz = () => {
    navigate("/create-quiz");
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="teacher-dashboard">
      <header>
        <h1>EduSystem</h1>
        <nav>
          <span>Home</span> &gt; <span>Quizzes Dashboard</span>
        </nav>
        <div className="user-profile">
          <span>Sarah Wilson</span>
          <span>Science Teacher</span>
        </div>
      </header>

      <div className="dashboard-overview">
        <h2>Quizzes Dashboard</h2>
        <button className="create-quiz-button" onClick={handleCreateQuiz}>
          Create New Quiz
        </button>
      </div>

      <div className="active-quizzes">
        <h3>Active Quizzes</h3>
        <table>
          <thead>
            <tr>
              <th>Associated Lesson</th>
              <th>Due Date</th>
              <th>Submissions</th>
              <th>Average Score</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {quizzes.map((quiz) => (
              <tr key={quiz._id}>
                <td>{quiz.lesson?.title || "Not available"}</td>
                <td>{quiz.created_at}</td>
                <td>
                  {quiz.submissions ? quiz.submissions.length : 0} /{" "}
                  {quiz.students ? quiz.students.length : 0}
                </td>
                <td>{quiz.averageScore}%</td>
                <td>{quiz.status}</td>
                <td>
                  <button onClick={() => navigate(`/edit-quiz/${quiz._id}`)}>
                    Edit
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

export default TeacherQuizzesDashboard;
