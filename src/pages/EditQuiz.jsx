import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

const EditQuiz = ({ baseURL }) => {
  const { id } = useParams();
  const [quiz, setQuiz] = useState({
    lesson_id: "",
    due_date: "",
    questions: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const token = sessionStorage.getItem("Token");
  const navigate = useNavigate();

  // Fetch the quiz data based on the ID
  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        const response = await fetch(`${baseURL}/quizzes/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await response.json();
        if (!response.ok)
          throw new Error(data.Error || "Failed to fetch quiz data");

        // Ensure `questions` is always an array
        if (!data.questions) {
          data.questions = [];
        }

        setQuiz(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchQuiz();
  }, [id, token, baseURL]);

  // Handle quiz title and description changes
  // const handleQuizChange = (e) => {
  //   const { name, value } = e.target;
  //   setQuiz((prevQuiz) => ({
  //     ...prevQuiz,
  //     [name]: value,
  //   }));
  // };

  // Handle question text changes
  const handleQuestionChange = (questionIndex, e) => {
    const { value } = e.target;
    setQuiz((prevQuiz) => {
      const updatedQuestions = [...prevQuiz.questions];
      updatedQuestions[questionIndex].question = value;
      return { ...prevQuiz, questions: updatedQuestions };
    });
  };

  // Handle answer text changes
  const handleAnswerChange = (questionIndex, answerIndex, e) => {
    const { value } = e.target;
    setQuiz((prevQuiz) => {
      const updatedQuestions = [...prevQuiz.questions];
      updatedQuestions[questionIndex][`option${answerIndex + 1}`] = value;
      return { ...prevQuiz, questions: updatedQuestions };
    });
  };

  // Handle correct answer changes
  const handleCorrectAnswerChange = (questionIndex, e) => {
    const { value } = e.target;
    setQuiz((prevQuiz) => {
      const updatedQuestions = [...prevQuiz.questions];
      updatedQuestions[questionIndex].correct_answer = value;
      return { ...prevQuiz, questions: updatedQuestions };
    });
  };

  // Add a new question
  const addQuestion = () => {
    setQuiz((prevQuiz) => ({
      ...prevQuiz,
      questions: [
        ...prevQuiz.questions,
        {
          question: "",
          option1: "",
          option2: "",
          option3: "",
          option4: "",
          correct_answer: "",
        },
      ],
    }));
  };

  // Delete a question
  const deleteQuestion = (questionIndex) => {
    setQuiz((prevQuiz) => {
      const updatedQuestions = prevQuiz.questions.filter(
        (_, index) => index !== questionIndex
      );
      return { ...prevQuiz, questions: updatedQuestions };
    });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        lesson_id: quiz.lesson_id,
        due_date: quiz.due_date,
        questions: quiz.questions.map((question) => ({
          question: question.question,
          option1: question.option1,
          option2: question.option2,
          option3: question.option3,
          option4: question.option4,
          correct_answer: question.correct_answer,
        })),
      };

      const response = await fetch(`${baseURL}/quizzes/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.Error || "Failed to update quiz");
      alert("Quiz updated successfully!");
      navigate("/quizzes-dashboard");
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) return <p className="text-center text-gray-600">Loading...</p>;
  if (error) return <p className="text-center text-red-500">Error: {error}</p>;
  if (!quiz || !quiz.questions)
    return <p className="text-center text-gray-600">No quiz found.</p>;

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <div className="max-w-2xl mx-auto bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">Edit Quiz</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Questions */}
          <div className="space-y-6">
            {quiz.questions?.map((question, questionIndex) => (
              <div key={questionIndex} className="border p-4 rounded-lg">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold text-gray-800">
                    Question {questionIndex + 1}
                  </h3>
                  <button
                    type="button"
                    onClick={() => deleteQuestion(questionIndex)}
                    className="text-red-500 hover:text-red-700"
                  >
                    Delete Question
                  </button>
                </div>

                {/* Question Text */}
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Question Text:
                  </label>
                  <input
                    type="text"
                    value={question.question}
                    onChange={(e) => handleQuestionChange(questionIndex, e)}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                {/* Answers */}
                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700">
                    Answers:
                  </label>
                  {[1, 2, 3, 4].map((optionIndex) => (
                    <div key={optionIndex} className="mt-2">
                      <input
                        type="text"
                        value={question[`option${optionIndex}`]}
                        onChange={(e) =>
                          handleAnswerChange(questionIndex, optionIndex - 1, e)
                        }
                        className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                      />
                    </div>
                  ))}
                </div>

                {/* Correct Answer */}
                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700">
                    Correct Answer:
                  </label>
                  <select
                    value={question.correct_answer}
                    onChange={(e) =>
                      handleCorrectAnswerChange(questionIndex, e)
                    }
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {[1, 2, 3, 4].map((index) => (
                      <option key={index} value={question[`option${index}`]}>
                        Answer {index}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            ))}
          </div>

          {/* Add Question Button */}
          <button
            type="button"
            onClick={addQuestion}
            className="w-full bg-green-500 text-white py-2 px-4 rounded-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            Add Question
          </button>

          {/* Save Changes Button */}
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Save Changes
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditQuiz;
