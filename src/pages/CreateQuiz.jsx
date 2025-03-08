import React, { useState } from "react";

const CreateQuiz = ({ baseURL }) => {
  const [quizTitle, setQuizTitle] = useState("");
  const [lessonId, setLessonId] = useState(""); // New field for lesson_id
  const [studentId, setStudentId] = useState(""); // New field for student_id
  const [questions, setQuestions] = useState([]);
  const [isLoading, setIsLoading] = useState(false); // Loading state
  const [error, setError] = useState(""); // Error state

  // Add a new question
  const addQuestion = () => {
    setQuestions((prev) => [
      ...prev,
      {
        text: "",
        type: "Multiple Choice",
        options: ["", ""],
        correct_answer: "",
      },
    ]);
  };

  // Handle question text change
  const handleQuestionChange = (index, value) => {
    setQuestions((prev) => {
      const updatedQuestions = [...prev];
      updatedQuestions[index] = { ...updatedQuestions[index], text: value };
      return updatedQuestions;
    });
  };

  // Handle question type change
  const handleQuestionTypeChange = (index, type) => {
    setQuestions((prev) => {
      const updatedQuestions = [...prev];
      updatedQuestions[index] = {
        ...updatedQuestions[index],
        type,
        correct_answer: "",
      }; // Reset correct answer when type changes
      return updatedQuestions;
    });
  };

  // Handle option change
  const handleOptionChange = (qIndex, optIndex, value) => {
    setQuestions((prev) => {
      const updatedQuestions = [...prev];
      updatedQuestions[qIndex] = {
        ...updatedQuestions[qIndex],
        options: updatedQuestions[qIndex].options.map((opt, i) =>
          i === optIndex ? value : opt
        ),
      };
      return updatedQuestions;
    });
  };

  // Remove an option
  const handleRemoveOption = (qIndex, optIndex) => {
    setQuestions((prev) => {
      const updatedQuestions = [...prev];
      updatedQuestions[qIndex] = {
        ...updatedQuestions[qIndex],
        options: updatedQuestions[qIndex].options.filter(
          (_, i) => i !== optIndex
        ),
      };
      return updatedQuestions;
    });
  };

  // Add an option
  const addOption = (qIndex) => {
    setQuestions((prev) => {
      const updatedQuestions = [...prev];
      updatedQuestions[qIndex] = {
        ...updatedQuestions[qIndex],
        options: [...updatedQuestions[qIndex].options, ""],
      };
      return updatedQuestions;
    });
  };

  // Handle correct answer change
  const handleCorrectAnswerChange = (qIndex, value) => {
    setQuestions((prev) => {
      const updatedQuestions = [...prev];
      updatedQuestions[qIndex] = {
        ...updatedQuestions[qIndex],
        correct_answer: value,
      };
      return updatedQuestions;
    });
  };

  // Remove a question
  const handleRemoveQuestion = (index) => {
    setQuestions((prev) => prev.filter((_, i) => i !== index));
  };

  // Handle save draft
  const handleSaveDraft = () => {
    alert("Draft saved!");
    console.log("Draft saved:", {
      quizTitle,
      lessonId,
      studentId,
      questions,
    });
  };

  // Handle preview
  const handlePreview = () => {
    alert("Previewing quiz!");
    console.log("Previewing quiz:", {
      quizTitle,
      lessonId,
      studentId,
      questions,
    });
  };

  // Handle publish
  const handlePublish = async () => {
    if (!quizTitle || !lessonId || !studentId || questions.length === 0) {
      setError("Please fill out all fields and add at least one question.");
      return;
    }

    setIsLoading(true);
    setError("");

    // Retrieve the token from sessionStorage
    const token = sessionStorage.getItem("Token");
    if (!token) {
      setError("No token found. Please log in.");
      setIsLoading(false);
      return;
    }

    try {
      // Map questions to match the backend model
      const quizData = {
        lesson_id: lessonId,
        student_id: studentId,
        question: questions[0].text, // Assuming only one question for simplicity
        options: questions[0].options, // Assuming only one question for simplicity
        correct_answer: questions[0].correct_answer, // Assuming only one question for simplicity
        attempts: 0, // Default value
        grade: 0, // Default value
        due_date: new Date().toISOString(), // Current date in ISO format
      };

      const response = await fetch(`${baseURL}/quizzes`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(quizData),
      });

      if (!response.ok) {
        if (response.status === 401) {
          setError("Unauthorized. Please log in again.");
        } else {
          setError("Failed to publish quiz. Please try again.");
        }
        return;
      }

      const data = await response.json();
      alert("Quiz published successfully!");
      console.log("Quiz published:", data);
      // Reset form after successful publish
      setQuizTitle("");
      setLessonId("");
      setStudentId("");
      setQuestions([]);
    } catch (err) {
      setError("An error occurred while publishing the quiz.");
      console.error("Error publishing quiz:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Create New Quiz</h2>

      {/* Basic Information */}
      <div className="space-y-4 mb-6">
        <input
          type="text"
          placeholder="Enter quiz title"
          className="w-full p-2 border border-gray-300 rounded"
          value={quizTitle}
          onChange={(e) => setQuizTitle(e.target.value)}
        />

        <input
          type="text"
          placeholder="Lesson ID"
          className="w-full p-2 border border-gray-300 rounded"
          value={lessonId}
          onChange={(e) => setLessonId(e.target.value)}
        />

        <input
          type="text"
          placeholder="Student ID"
          className="w-full p-2 border border-gray-300 rounded"
          value={studentId}
          onChange={(e) => setStudentId(e.target.value)}
        />
      </div>

      {/* Questions Section */}
      <h3 className="text-lg font-semibold mb-2">Questions</h3>
      <button
        onClick={addQuestion}
        className="bg-blue-500 text-white px-4 py-2 rounded mb-4"
      >
        ➕ Add Question
      </button>

      {questions.map((question, qIndex) => (
        <div key={qIndex} className="mb-6 p-4 border border-gray-300 rounded">
          <input
            type="text"
            placeholder="Enter your question"
            className="w-full p-2 border border-gray-300 rounded mb-4"
            value={question.text}
            onChange={(e) => handleQuestionChange(qIndex, e.target.value)}
          />

          {/* Question Type Selector */}
          <div className="flex gap-2 mb-4">
            {["Multiple Choice", "True/False", "Short Answer", "Essay"].map(
              (type) => (
                <button
                  key={type}
                  className={`px-4 py-2 rounded ${
                    question.type === type
                      ? "bg-blue-500 text-white"
                      : "bg-gray-200 text-gray-700"
                  }`}
                  onClick={() => handleQuestionTypeChange(qIndex, type)}
                >
                  {type}
                </button>
              )
            )}
          </div>

          {/* Options for Multiple Choice */}
          {question.type === "Multiple Choice" && (
            <div className="space-y-2">
              {question.options.map((option, optIndex) => (
                <div key={optIndex} className="flex items-center gap-2">
                  <input
                    type="text"
                    placeholder={`Option ${optIndex + 1}`}
                    className="w-full p-2 border border-gray-300 rounded"
                    value={option}
                    onChange={(e) =>
                      handleOptionChange(qIndex, optIndex, e.target.value)
                    }
                  />
                  <button
                    className="text-red-500"
                    onClick={() => handleRemoveOption(qIndex, optIndex)}
                  >
                    🗑️
                  </button>
                </div>
              ))}
              <button
                onClick={() => addOption(qIndex)}
                className="text-blue-500"
              >
                ➕ Add Option
              </button>
            </div>
          )}

          {/* Correct Answer Field */}
          <div className="mt-4">
            <label className="block text-sm font-medium mb-1">
              Correct Answer
            </label>
            {question.type === "Multiple Choice" ? (
              <select
                className="w-full p-2 border border-gray-300 rounded"
                value={question.correct_answer}
                onChange={(e) =>
                  handleCorrectAnswerChange(qIndex, e.target.value)
                }
              >
                <option value="">Select correct option</option>
                {question.options.map((option, optIndex) => (
                  <option key={optIndex} value={option}>
                    {option || `Option ${optIndex + 1}`}
                  </option>
                ))}
              </select>
            ) : question.type === "True/False" ? (
              <select
                className="w-full p-2 border border-gray-300 rounded"
                value={question.correct_answer}
                onChange={(e) =>
                  handleCorrectAnswerChange(qIndex, e.target.value)
                }
              >
                <option value="">Select correct answer</option>
                <option value="True">True</option>
                <option value="False">False</option>
              </select>
            ) : (
              <input
                type="text"
                placeholder="Enter correct answer"
                className="w-full p-2 border border-gray-300 rounded"
                value={question.correct_answer}
                onChange={(e) =>
                  handleCorrectAnswerChange(qIndex, e.target.value)
                }
              />
            )}
          </div>

          {/* Remove Question Button */}
          <button
            onClick={() => handleRemoveQuestion(qIndex)}
            className="text-red-500 mt-2"
          >
            ❌ Remove Question
          </button>
        </div>
      ))}

      {/* Error Message */}
      {error && <p className="text-red-500 mb-4">{error}</p>}

      {/* Buttons */}
      <div className="flex gap-4">
        <button
          onClick={handleSaveDraft}
          className="bg-gray-500 text-white px-4 py-2 rounded"
        >
          Save as Draft
        </button>
        <button
          onClick={handlePreview}
          className="bg-yellow-500 text-white px-4 py-2 rounded"
        >
          Preview
        </button>
        <button
          onClick={handlePublish}
          className="bg-green-500 text-white px-4 py-2 rounded"
          disabled={isLoading}
        >
          {isLoading ? "Publishing..." : "Publish Quiz"}
        </button>
      </div>
    </div>
  );
};

export default CreateQuiz;
