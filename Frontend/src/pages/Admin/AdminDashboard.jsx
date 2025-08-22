import React from "react";
import { Link } from "react-router-dom";

const AdminDashboard = () => {
  return (
    <div className="p-6 text-white">
      <h2 className="text-3xl font-bold mb-6">Admin Dashboard</h2>
      <div className="flex flex-col gap-4">
        <Link to="/admin/problems" className="bg-amber-500 p-3 rounded-md text-black font-bold">Manage Problems</Link>
        <Link to="/admin/topics" className="bg-amber-500 p-3 rounded-md text-black font-bold">Manage Topics</Link>
      </div>
    </div>
  );
};

export default AdminDashboard;
