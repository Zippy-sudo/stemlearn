import React, { useState, useEffect } from 'react';

const AssignmentSubmissionsList = ({ baseURL, userRole }) => {
  const [submissions, setSubmissions] = useState([]);
  const [filter, setFilter] = useState('');
  const [selectedSubmission, setSelectedSubmission] = useState(null);
  const [grade, setGrade] = useState('');
  const [feedback, setFeedback] = useState('');

  useEffect(() => {
    const fetchSubmissions = async () => {
      try {
        const token = sessionStorage.getItem('Token');
        const response = await fetch(`${baseURL}/assignments`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await response.json();
        setSubmissions(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error('Error fetching submissions:', error);
        setSubmissions([]);
      }
    };
    fetchSubmissions();
  }, [baseURL]);

  const handleUpdate = async (submissionId) => {
    try {
      await fetch(`${baseURL}/assignments/${submissionId}`, {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem('Token')}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ grade, teacher_feedback: feedback }),
      });
      setSubmissions(submissions.map(sub => sub._id === submissionId ? { ...sub, grade, teacher_feedback: feedback } : sub));
      setSelectedSubmission(null);
    } catch (error) {
      console.error('Error updating submission:', error);
    }
  };

  return (
    <div className="bg-white shadow-md rounded-lg p-4 mb-4">
      <h2 className="text-xl font-semibold mb-3">Assignment Submissions</h2>
      <input type="text" className="w-full border rounded p-2 mb-4" placeholder="Filter by student or lesson" value={filter} onChange={(e) => setFilter(e.target.value)} />
      {submissions.filter(sub => sub.student?.name.includes(filter) || sub.lesson?.title.includes(filter)).map(submission => (
        <div key={submission._id} className="border-b py-2">
          <p>Student: {submission.student?.name || 'Unknown'}</p>
          <p>Lesson: {submission.lesson?.title || 'Unknown'}</p>
          <p>Submitted At: {submission.submitted_at || 'N/A'}</p>
          <p>Submission Text: {submission.submission_text || 'No Submission Text'}</p>
          <p>Grade: {submission.grade || 'Not Graded'}</p>
          <p>Feedback: {submission.teacher_feedback || 'No Feedback'}</p>
          {userRole === 'TEACHER' && (
            <button onClick={() => setSelectedSubmission(submission)} className="bg-blue-500 text-white px-3 py-1 rounded">Update</button>
          )}
        </div>
      ))}

      {selectedSubmission && (
        <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-gray-900 bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-xl font-semibold mb-4">Update Submission</h2>
            <input type="text" className="w-full border rounded p-2 mb-4" placeholder="Enter Grade" value={grade} onChange={(e) => setGrade(e.target.value)} />
            <textarea className="w-full border rounded p-2 mb-4" placeholder="Enter Feedback" value={feedback} onChange={(e) => setFeedback(e.target.value)} rows={4} />
            <button onClick={() => handleUpdate(selectedSubmission._id)} className="bg-green-500 text-white px-4 py-2 rounded">Save</button>
            <button onClick={() => setSelectedSubmission(null)} className="bg-red-500 text-white px-4 py-2 rounded ml-2">Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
};

const Feedback = ({ baseURL}) => {
  const [userRole, setUserRole] = useState('');

  useEffect(() => {
    const storedRole = sessionStorage.getItem('Role');
    if (storedRole) {
      setUserRole(storedRole);
    }
  }, []);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">FEEDBACK</h1>
      <AssignmentSubmissionsList baseURL={baseURL} userRole={userRole} />
    </div>
  );
};

export default Feedback;
