import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import "../QuizPage.css";
const QuizPage = ({ baseURL }) => {
  const { quizId } = useParams();
  const [quiz, setQuiz] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedOption, setSelectedOption] = useState(null); // Track selected option for the current question
  const [showReview, setShowReview] = useState(false);
  const [submissionMessage, setSubmissionMessage] = useState("");

  const token = sessionStorage.getItem("Token");

  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        if (!quizId) throw new Error("Invalid quiz ID");

        const url = `${baseURL}/quizzes/${quizId}`;
        console.log("Fetching quiz from:", url);

        const response = await fetch(url, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        console.log("Quiz data:", data);

        setQuiz(data);
      } catch (err) {
        console.error("Fetch error:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchQuiz();
  }, [quizId, baseURL, token]);

  const handleOptionChange = (event) => {
    setSelectedOption(event.target.value); // Update selected option
  };

  const handleReviewToggle = () => {
    setShowReview((prev) => !prev); // Toggle review section visibility
  };

  const handleSubmit = async () => {
    if (!selectedOption) {
      setSubmissionMessage("Please select an option before submitting.");
      return;
    }

    try {
      const url = `${baseURL}/quizzes/${quizId}/submit`;
      console.log("Submitting quiz to:", url);

      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ selectedOption }),
      });

      if (!response.ok) {
        throw new Error(`Failed to submit. Status: ${response.status}`);
      }

      const result = await response.json();
      console.log("Submission result:", result);

      // Update the quiz state with the new attempts, score, and percentage
      setQuiz((prevQuiz) => ({
        ...prevQuiz,
        attempts: result.attempts,
        score: result.score,
        percentage: result.percentage,
      }));

      setSubmissionMessage("Quiz submitted successfully!");
    } catch (err) {
      console.error("Submission error:", err);
      setSubmissionMessage("Submission failed. Please try again.");
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;
  if (!quiz) return <p>No quiz data found.</p>;

  return (
    <div className="quiz-page">
      <h1>Quiz Platform</h1>

      {/* Quiz Questions */}
      <div className="quiz-questions">
        <p>{quiz.question || "No question available"}</p>
        {quiz.options && (
          <ul>
            {quiz.options.map((option, index) => (
              <li key={index}>
                <label>
                  <input
                    type="radio"
                    name="quiz-option"
                    value={option}
                    checked={selectedOption === option}
                    onChange={handleOptionChange}
                  />
                  {option}
                </label>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Submit Button */}
      <button onClick={handleSubmit} style={{ alignSelf: "flex-end" }}>
        Submit Quiz
      </button>

      {/* Submission Message */}
      {submissionMessage && <p>{submissionMessage}</p>}

      <table className="quiz-meta">
        <thead>
          <tr>
            <th>Lesson</th>
            <th>Student</th>
            <th>Created At</th>
            <th>Attempts</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>{quiz.lesson?.title || "N/A"}</td>
            <td>{quiz.student?.name || "N/A"}</td>
            <td>{new Date(quiz.created_at).toLocaleDateString()}</td>
            <td>{quiz.attempts}</td>
          </tr>
        </tbody>
      </table>

      {/* Review Button */}
      <button onClick={handleReviewToggle}>
        {showReview ? "Hide Review" : "Review Quiz"}
      </button>

      {/* Review Section */}
      {showReview && (
        <div className="quiz-review">
          <h2>Review</h2>
          <p>
            <strong>Question:</strong>{" "}
            {quiz.question || "No question available"}
          </p>
          <p>
            <strong>Your Answer:</strong> {selectedOption || "Not answered"}
          </p>
          <p>
            <strong>Correct Answer:</strong>{" "}
            {quiz.correct_answer || "Not available"}
          </p>
          <p>
            <strong>Score:</strong> {quiz.score ?? "Not available"}
          </p>
          <p>
            <strong>Total Percentage:</strong>{" "}
            {quiz.percentage ?? "Not available"}%
          </p>
        </div>
      )}
    </div>
  );
};

export default QuizPage;
