import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

function Login({ setLoggedIn, baseURL }) {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const sessionTimeout = useRef(null)

  function handleChange(event) {
    setFormData({ ...formData, [event.target.name]: event.target.value });
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch(`${baseURL}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      setLoading(false);

      if (!response.ok) {
        setError(data.Error);
        return;
      }

      try {
        sessionStorage.setItem("Token", data["Token"]);
        sessionStorage.setItem("Role", data["Role"]);
        sessionTimeout.current = setTimeout(() => {
          setLoggedIn(false)
          sessionStorage.removeItem("Token")
          sessionStorage.removeItem("Role")
          navigate("/Login")
          toast.info("Session expired. Please login to continue.",{
          position: "top-center",
          autoClose: false,
          closeButton: true,
        })
      }, 55 * 60 * 1000)
      } catch (storageError) {
        console.error("Storage access error:", storageError);
      }

      setLoggedIn(true);

      if (data.Role === "ADMIN") {
        navigate("/AdminDashboard");
        toast.success("Login Successful.",{autoClose:1000})
      } else if (data.Role === "STUDENT") {
        navigate("/StudentDashboard");
        toast.success("Login Successful.",{autoClose:1000})
      } else {
        navigate("/TeacherDashboard");
        toast.success("Login Successful.",{autoClose:1000})
      }
    } catch (err) {
      setError("Failed to connect to server.");
      setLoading(false);
    }
  }

  useEffect(() => {
    return () => {
      if (sessionTimeout.current) {
        clearTimeout(sessionTimeout.current);
      }
    }
  }, [])

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold text-center text-gray-700">
          Sign In
        </h2>
        {error && (
          <p className="p-2 text-red-600 bg-red-100 border border-red-500 rounded">
            {error}
          </p>
        )}

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

        <p className="text-center text-gray-600">
          Don't have an account?{" "}
          <button
            onClick={() => navigate("/Signup")}
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
