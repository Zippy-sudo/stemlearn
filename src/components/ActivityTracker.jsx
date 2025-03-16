import React, { useState, useEffect, useRef, useCallback } from "react";
import { toast } from "react-toastify";

async function apiRequest(url, method, body = null) {
  const token = sessionStorage.getItem("Token");
  if (!token) {
    toast.error("Unauthorized! Please log in.");
    window.location.href = "/Login";
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
      toast.error(`${response["Error"]}`)
    }
    return await response.json();
  } catch (error) {
    console.error("API request error:", error);
    alert("Failed to connect to the server.");
    return null;
  }
}

// Track user activity
const ActivityTracker = ({ baseURL }) => {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({ student: "", date: "", action: "" });
  const [clearingLogs, setClearingLogs] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const isActive = useRef(true);

  const fetchActivities = useCallback(async () => {
    if (!isActive.current) return;

    try {
      let url = `${baseURL}/activities`;
      const data = await apiRequest(url, "GET");
      if (data) setActivities(data);
    } catch (err) {
      setError(err.message || "Failed to fetch activities.");
    } finally {
      setLoading(false);
    }
  }, [baseURL]);

  const handleClearButtonClick = () => {
    setShowConfirmDialog(true);
  };

  const handleConfirmClear = async (confirmed) => {
    setShowConfirmDialog(false);
    
    if (!confirmed) return;
    
    setClearingLogs(true);
    try {
      const response = await apiRequest(`${baseURL}/activities`, "DELETE");
      if (response && response.Success) {
        alert("Activity logs cleared successfully!");
        setActivities([]);
      }
    } catch (err) {
      setError(err.message || "Failed to clear activity logs.");
    } finally {
      setClearingLogs(false);
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
  }, [fetchActivities]);


  if (loading) return <div className="text-center text-lg p-4">Loading activities...</div>;
  if (error) return <div className="text-red-500 text-center p-4">Error: {error}</div>;

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-lg">
      {/* confirmation to clear logs */}
      {showConfirmDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full">
            <h3 className="text-xl font-bold mb-4">Confirm Clear Logs</h3>
            <p className="mb-6">Are you sure you want to clear all activity logs? This action cannot be undone.</p>
            <div className="flex justify-end space-x-4">
              <button 
                onClick={() => handleConfirmClear(false)} 
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100"
              >
                Cancel
              </button>
              <button 
                onClick={() => handleConfirmClear(true)} 
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
              >
                Clear Logs
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold text-gray-800">Activity Tracker</h2>
        <button 
          onClick={handleClearButtonClick}
          disabled={clearingLogs || activities.length === 0}
          className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          {clearingLogs ? "Clearing..." : "Clear All Logs"}
        </button>
      </div>

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