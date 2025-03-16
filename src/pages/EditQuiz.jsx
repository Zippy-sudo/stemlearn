import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

const EditQuiz = ({ baseURL }) => {
  const { id } = useParams();
  const [quiz, setQuiz] = useState({
    lesson_id: "",
    due_date: "",
    questions: [],
  });
  const [deletedQuestions, setDeletedQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const token = sessionStorage.getItem("Token");

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

  // Handle scalar field changes (lesson_id, due_date)
  const handleScalarChange = (e) => {
    const { name, value } = e.target;
    setQuiz((prevQuiz) => ({
      ...prevQuiz,
      [name]: value,
    }));
    setSuccess(null); // Clear success message on change
  };

  // Handle question text changes
  const handleQuestionChange = (questionIndex, e) => {
    const { value } = e.target;
    setQuiz((prevQuiz) => {
      const updatedQuestions = [...prevQuiz.questions];
      updatedQuestions[questionIndex].question = value;
      return { ...prevQuiz, questions: updatedQuestions };
    });
    setSuccess(null); // Clear success message on change
  };

  // Handle answer text changes
  const handleAnswerChange = (questionIndex, answerIndex, e) => {
    const { value } = e.target;
    setQuiz((prevQuiz) => {
      const updatedQuestions = [...prevQuiz.questions];
      updatedQuestions[questionIndex][`option${answerIndex + 1}`] = value;
      return { ...prevQuiz, questions: updatedQuestions };
    });
    setSuccess(null); // Clear success message on change
  };

  // Handle correct answer selection changes
  const handleCorrectAnswerChange = (questionIndex, e) => {
    const { value } = e.target;
    setQuiz((prevQuiz) => {
      const updatedQuestions = [...prevQuiz.questions];
      updatedQuestions[questionIndex].correct_answer = value;
      return { ...prevQuiz, questions: updatedQuestions };
    });
    setSuccess(null); // Clear success message on change
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
    setSuccess(null); // Clear success message on addition
  };

  // Delete a question
  const deleteQuestion = (questionIndex) => {
    setQuiz((prevQuiz) => {
      const updatedQuestions = prevQuiz.questions.filter(
        (_, index) => index !== questionIndex
      );
      const questionToDelete = prevQuiz.questions[questionIndex];
      if (questionToDelete._id) {
        setDeletedQuestions((prevDeleted) => [
          ...prevDeleted,
          questionToDelete._id,
        ]);
      }
      return { ...prevQuiz, questions: updatedQuestions };
    });
    setSuccess(null); // Clear success message on deletion
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    setSuccess(null);

    try {
      const payload = {
        lesson_id: quiz.lesson_id,
        due_date: quiz.due_date,
        questions: quiz.questions.map((question) => ({
          _id: question._id,
          question: question.question,
          option1: question.option1,
          option2: question.option2,
          option3: question.option3,
          option4: question.option4,
          correct_answer: question.correct_answer,
        })),
        deletedQuestions: deletedQuestions, // Include deleted questions in the payload
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

      setSuccess("Quiz updated successfully!");
      setDeletedQuestions([]); // Clear deleted questions after success
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  // Render loading, error, or form UI
  if (loading) return <p className="text-center text-gray-600">Loading...</p>;
  if (error) return <p className="text-center text-red-500">Error: {error}</p>;
  if (!quiz || !quiz.questions)
    return <p className="text-center text-gray-600">No quiz found.</p>;

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <div className="max-w-2xl mx-auto bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">Edit Quiz</h2>
        {success && <p className="text-center text-green-500">{success}</p>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Lesson ID:
            </label>
            <input
              type="text"
              name="lesson_id"
              value={quiz.lesson_id}
              onChange={handleScalarChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Due Date:
            </label>
            <input
              type="datetime-local"
              name="due_date"
              value={quiz.due_date}
              onChange={handleScalarChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
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
          <button
            type="button"
            onClick={addQuestion}
            className="w-full bg-green-500 text-white py-2 px-4 rounded-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            Add Question
          </button>
          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {submitting ? "Submitting..." : "Save Changes"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditQuiz;
