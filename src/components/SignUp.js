import { useState } from "react";
import { useNavigate } from "react-router-dom";

function SignUp({baseURL}) {
  const [user, setUser] = useState({
    name: "",
    email: "",
    password: "",
  });
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    try {
    const response = await fetch(`${baseURL}/users`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(user),
    });
    if (!response.ok) {
      const error = await response.json();
      console.error("Error signing up:", error.message || "Unknown error");
      return;
    }
    navigate("/login");} catch (error) {
      console.error("Error signing up");
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-200">
      <div className="flex w-[900px] shadow-lg rounded-2xl overflow-hidden">
        {/* Left Side */}
        <div className="w-1/2 bg-cover bg-center flex items-center justify-center p-6" 
             style={{ backgroundImage: "url(https://i.pinimg.com/736x/9a/7c/df/9a7cdfee9c8842c74934ec429daa2820.jpg)" }}>
          <h2 className="text-purple text-3xl font-bold relative top-[-40px] left-[-10px]">STEM IT UP!</h2>
        </div>

        {/* Right Side - Signup Form */}
        <div className="w-1/2 bg-white p-8 rounded-r-2xl">
          <h2 className="text-2xl font-bold mb-4">Create Account</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex gap-4">
              <input
                type="text"
                placeholder="name"
                onChange={(e) => setUser({ ...user, name: e.target.value })}
                className="w-1/2 p-3 border rounded-md"
                required
              />
            </div>
            <input
              type="email"
              placeholder="Enter your email"
              onChange={(e) => setUser({ ...user, email: e.target.value })}
              className="w-full p-3 border rounded-md"
              required
            />
            <input
              type="password"
              placeholder="Create password"
              onChange={(e) => setUser({ ...user, password: e.target.value })}
              className="w-full p-3 border rounded-md"
              required
            />
            <button type="submit" className="w-full bg-purple-800 text-white py-3 rounded-md font-bold">
              Create Account
            </button>
            <p className="text-center text-gray-600 mt-2">
              Already have an account? <a href="/login" className="text-purple-600">Log in</a>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}

export default SignUp;