import React, { useState } from "react";
import API, { apiCall } from "../api/api";

const SignUp = () => {
  const [formData, setFormData] = useState({ 
    name: "", 
    email: "", 
    password: "",
    role: "USER" // Default role
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (error) setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      // Choose endpoint based on role
      const endpoint = formData.role === "ADMIN" ? API.REGISTER_ADMIN : API.REGISTER_USER;
      
      const data = await apiCall(endpoint, {
        method: "POST",
        body: JSON.stringify(formData),
      });

      setSuccess(data.message || `User registered successfully as ${formData.role}! Please check your email for verification.`);
      setFormData({ name: "", email: "", password: "", role: "USER" });
      
      setTimeout(() => {
        window.location.href = "/signin";
      }, 3000);

    } catch (error) {
      console.error("Registration error:", error);
      setError(error.message || "Failed to register user. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900 text-white">
      <div className="bg-gray-800 p-8 rounded-2xl shadow-lg w-96">
        <h2 className="text-3xl font-bold mb-6 text-center">Sign Up</h2>
        
        {error && (
          <div className="mb-4 p-3 bg-red-600 text-white rounded-md text-sm">
            {error}
          </div>
        )}
        
        {success && (
          <div className="mb-4 p-3 bg-green-600 text-white rounded-md text-sm">
            {success}
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            type="text"
            name="name"
            placeholder="Full Name"
            className="px-4 py-3 rounded-md outline-none text-black"
            value={formData.name}
            onChange={handleChange}
            required
            disabled={loading}
          />
          
          <input
            type="email"
            name="email"
            placeholder="Email"
            className="px-4 py-3 rounded-md outline-none text-black"
            value={formData.email}
            onChange={handleChange}
            required
            disabled={loading}
          />
          
          <input
            type="password"
            name="password"
            placeholder="Password (8-12 characters)"
            className="px-4 py-3 rounded-md outline-none text-black"
            value={formData.password}
            onChange={handleChange}
            required
            minLength={8}
            maxLength={12}
            disabled={loading}
          />
          
          <select
            name="role"
            value={formData.role}
            onChange={handleChange}
            className="px-4 py-3 rounded-md outline-none text-black"
            disabled={loading}
          >
            <option value="USER">User</option>
            <option value="ADMIN">Admin</option>
          </select>
          
          <button
            type="submit"
            disabled={loading}
            className={`font-semibold py-3 px-6 rounded-md shadow-md transition-colors ${
              loading
                ? "bg-gray-500 cursor-not-allowed"
                : "bg-amber-400 hover:bg-amber-500 text-black"
            }`}
          >
            {loading ? "Signing Up..." : `Sign Up as ${formData.role}`}
          </button>
        </form>
        
        <p className="text-center mt-4">
          Already have an account?{" "}
          <a href="/signin" className="text-amber-400 hover:underline">
            Sign In
          </a>
        </p>
      </div>
    </div>
  );
};

export default SignUp;
