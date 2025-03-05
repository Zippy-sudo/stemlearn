import React, { useState } from "react";

function UploadLesson({ baseURL, fetchLessons }) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [videoUrl, setVideoUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  async function handleUpload() {
    setLoading(true);
    setError(null);

    const token = sessionStorage.getItem("Token");
    if (!token) {
      alert("Unauthorized! Please log in.");
      window.location.href = "/login";
      return;
    }

    const newLesson = {
      title,
      content,
      video_url: videoUrl,
    };

    try {
      const response = await fetch(`${baseURL}/lessons`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(newLesson),
      });

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      alert("Lesson uploaded successfully!");
      setTitle("");
      setContent("");
      setVideoUrl("");
      fetchLessons();
    } catch (err) {
      setError("Failed to upload lesson.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="p-4 bg-gray-100 rounded-lg mb-6">
      <h3 className="text-lg font-semibold">Upload a New Lesson</h3>
      {error && <p className="text-red-500">{error}</p>}
      <input
        type="text"
        placeholder="Lesson Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="w-full p-2 border rounded mb-2"
      />
      <textarea
        placeholder="Lesson Content"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        className="w-full p-2 border rounded mb-2"
      />
      <input
        type="text"
        placeholder="Video URL"
        value={videoUrl}
        onChange={(e) => setVideoUrl(e.target.value)}
        className="w-full p-2 border rounded mb-2"
      />
      <button
        onClick={handleUpload}
        disabled={loading}
        className="bg-blue-500 text-white p-2 rounded"
      >
        {loading ? "Uploading..." : "Upload Lesson"}
      </button>
    </div>
  );
}

export default UploadLesson;