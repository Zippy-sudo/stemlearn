import React, { useState } from "react";

function LessonItem({ lesson, deleteLesson, editLesson }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(lesson.title);
  const [editContent, setEditContent] = useState(lesson.content);
  const [editVideoUrl, setEditVideoUrl] = useState(lesson.video_url || "");

  const handleEdit = async () => {
    const updatedLesson = {
      title: editTitle,
      content: editContent,
      video_url: editVideoUrl,
    };
    await editLesson(lesson._id, updatedLesson);
    setIsEditing(false);
  };

  return (
    <li className="bg-white p-4 rounded shadow">
      {isEditing ? (
        <div className="p-4">
          <input
            type="text"
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
            placeholder="Lesson Title"
            className="w-full p-2 border rounded mb-2"
          />
          <textarea
            value={editContent}
            onChange={(e) => setEditContent(e.target.value)}
            placeholder="Lesson Content"
            className="w-full p-2 border rounded mb-2"
          />
          <input
            type="text"
            value={editVideoUrl}
            onChange={(e) => setEditVideoUrl(e.target.value)}
            placeholder="Video URL"
            className="w-full p-2 border rounded mb-2"
          />
          <div className="flex justify-end">
            <button
              onClick={() => setIsEditing(false)}
              className="bg-gray-500 text-white p-2 rounded mr-2"
            >
              Cancel
            </button>
            <button
              onClick={handleEdit}
              className="bg-blue-500 text-white p-2 rounded"
            >
              Save Changes
            </button>
          </div>
        </div>
      ) : (
        <>
          <h4 className="text-xl font-bold">{lesson.title}</h4>
          <p className="text-gray-600">{lesson.content}</p>
          {lesson.video_url && (
            <a
              href={lesson.video_url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 hover:underline"
            >
              Watch Video
            </a>
          )}
          <div className="mt-2">
            <button onClick={() => setIsEditing(true)} className="bg-yellow-500 text-white p-2 rounded">
              Edit
            </button>
            <button onClick={() => deleteLesson(lesson._id)} className="bg-red-500 text-white p-2 rounded ml-2">
              Delete
            </button>
          </div>
        </>
      )}
    </li>
  );
}

export default LessonItem;