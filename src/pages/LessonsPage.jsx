import React, { useState, useEffect, useCallback } from "react"
import { Link, useParams } from "react-router-dom";


const LessonsPage = ({ baseURL }) => {
  const [lessons, setLessons] = useState([]);
  const [lessonsToDisplay, setLessonsToDisplay] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { courseId } = useParams(); // Get the courseId from the URL

  const [courseTitle, setCourseTitle] = useState("Loading...")
  const [discussions, setDiscussions] = useState({})
  const [newMessage, setNewMessage] = useState("")
  const [showDiscussions, setShowDiscussions] = useState({})

  const handleSearchChange = (e) => {
    filterLessons(e.target.value);
  };


  // Filter lessons based on search term
  const filterLessons = (searchTerm) => {
    let filtered = lessons.filter((lesson) =>
      lesson.title.trim().toUpperCase().includes(searchTerm.trim().toUpperCase())
    );
    // Apply courseId filter if it exists
    if (courseId) {
      filtered = filtered.filter((lesson) => lesson.course_id === parseInt(courseId));
    }
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
        if (data) {
          for (const lesson of data){
            if (lesson.course._id === parseInt(courseId)){
              setCourseTitle(lesson.course.title)
            }
          }
          setLessons(data);
        }
        else {
          fetch(`${baseURL}/courses/${courseId}`)
          .then(resp => resp.json())
          .then(course => setCourseTitle(course.title))
        }

        // Filter lessons by courseId if it exists in the URL
        if (courseId) {
          const filteredByCourse = data.filter((lesson) => lesson.course_id === parseInt(courseId));
          setLessonsToDisplay(filteredByCourse);
        } else {
          setLessonsToDisplay(data); // Initialize lessonsToDisplay
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchLessons();
  }, [baseURL, courseId]); // Add courseId to dependency array

  const fetchDiscussions = useCallback (async (lessonId) => {
    try {
      const response = await fetch(`${baseURL}/discussions`, {
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
      const filteredDiscussions = data.filter(discussion => discussion.lesson_id === lessonId);

      console.log("Fetched discussions for lesson:", lessonId, filteredDiscussions);
      
      setDiscussions(prevDiscussions => ({
        ...prevDiscussions,
        [lessonId]: filteredDiscussions, // Store discussions for each lesson
      }));
    } catch (err) {
      console.error("Fetch discussions error:", err);
      setError("Failed to fetch discussions.");
    }
  }, [baseURL]);

  // Post a new discussion message
  const postDiscussion = async (lessonId) => {
    if (!newMessage.trim()) {
      alert("Please enter a message.");
      return;
    }

    try {
      const response = await fetch(`${baseURL}/discussions`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${sessionStorage.getItem("Token")}`,
        },
        body: JSON.stringify({
          lesson_id: lessonId,
          message: newMessage,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      // const data = await response.json();
      setNewMessage(""); // Clear the input field
      fetchDiscussions(lessonId); // Refresh the discussion list
    } catch (err) {
      console.error("Post discussion error:", err);
      setError("Failed to post the message.");
    }
  };

  // Toggle discussions visibility for a specific lesson
  const toggleDiscussions = (lessonId) => {
    setShowDiscussions(prev => ({
      ...prev,
      [lessonId]: !prev[lessonId],
    }));
  
    if (!discussions[lessonId]) {
      fetchDiscussions(lessonId);
    }
  };

  // Fetch discussions when a lesson is expanded or loaded
  useEffect(() => {
    if (lessonsToDisplay.length > 0) {
      lessonsToDisplay.forEach((lesson) => {
        if (showDiscussions[lesson._id]) {
          fetchDiscussions(lesson._id);
        }
      });
    }
  }, [lessonsToDisplay, showDiscussions, fetchDiscussions]);


  if (loading) return <p className="text-center text-gray-500">Loading lessons...</p>;
  if (error) return <p className="text-center text-red-500">Error: {error}</p>;

  return (
    <div className="flex flex-col absolute top-20">
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
        <div className="min-w-64"></div>
        {/* Sidebar */}
        <aside className="max-w-64 fixed bg-gray-100 p-4 h-screen overflow-y-auto border-r">
          <h2 className="text-lg font-semibold mb-3">Lessons</h2>
          <ul>
            {lessonsToDisplay.map((lesson) => (
              <li key={lesson._id} className="mb-2">
                <a
                  href={`#lessons-${lesson._id}`}
                  className="block w-full p-2 bg-blue-100 hover:bg-blue-200 rounded-md text-left"
                >
                  {lesson.title}
                </a>
              </li>
            ))}
          </ul>
        </aside>

        {/* Main Content */}
        <div className="flex flex-col">
        <div className="mx-2">
          <p className="text-center text-5xl">{courseTitle}</p>
        </div>
        <div className="w-3/4 p-6">
          {lessonsToDisplay.length > 0 ? (
            lessonsToDisplay.map((lesson) => (
              <div
                key={lesson._id}
                id={`lessons-${lesson._id}`}
                className="bg-white p-6 rounded-lg shadow-md border border-gray-200 mb-6"
              >
                <h1 className="text-3xl font-bold text-center">{lesson.title}</h1>

                {/* Lesson Content */}
                <div className="mb-4">
                  {/* <h2 className="text-lg font-semibold">Content</h2> */}
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

                {/* Quizzes & Assignments Links */}
                <div className="mt-4 flex space-x-4">
                  <Link
                    to={`/StudentQuiz`}
                    className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
                  >
                    Take Quiz
                  </Link>
                  <Link
                    to={`/Assignments/${lesson._id}`}
                    className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600"
                  >
                    Submit Assignment
                  </Link>
                </div>
                {/* Discussions Section */}
                <div className="mt-6">
                  <button
                    onClick={() => toggleDiscussions(lesson._id)}
                    className="flex items-center text-blue-500 hover:text-blue-600"
                  >
                    <span className="mr-2">
                      {showDiscussions[lesson._id] ? "Hide Discussions" : "Show Discussions"}
                    </span>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className={`h-5 w-5 transition-transform ${
                        showDiscussions[lesson._id] ? "transform rotate-180" : ""
                      }`}
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </button>

                  {showDiscussions[lesson._id] && (
                    <div className="mt-4">
                      <div className="mb-4">
                      <ul className="h-64 flex flex-col w-full overflow-y-scroll space-y-4 m-3 items-end">
                        {discussions[lesson._id]?.length > 0 ? (
                        discussions[lesson._id].map((discussion) => (discussion.user.role === "STUDENT" ?
                          <li key={discussion._id} className="w-[350px] bg-aliceblue p-4 border border-gray-200 rounded-lg shadow-md">
                            <div className="w-full bg-white p-3">
                            <p className="flex justify-between text-gray-700 font-medium">
                              <span className="text-gray-900">{discussion.user.name}</span>
                              <span className="text-gray-600 text-sm">{discussion.created_at}</span>
                            </p>
                            <p className="text-gray-700 text-start mt-2">{discussion.message}</p>
                            </div>
                          </li>
                          :
                          <li key={discussion._id} className="w-[350px] p-4 border border-gray-200 rounded-lg shadow-md self-start">
                            <div className="w-full bg-white p-3">
                            <p className="flex justify-between text-gray-700 font-medium">
                              <span className="text-gray-900">{discussion.user.name}</span>
                              <span className="text-gray-600 text-sm">{discussion.created_at}</span>
                            </p>
                            <p className="text-gray-700 text-start mt-2">{discussion.message}</p>
                            </div>
                          </li>
                        ))
                      ) : (
                        <div className="flex w-full h-full bg-gray-300 items-center justify-center">
                        <p className="bg-gray-300">No Discussions found</p>
                        </div>
                      )
                        }
                      </ul>
                        <textarea
                          placeholder="Enter your message"
                          value={newMessage}
                          onChange={(e) => setNewMessage(e.target.value)}
                          className="w-full p-2 border border-gray-300 rounded-lg"
                          rows="3"
                        />
                        <button
                          onClick={() => postDiscussion(lesson._id)}
                          className="mt-2 p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                        >
                          Send
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))
 
          ) : (
            <p className="text-center text-gray-500">No lessons available</p>
          )}
        </div>
      </div>
    </div>
    </div>
  );
};

export default LessonsPage;