import React, { useEffect, useState } from "react";

const LessonsPage = () => {
  const [lessons, setLessons] = useState([]);

  useEffect(() => {
    fetch("http://127.0.0.1:5555/lessons", {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${sessionStorage.getItem("Token")}`,
        "Content-Type": "application/json"
      }
    })
    .then(response => response.json())
    .then(data => {
      console.log("API Response:", data);  // Check the actual response
      setLessons(Array.isArray(data) ? data : []); // Ensure it's an array
    })
    .catch(error => console.error("Error fetching lessons:", error));
  }, []);
  

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Lessons</h1>
      {lessons.map((lesson) => (
        <div key={lesson._id} className="border p-4 mb-4 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold">{lesson.title}</h2>
          <p className="text-gray-700">{lesson.content}</p>

          {/* Video Section */}
          {lesson.video_url && (
            <div className="mt-4">
              <h3 className="font-semibold">Lesson Video</h3>
              <iframe
                width="100%"
                height="315"
                src={lesson.video_url}
                title={lesson.title}
                allowFullScreen
              ></iframe>
            </div>
          )}

          {/* Resources Section */}
          {lesson.resources && lesson.resources.length > 0 && (
            <div className="mt-4">
              <h3 className="font-semibold">Resources</h3>
              <ul className="list-disc list-inside">
                {lesson.resources.map((resource) => (
                  <li key={resource._id}>
                    <a
                      href={resource.file_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-500 hover:underline"
                    >
                      {resource.title}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Quizzes & Assignments Links */}
          <div className="mt-4 flex space-x-4">
            <a
              href={`/quizzes/${lesson._id}`}
              className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
            >
              Take Quiz
            </a>
            <a
              href={`/assignments/${lesson._id}`}
              className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600"
            >
              View Assignment
            </a>
          </div>
        </div>
      ))}
    </div>
  );
};

export default LessonsPage;
