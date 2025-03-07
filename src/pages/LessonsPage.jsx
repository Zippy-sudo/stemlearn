import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

const LessonsPage = ({ baseURL, loggedIn }) => {
  const [lessons, setLessons] = useState([]);
  const [lessonsToDisplay, setLessonsToDisplay] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Handle search input change
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    filterLessons(e.target.value);
  };

  // Handle subject filter change
  

  // Filter lessons based on search term and subject
  const filterLessons = (searchTerm) => {
    let filtered = lessons.filter((lesson) =>
      lesson.title.trim().toUpperCase().includes(searchTerm.trim().toUpperCase())
    );

   

    setLessonsToDisplay(filtered);
  };

  // Fetch lessons from the API
  useEffect(() => {
    const fetchLessons = async () => {
      try {
        const response = await fetch(`${baseURL}/lessons`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${sessionStorage.getItem("Token")}`,
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        setLessons(data);
        setLessonsToDisplay(data); // Initialize lessonsToDisplay
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchLessons();
  }, [baseURL]);

  // Handle navigation to a specific lesson
  const handleLessonClick = (lessonId) => {
    navigate(`/lesson/${lessonId}`);
  };

  if (loading) return <p className="text-center text-gray-500">Loading lessons...</p>;
  if (error) return <p className="text-center text-red-500">Error: {error}</p>;

  return (
    <div className="flex flex-col">
      {/* Search and Subject Filter */}
      <div className="mx-auto p-4 place-content-between">
        <input
          type="text"
          placeholder="Search..."
          onChange={handleSearchChange}
          className="bg-aliceblue border border-black"
        />
        
      </div>

      {/* Sidebar and Main Content */}
      <div className="flex">
        {/* Sidebar */}
        <aside className="w-1/4 bg-gray-100 p-4 h-screen overflow-y-auto border-r">
          <h2 className="text-lg font-semibold mb-3">Lessons</h2>
          <ul>
            {lessons.map((lesson) => (
              <li key={lesson._id} className="mb-2">
                <a
                  href={`#lesson-${lesson._id}`}
                  className="block p-2 bg-blue-100 hover:bg-blue-200 rounded-md"
                >
                  {lesson.title}
                </a>
              </li>
            ))}
          </ul>
        </aside>

        {/* Main Content */}
        <div className="w-3/4 p-6">
          {lessonsToDisplay.length > 0 ? (
            lessonsToDisplay.map((lesson) => (
              <div
                key={lesson._id}
                id={`lesson-${lesson._id}`}
                className="bg-white p-6 rounded-lg shadow-md border border-gray-200 mb-6"
              >
                <h1 className="text-3xl font-bold text-center">{lesson.title}</h1>

                {/* Lesson Content */}
                <div className="mb-4">
                  <h2 className="text-lg font-semibold">Content</h2>
                  <p className="text-gray-700">{lesson.content}</p>
                </div>

                {/* Video Section */}
                {lesson.video_url && (
                  <div className="mb-4">
                    <h2 className="text-lg font-semibold">Video</h2>
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
                  <div className="mb-4">
                    <h2 className="text-lg font-semibold">Resources</h2>
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

                {/* Quizzes & Assignments Links (Preserved from your original code) */}
                <div className="mt-4 flex space-x-4">
                  <a
                    href={`/studentquiz`}
                    className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
                  >
                    Take Quiz
                  </a>
                  <a
                    href={`/assignments/${lesson._id}`}
                    className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600"
                  >
                    Submit Assignment
                  </a>
                </div>
              </div>
            ))
          ) : (
            <p className="text-center text-gray-500">No lessons available</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default LessonsPage;