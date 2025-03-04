import React, { useState, useEffect, useRef } from "react";

async function apiRequest(url, method, body = null) {
  const token = sessionStorage.getItem("Token");
  if (!token) {
    alert("Unauthorized! Please log in.");
    window.location.href = "/login";
    return;
  }

  const options = {
    method,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    ...(body && { body: JSON.stringify(body) }),
  };

  try {
    const response = await fetch(url, options);
    if (!response.ok) {
      if (response.status === 401) {
        alert("Session expired. Please log in again.");
        sessionStorage.removeItem("Token");
        window.location.href = "/login";
      }
      throw new Error(`Error ${response.status}: ${response.statusText}`);
    }
    return await response.json();
  } catch (error) {
    console.error("API request error:", error);
    alert("Failed to connect to the server.");
    return null;
  }
}

// Track user activity
const ActivityTracker = () => {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({ student: "", date: "", action: "" });
  const isActive = useRef(true);

  // Fetch activities from the backend
  // Stop API calls when user is inactive
  // Filter activities based on user selection
  const fetchActivities = async () => {
    if (!isActive.current) return;

    try {
      let url = "/activities";
      const data = await apiRequest(url, "GET");
      if (data) setActivities(data);
    } catch (err) {
      setError(err.message || "Failed to fetch activities.");
    } finally {
      setLoading(false);
    }
  };

  const filteredActivities = activities.filter((activity) => {
    return (
      (filters.student ? activity.user.name.includes(filters.student) : true) &&
      (filters.date ? activity.timestamp.includes(filters.date) : true) &&
      (filters.action ? activity.action.includes(filters.action) : true)
    );
  });

  // Mark as active on mount and fetch activities
  // Poll every 10 seconds
  // Stop polling if tab is inactive
  useEffect(() => {
    isActive.current = true;
    fetchActivities();
    const interval = setInterval(fetchActivities, 10000);

    const handleVisibilityChange = () => {
      isActive.current = !document.hidden;
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      clearInterval(interval);
      isActive.current = false;
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);

  if (loading) return <div className="text-center text-lg p-4">Loading activities...</div>;
  if (error) return <div className="text-red-500 text-center p-4">Error: {error}</div>;

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-lg">
      <h2 className="text-2xl font-semibold mb-6 text-gray-800">Activity Tracker</h2>

      {/* Filtering by date/name/activity */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <input
          type="text"
          placeholder="Filter by student"
          value={filters.student}
          onChange={(e) => setFilters({ ...filters, student: e.target.value })}
          className="border p-2 rounded w-full md:w-auto focus:ring focus:ring-blue-300"
        />
        <input
          type="date"
          value={filters.date}
          onChange={(e) => setFilters({ ...filters, date: e.target.value })}
          className="border p-2 rounded w-full md:w-auto focus:ring focus:ring-blue-300"
        />
        <input
          type="text"
          placeholder="Filter by action"
          value={filters.action}
          onChange={(e) => setFilters({ ...filters, action: e.target.value })}
          className="border p-2 rounded w-full md:w-auto focus:ring focus:ring-blue-300"
        />
      </div>

      {/* Activity List */}
      {filteredActivities.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse border border-gray-200">
            <thead>
              <tr className="bg-gray-100">
                <th className="border p-3 text-left">Student</th>
                <th className="border p-3 text-left">Action</th>
                <th className="border p-3 text-left">Timestamp</th>
              </tr>
            </thead>
            <tbody>
              {filteredActivities.map((activity) => (
                <tr key={activity._id} className="hover:bg-gray-50">
                  <td className="border p-3">{activity.user.name}</td>
                  <td className="border p-3">{activity.action}</td>
                  <td className="border p-3">{activity.timestamp}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="text-center text-gray-600">No activities found.</p>
      )}
    </div>
  );
};

export default ActivityTracker;