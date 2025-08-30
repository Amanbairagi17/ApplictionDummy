import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const SignIn = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    // Clear error when user starts typing
    if (error) setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const result = await login(formData.email, formData.password);
      
      if (result.success) {
        // Redirect based on user role
        if (result.user.role === 'ADMIN') {
          navigate('/admin/dashboard');
        } else {
          navigate('/');
        }
      }
    } catch (error) {
      console.error("Login error:", error);
      setError(error.message || "Failed to login. Please check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900 text-white">
      <div className="bg-gray-800 p-8 rounded-2xl shadow-lg w-96">
        <h2 className="text-3xl font-bold mb-6 text-center">Sign In</h2>
        
        {/* Error Message */}
        {error && (
          <div className="mb-4 p-3 bg-red-600 text-white rounded-md text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
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
            placeholder="Password"
            className="px-4 py-3 rounded-md outline-none text-black"
            value={formData.password} 
            onChange={handleChange}
            required
            disabled={loading}
          />
          <button 
            type="submit"
            disabled={loading}
            className={`font-semibold py-3 px-6 rounded-md shadow-md transition-colors ${
              loading 
                ? "bg-gray-500 cursor-not-allowed" 
                : "bg-amber-400 hover:bg-amber-500 text-black"
            }`}
          >
            {loading ? "Signing In..." : "Sign In"}
          </button>
        </form>
        
        <p className="text-center mt-4">
          Don't have an account?{" "}
          <a href="/signup" className="text-amber-400 hover:underline">
            Sign Up
          </a>
        </p>

        {/* Test Credentials Info */}
        <div className="mt-6 p-3 bg-gray-700 rounded-md text-sm">
          <p className="text-gray-300 mb-2">Test Admin Account:</p>
          <p className="text-gray-400">Email: admin@example.com</p>
          <p className="text-gray-400">Password: admin123</p>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
