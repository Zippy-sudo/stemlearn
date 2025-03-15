import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";

const QuizPage = ({ baseURL }) => {
  const { quizId } = useParams();
  const [quiz, setQuiz] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [submissionMessage, setSubmissionMessage] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const token = sessionStorage.getItem("Token");
  const navigate = useNavigate();
  const choiceMap = useRef(new Map());

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
    choiceMap.current.set(event.target.name, event.target.value);
  };

  const handleSubmit = async () => {
    if (submitted) {
      setSubmissionMessage("You have already submitted this quiz.");
      return;
    }

    if (choiceMap.current.size < quiz?.questions.length) {
      alert("Please answer all questions before submitting.");
      return;
    }

    try {
      setSubmitting(true);
      let total = 0;
      quiz.questions.forEach((question, index) => {
        const selectedAnswer = choiceMap.current.get(
          `question_${question._id}`
        );
        if (selectedAnswer === question.correct_answer) {
          total += 1;
        }
      });

      const response = await fetch(`${baseURL}/quizzattempts`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ quiz_id: quizId, grade: total }),
      });

      if (!response.ok)
        throw new Error(`Failed to submit. Status: ${response.status}`);

      const result = await response.json();
      setSubmissionMessage(result.Success || "Quiz submitted successfully!");
      setSubmitted(true);
    } catch (err) {
      setError("Submission failed. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <p className="text-center text-gray-500">Loading...</p>;
  if (error) return <p className="text-center text-red-500">Error: {error}</p>;
  if (!quiz)
    return <p className="text-center text-gray-500">No quiz data found.</p>;

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white shadow-lg rounded-lg mt-6">
      <h1 className="text-2xl font-bold text-center mb-4">
        {quiz?.lesson?.title || "Untitled Quiz"} Quiz
      </h1>
      <div className="mb-4">
        {quiz.questions?.map((question) => (
          <div key={question._id}>
            <p className="text-lg font-medium">{question.question}</p>
            <ul className="space-y-2 mt-2">
              {[1, 2, 3, 4].map((index) => (
                <li key={index} className="flex items-center space-x-2">
                  <input
                    type="radio"
                    name={`question_${question._id}`}
                    value={question[`option${index}`]}
                    onChange={handleOptionChange}
                    disabled={submitted}
                    className="w-4 h-4 text-blue-600 focus:ring-blue-500"
                  />
                  <label className="text-gray-700">
                    {question[`option${index}`]}
                  </label>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <button
        onClick={handleSubmit}
        disabled={submitted || submitting}
        className={`w-full mt-4 py-2 rounded-lg text-white font-bold ${
          submitted || submitting
            ? "bg-gray-400"
            : "bg-blue-600 hover:bg-blue-700"
        }`}
      >
        {submitting ? "Submitting..." : submitted ? "Submitted" : "Submit Quiz"}
      </button>
      {submissionMessage && (
        <p className="mt-2 text-center text-green-600">{submissionMessage}</p>
      )}
    </div>
  );
};

export default QuizPage;
