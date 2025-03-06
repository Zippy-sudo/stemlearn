import { useState, useEffect, useCallback } from "react";

const LessonResources = ({ lessonId, baseURL }) => {
  const [resources, setResources] = useState([]);
  const [editResource, setEditResource] = useState(null);
  const [formData, setFormData] = useState({ title: "", file_url: "" });
  const [selectedLesson, setSelectedLesson] = useState(null);
  const [lessons, setLessons] = useState([]);
  const [loading, setLoading] = useState(true);

  const apiRequest = useCallback(async (url, method, body = null) => {
    const token = sessionStorage.getItem("Token");

    const options = {
      method,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      ...(body && { body: JSON.stringify(body) }),
    };

    try {
      const response = await fetch(`${baseURL}${url}`, options);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error("API Error Response:", {
          status: response.status,
          statusText: response.statusText,
          body: errorText
        });
        throw new Error(`API Error: ${response.statusText}`);
      }

      if (method === "DELETE") return true;
      
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("API Request Failed:", error);
      return null;
    }
  }, [baseURL]);

  // Fetch all courses with lessons
  const fetchCourses = useCallback(async () => {
    setLoading(true);
    try {
      const response = await apiRequest("/courses", "GET");
      if (response) {
        let allLessons = [];
        for (const course of response) {
          if (course.lessons) {
            allLessons = [...allLessons, ...course.lessons.map(lesson => ({
              ...lesson,
              courseName: course.name
            }))];
          }
        }
        setLessons(allLessons);
        
        if (lessonId) {
          const foundLesson = allLessons.find(lesson => 
            lesson._id === lessonId || lesson._id === parseInt(lessonId)
          );
          setSelectedLesson(foundLesson || null);
        }
      }
    } catch (error) {
      console.error("Error fetching courses:", error);
    } finally {
      setLoading(false);
    }
  }, [apiRequest, lessonId]);

  // Fetch all resources
  const fetchResources = useCallback(async () => {
    if (!selectedLesson) return;
    
    try {
      const response = await apiRequest("/resources", "GET");
      if (response) {
        // Filter resources that belong to the selected lesson
        const lessonResources = response.filter(resource => 
          resource.lesson_id === selectedLesson._id || 
          resource.lesson_id === String(selectedLesson._id)
        );
        setResources(lessonResources);
      }
    } catch (error) {
      console.error("Error fetching resources:", error);
    }
  }, [apiRequest, selectedLesson]);

  useEffect(() => {
    fetchCourses();
  }, [fetchCourses]);

  useEffect(() => {
    if (selectedLesson) {
      fetchResources();
    }
  }, [selectedLesson, fetchResources]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleLessonChange = (e) => {
    const lessonId = e.target.value;
    const lesson = lessons.find(l => l._id === parseInt(lessonId) || l._id === lessonId);
    setSelectedLesson(lesson);
  };

  const handleAddResource = async (e) => {
    e.preventDefault();
    
    if (!selectedLesson) {
      alert("Please select a lesson first");
      return;
    }
    
    const dataToSend = {
      lesson_id: selectedLesson._id,
      title: formData.title,
      file_url: formData.file_url
    };
    
    try {
      const result = await apiRequest("/resources", "POST", dataToSend);
      if (result) {
        fetchResources();
        setFormData({ title: "", file_url: "" });
      }
    } catch (error) {
      console.error("Error adding resource:", error);
    }
  };

  const handleEditResource = (resource) => {
    setEditResource(resource);
    setFormData({ 
      title: resource.title, 
      file_url: resource.file_url 
    });
  };

  const handleUpdateResource = async (e) => {
    e.preventDefault();
    
    if (!selectedLesson || !editResource) return;
    
    const dataToSend = {
      lesson_id: selectedLesson._id,
      title: formData.title,
      file_url: formData.file_url
    };
    
    try {
      const result = await apiRequest(
        `/resources/${editResource._id}`,
        "PATCH",
        dataToSend
      );
      if (result) {
        fetchResources();
        setEditResource(null);
        setFormData({ title: "", file_url: "" });
      }
    } catch (error) {
      console.error("Error updating resource:", error);
    }
  };

  const handleDeleteResource = async (id) => {
    if (!window.confirm("Are you sure you want to delete this resource?")) return;
    try {
      const response = await apiRequest(`/resources/${id}`, "DELETE");
      if (response) {
        fetchResources();
      }
    } catch (error) {
      console.error("Error deleting resource:", error);
    }
  };

  if (loading) {
    return <div className="p-4">Loading lessons and resources...</div>;
  }

  return (
    <div className="p-4 bg-gray-100 rounded-lg">
      <h2 className="text-xl font-bold mb-4">Lesson Resources</h2>
      
      {/* select a lesson */}
      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">Select Lesson</label>
        <select 
          className="border p-2 rounded w-full"
          value={selectedLesson?._id || ""}
          onChange={handleLessonChange}
        >
          <option value="">-- Select a lesson --</option>
          {lessons.map(lesson => (
            <option key={lesson._id} value={lesson._id}>
             {lesson.title} - {lesson.courseName} 
            </option>
          ))}
        </select>
      </div>
      
      {selectedLesson && (
        <>
          <form onSubmit={editResource ? handleUpdateResource : handleAddResource} className="mb-4">
            <div className="mb-2 text-sm text-gray-500">
              Selected Lesson ID: {selectedLesson._id} | Lesson Title: {selectedLesson.title}
            </div>
            
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Resource Title"
              required
              className="border p-2 rounded w-full mb-2"
            />
            <input
              type="text"
              name="file_url"
              value={formData.file_url}
              onChange={handleChange}
              placeholder="File URL"
              required
              className="border p-2 rounded w-full mb-2"
            />
            <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
              {editResource ? "Update Resource" : "Add Resource"}
            </button>
            {editResource && (
              <button 
                type="button" 
                onClick={() => {
                  setEditResource(null);
                  setFormData({ title: "", file_url: "" });
                }}
                className="bg-gray-500 text-white px-4 py-2 rounded ml-2"
              >
                Cancel
              </button>
            )}
          </form>

          <ul>
            {resources.length > 0 ? (
              resources.map((resource) => (
                <li key={resource._id} className="p-3 bg-white shadow rounded flex justify-between items-center mb-2">
                  <div>
                    <p className="font-semibold">{resource.title}</p>
                    <a href={resource.file_url} target="_blank" rel="noopener noreferrer" className="text-blue-600">
                      View Resource
                    </a>
                  </div>
                  <div>
                    <button onClick={() => handleEditResource(resource)} className="text-yellow-500 mr-2">Edit</button>
                    <button onClick={() => handleDeleteResource(resource._id)} className="text-red-500">Delete</button>
                  </div>
                </li>
              ))
            ) : (
              <p>No resources available for this lesson.</p>
            )}
          </ul>
        </>
      )}
      
      {!selectedLesson && (
        <div className="p-4 text-center text-gray-500">
          Please select a lesson to manage its resources
        </div>
      )}
    </div>
  );
};

export default LessonResources;