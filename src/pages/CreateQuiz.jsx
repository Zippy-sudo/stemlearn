import React, { useState } from "react";

const CreateQuiz = () => {
  const [quizTitle, setQuizTitle] = useState("");
  const [course, setCourse] = useState("");
  const [timeLimit, setTimeLimit] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [points, setPoints] = useState("");
  const [questions, setQuestions] = useState([]);

  // Add a new question
  const addQuestion = () => {
    setQuestions((prev) => [
      ...prev,
      {
        text: "",
        type: "Multiple Choice",
        options: ["", ""],
        correctAnswer: "",
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
      updatedQuestions[index] = { ...updatedQuestions[index], type };
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

  // Remove a question
  const handleRemoveQuestion = (index) => {
    setQuestions((prev) => prev.filter((_, i) => i !== index));
  };

  // Handle save draft
  const handleSaveDraft = () => {
    alert("Draft saved!");
    console.log("Draft saved:", {
      quizTitle,
      course,
      timeLimit,
      dueDate,
      points,
      questions,
    });
  };

  // Handle preview
  const handlePreview = () => {
    alert("Previewing quiz!");
    console.log("Previewing quiz:", {
      quizTitle,
      course,
      timeLimit,
      dueDate,
      points,
      questions,
    });
  };

  // Handle publish
  const handlePublish = () => {
    alert("Quiz published!");
    console.log("Quiz published:", {
      quizTitle,
      course,
      timeLimit,
      dueDate,
      points,
      questions,
    });
  };

  return (
    <div className="container">
      <h2 className="heading">Create New Quiz</h2>

      {/* Basic Information */}
      <div className="question-container">
        <input
          type="text"
          placeholder="Enter quiz title"
          className="input"
          value={quizTitle}
          onChange={(e) => setQuizTitle(e.target.value)}
        />

        <input
          type="text"
          placeholder="Course"
          className="input"
          value={course}
          onChange={(e) => setCourse(e.target.value)}
        />

        <input
          type="text"
          placeholder="Time Limit (Minutes)"
          className="input"
          value={timeLimit}
          onChange={(e) => setTimeLimit(e.target.value)}
        />

        <input
          type="date"
          className="input"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
        />

        <input
          type="number"
          placeholder="Total Points"
          className="input"
          value={points}
          onChange={(e) => setPoints(e.target.value)}
        />
      </div>

      {/* Questions Section */}
      <h3
        style={{
          fontSize: "1.125rem",
          fontWeight: "600",
          marginBottom: "0.5rem",
        }}
      >
        Questions
      </h3>
      <button onClick={addQuestion} className="button add-button">
        ➕ Add Question
      </button>

      {questions.map((question, qIndex) => (
        <div key={qIndex} className="question-container">
          <input
            type="text"
            placeholder="Enter your question"
            className="input"
            value={question.text}
            onChange={(e) => handleQuestionChange(qIndex, e.target.value)}
          />

          {/* Question Type Selector */}
          <div
            style={{ display: "flex", gap: "0.5rem", marginBottom: "0.75rem" }}
          >
            {["Multiple Choice", "True/False", "Short Answer", "Essay"].map(
              (type) => (
                <button
                  key={type}
                  className={`type-button ${
                    question.type === type
                      ? "type-button-active"
                      : "type-button-inactive"
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
            <div>
              {question.options.map((option, optIndex) => (
                <div key={optIndex} className="option-container">
                  <input
                    type="text"
                    placeholder={`Option ${optIndex + 1}`}
                    className="option-input"
                    value={option}
                    onChange={(e) =>
                      handleOptionChange(qIndex, optIndex, e.target.value)
                    }
                  />
                  <button
                    className="remove-button"
                    onClick={() => handleRemoveOption(qIndex, optIndex)}
                  >
                    🗑️
                  </button>
                </div>
              ))}
              <button
                onClick={() => addOption(qIndex)}
                style={{ color: "#3b82f6" }}
              >
                ➕ Add Option
              </button>
            </div>
          )}

          <button
            onClick={() => handleRemoveQuestion(qIndex)}
            className="remove-button"
          >
            ❌ Remove Question
          </button>
        </div>
      ))}

      {/* Buttons */}
      <div className="action-buttons">
        <button onClick={handleSaveDraft} className="button save-button">
          Save as Draft
        </button>
        <button onClick={handlePreview} className="button preview-button">
          Preview
        </button>
        <button onClick={handlePublish} className="button publish-button">
          Publish Quiz
        </button>
      </div>
    </div>
  );
};

export default CreateQuiz;
