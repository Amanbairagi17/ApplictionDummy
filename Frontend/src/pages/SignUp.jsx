import React, { useState } from "react";
import API from "../api/api";

const SignUp = () => {
  const [formData, setFormData] = useState({ name: "", email: "", password: "" });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      let res = await fetch(API.REGISTER_USER, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      let data = await res.json();
      alert(data.message || "User registered successfully!");
    } catch (error) {
      console.error(error);
      alert("Error registering user");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900 text-white">
      <div className="bg-gray-800 p-8 rounded-2xl shadow-lg w-96">
        <h2 className="text-3xl font-bold mb-6 text-center">Sign Up</h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input type="text" name="name" placeholder="Full Name"
            className="px-4 py-3 rounded-md outline-none text-black"
            value={formData.name} onChange={handleChange} />
          <input type="email" name="email" placeholder="Email"
            className="px-4 py-3 rounded-md outline-none text-black"
            value={formData.email} onChange={handleChange} />
          <input type="password" name="password" placeholder="Password"
            className="px-4 py-3 rounded-md outline-none text-black"
            value={formData.password} onChange={handleChange} />
          <button type="submit"
            className="bg-amber-400 hover:bg-amber-500 text-black font-semibold py-3 px-6 rounded-md shadow-md">
            Sign Up
          </button>
        </form>
        <p className="text-center mt-4">
          Already have an account?{" "}
          <a href="/signin" className="text-amber-400 hover:underline">Sign In</a>
        </p>
      </div>
    </div>
  );
};

export default SignUp;
