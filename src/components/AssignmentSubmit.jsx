import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

const AssignmentSubmissionPage = ({ baseURL }) => {
  const { lessonId } = useParams(); // Get lessonId from the URL
  const navigate = useNavigate();
  const [submissionText, setSubmissionText] = useState("");
  const [fileUrl, setFileUrl] = useState("");
  const [submission, setSubmission] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Fetch submission details (if editing)
  useEffect(() => {
    console.log(lessonId)
    const fetchSubmission = async () => {
      try {
        const token = sessionStorage.getItem("Token"); // Example
        const response = await fetch(`${baseURL}/assignments`, {
          headers: {
            
            Authorization: `Bearer ${token}`,
          },

        });
        if (!response.ok) throw new Error("Failed to fetch submission.");
        const data = await response.json();
        const studentSubmission = data.find(
          (sub) => sub.lesson_id === parseInt(lessonId)
        );
        if (studentSubmission) {
          setSubmission(studentSubmission);
          setSubmissionText(studentSubmission.submission_text || "");
          setFileUrl(studentSubmission.file_url || "");
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchSubmission();
  }, [lessonId, baseURL]);

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = sessionStorage.getItem("Token"); // Example

    const submissionData = {
      lesson_id: lessonId,
      submission_text: submissionText,
      file_url: fileUrl,
    };

    try {
      const response = await 
      fetch(`${baseURL}/assignments`, 
        {
          method: "POST" || "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(submissionData),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to submit assignment.");
      }
  
      const data = await response.json();
      setSubmission(data); // Update the submission state with the response
      setSuccess("Assignment submitted successfully!");
      setTimeout(() => {
        navigate('/lessons'); // Redirect to the lessons page
      }, 1000);
      setError(""); // Clear any previous errors
    } catch (err) {
      setError(err.message);
      setSuccess(""); // Clear any previous success message
    }
  };


  if (loading) return <p className="text-center text-gray-500">Loading...</p>;
  if (error) return <p className="text-center text-red-500">Error: {error}</p>;

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">
        {submission ? "Edit Submission" : "Submit Assignment"}
      </h2>
  
      {/* Success Message */}
      {success&& (
        <p className="text-green-500 mb-4">{success}</p>
      )}
  
      {/* Error Message */}
      {error && <p className="text-red-500 mb-4">{error}</p>}
  
      {/* Rest of the form */}
      <form onSubmit={handleSubmit}>
        {/* Submission Text */}
        <div className="mb-4">
          <label className="block text-gray-700 font-semibold mb-2">
            Submission Text (Optional)
          </label>
          <textarea
            value={submissionText}
            onChange={(e) => setSubmissionText(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter your submission text"
            rows="4"
          />
        </div>
  
        {/* File URL */}
        <div className="mb-4">
          <label className="block text-gray-700 font-semibold mb-2">
            File URL (Optional)
          </label>
          <input
            type="text"
            value={fileUrl}
            onChange={(e) => setFileUrl(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter file URL"
          />
        </div>
  
        {/* Submit Button */}
        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          {submission ? "Update Submission" : "Submit Assignment"}
        </button>
      </form>
  
      {/* Grade and Feedback Section */}
      {submission?.grade && (
        <div className="mt-6">
          <h3 className="text-xl font-bold mb-2">Grade and Feedback</h3>
          <p className="text-gray-700">
            <strong>Grade:</strong> {submission.grade}
          </p>
          <p className="text-gray-700">
            <strong>Feedback:</strong> {submission.feedback}
          </p>
        </div>
      )}
    </div>
  );
  };

export default AssignmentSubmissionPage;