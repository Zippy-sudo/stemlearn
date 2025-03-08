import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

const QuizPage = ({ baseURL }) => {
  const { quizId } = useParams();
  const [quiz, setQuiz] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedOption, setSelectedOption] = useState(null);
  const [showReview, setShowReview] = useState(false);
  const [submissionMessage, setSubmissionMessage] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const token = sessionStorage.getItem("Token");

  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        if (!quizId) throw new Error("Invalid quiz ID");
        const url = `${baseURL}/quizzes/${quizId}`;
        const response = await fetch(url, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!response.ok)
          throw new Error(`HTTP error! Status: ${response.status}`);
        const data = await response.json();
        setQuiz(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchQuiz();
  }, [quizId, baseURL, token]);

  const handleOptionChange = (event) => {
    setSelectedOption(event.target.value);
  };

  const handleReviewToggle = () => {
    setShowReview((prev) => !prev);
  };

  const handleSubmit = async () => {
    if (!selectedOption) {
      setSubmissionMessage("Please select an option before submitting.");
      return;
    }
    if (submitted) {
      setSubmissionMessage("You have already submitted this quiz.");
      return;
    }
    try {
      setSubmitted(true);
      const url = `${baseURL}/quizzes/${quizId}`;
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ answer: selectedOption }),
      });
      if (!response.ok)
        throw new Error(`Failed to submit. Status: ${response.status}`);
      const result = await response.json();
      setQuiz((prevQuiz) => ({
        ...prevQuiz,
        correct_answer: result.correct_answer || prevQuiz.correct_answer,
        grade: result.grade ?? prevQuiz.grade,
        attempts: result.attempts ?? prevQuiz.attempts,
      }));
      setSubmissionMessage(result.Success || "Quiz submitted successfully!");
    } catch (err) {
      setSubmissionMessage("Submission failed. Please try again.");
    }
  };

  if (loading) return <p className="text-center text-gray-500">Loading...</p>;
  if (error) return <p className="text-center text-red-500">Error: {error}</p>;
  if (!quiz)
    return <p className="text-center text-gray-500">No quiz data found.</p>;

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white shadow-lg rounded-lg mt-6">
      <h1 className="text-2xl font-bold text-center mb-4">Quiz Platform</h1>
      <div className="mb-4">
        <p className="text-lg font-medium">
          {quiz.question || "No question available"}
        </p>
        {quiz.options && (
          <ul className="space-y-2 mt-2">
            {quiz.options.map((option, index) => (
              <li key={index} className="flex items-center space-x-2">
                <input
                  type="radio"
                  name="quiz-option"
                  value={option}
                  checked={selectedOption === option}
                  onChange={handleOptionChange}
                  disabled={submitted}
                  className="w-4 h-4 text-blue-600 focus:ring-blue-500"
                />
                <label className="text-gray-700">{option}</label>
              </li>
            ))}
          </ul>
        )}
      </div>
      <button
        onClick={handleSubmit}
        disabled={submitted}
        className={`w-full mt-4 py-2 rounded-lg text-white font-bold ${
          submitted ? "bg-gray-400" : "bg-blue-600 hover:bg-blue-700"
        }`}
      >
        {submitted ? "Submitted" : "Submit Quiz"}
      </button>
      {submissionMessage && (
        <p className="mt-2 text-center text-green-600">{submissionMessage}</p>
      )}
      <button
        onClick={handleReviewToggle}
        className="w-full mt-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
      >
        {showReview ? "Hide Review" : "Review Quiz"}
      </button>
      {showReview && submitted && (
        <div className="mt-4 p-4 bg-gray-100 rounded-lg">
          <h2 className="text-lg font-bold">Review</h2>
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
            <strong>Grade:</strong>{" "}
            {quiz.grade ? `${quiz.grade * 100}%` : "Not available"}
          </p>
          <p>
            <strong>Attempts:</strong> {quiz.attempts ?? "Not available"}
          </p>
        </div>
      )}
    </div>
  );
};

export default QuizPage;
