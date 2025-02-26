import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function Login({ setLoggedIn }) {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Handle form input changes
  function handleChange(event) {
    setFormData({ ...formData, [event.target.name]: event.target.value });
  }

  // Handle form submission
  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setLoading(true);

    // Debugging: Log the form data being sent
    console.log("Form Data Being Sent:", formData);

    try {
      const response = await fetch("http://127.0.0.1:5555/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      // Debugging: Log the response status and data
      console.log("Response Status:", response.status);

      const data = await response.json();
      console.log("Response Data:", data); // Debugging line

      setLoading(false);

      if (!response.ok) {
        // Handle backend errors (e.g., invalid email/password)
        setError(data.error || "Something went wrong!");
        return;
      }

      if (data.token) {
        // Save the token to localStorage
        localStorage.setItem("token", data.token);
        alert("Login successful!");
        navigate("/"); // Redirect to the home page
        setLoggedIn(true); // Update the logged-in state
      } else {
        // Handle case where no token is received
        setError("Login successful, but no token received.");
      }
    } catch (err) {
      // Handle network errors
      console.error("Fetch error:", err);
      setError("Failed to connect to the server.");
      setLoading(false);
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold text-center text-gray-700">
          Sign In
        </h2>

        {/* Display error messages */}
        {error && (
          <p className="p-2 text-red-600 bg-red-100 border border-red-500 rounded">
            {error}
          </p>
        )}

        {/* Login Form */}
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="block text-gray-700">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full p-2 mt-1 border rounded-lg focus:ring focus:ring-blue-300"
              placeholder="Enter your email"
              required
            />
          </div>

          <div>
            <label className="block text-gray-700">Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full p-2 mt-1 border rounded-lg focus:ring focus:ring-blue-300"
              placeholder="Enter your password"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full px-4 py-2 text-white bg-purple-700 rounded-lg hover:bg-blue-600"
            disabled={loading}
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        {/* Sign-up link */}
        <p className="text-center text-gray-600">
          Don't have an account?{" "}
          <button
            onClick={() => navigate("/signup")}
            className="text-purple-500 hover:underline"
          >
            Sign up
          </button>
        </p>
      </div>
    </div>
  );
}

export default Login;
