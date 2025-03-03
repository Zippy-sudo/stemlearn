import { useState, useEffect, useCallback } from "react";

const LessonResources = ({ lessonId, baseURL }) => {
  const [resources, setResources] = useState([]);
  const [editResource, setEditResource] = useState(null);
  const [formData, setFormData] = useState({ title: "", file_url: "" });

  const apiRequest = useCallback(async (url, method, body = null) => {
    const token = sessionStorage.getItem("token");

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
      if (!response.ok) throw new Error(`API Error: ${response.statusText}`);
      return method !== "DELETE" ? await response.json() : true;
    } catch (error) {
      console.error("API Request Failed:", error);
      return null;
    }
  }, [baseURL]);

  // Fetch lesson resources
  const fetchResources = useCallback(async () => {
    try {
      const response = await apiRequest(`/lessons/${lessonId}/resources`, "GET");
      if (response) {
        setResources(response);
      }
    } catch (error) {
      console.error("Error fetching resources:", error);
    }
  }, [lessonId, apiRequest]);

  useEffect(() => {
    fetchResources();
  }, [fetchResources]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAddResource = async (e) => {
    e.preventDefault();
    try {
      const newResource = await apiRequest(`/lessons/${lessonId}/resources`, "POST", formData);
      if (newResource) {
        setResources([...resources, newResource]);
        setFormData({ title: "", file_url: "" });
      }
    } catch (error) {
      console.error("Error adding resource:", error);
    }
  };

  const handleEditResource = (resource) => {
    setEditResource(resource);
    setFormData({ title: resource.title, file_url: resource.file_url });
  };
  // edit a resource
  const handleUpdateResource = async (e) => {
    e.preventDefault();
    try {
      const updatedResource = await apiRequest(
        `/lessons/${lessonId}/resources/${editResource.id}`,
        "PATCH",
        formData
      );
      if (updatedResource) {
        setResources(resources.map((res) => (res.id === editResource.id ? updatedResource : res)));
        setEditResource(null);
        setFormData({ title: "", file_url: "" });
      }
    } catch (error) {
      console.error("Error updating resource:", error);
    }
  };

  // Delete a resource
  const handleDeleteResource = async (id) => {
    if (!window.confirm("Are you sure you want to delete this resource?")) return;
    try {
      const response = await apiRequest(`/lessons/${lessonId}/resources/${id}`, "DELETE");
      if (response) {
        setResources(resources.filter((res) => res.id !== id));
      }
    } catch (error) {
      console.error("Error deleting resource:", error);
    }
  };

  return (
    <div className="p-4 bg-gray-100 rounded-lg">
      <h2 className="text-xl font-bold mb-4">Lesson Resources</h2>

      <form onSubmit={editResource ? handleUpdateResource : handleAddResource} className="mb-4">
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
      </form>

      <ul>
        {resources.map((resource) => (
          <li key={resource.id} className="p-3 bg-white shadow rounded flex justify-between items-center mb-2">
            <div>
              <p className="font-semibold">{resource.title}</p>
              <a href={resource.file_url} target="_blank" rel="noopener noreferrer" className="text-blue-600">
                View Resource
              </a>
            </div>
            <div>
              <button onClick={() => handleEditResource(resource)} className="text-yellow-500 mr-2">Edit</button>
              <button onClick={() => handleDeleteResource(resource.id)} className="text-red-500">Delete</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default LessonResources;
