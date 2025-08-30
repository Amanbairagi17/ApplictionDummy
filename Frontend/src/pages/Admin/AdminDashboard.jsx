import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import API, { apiCall } from "../../api/api";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [problems, setProblems] = useState([]);
  const [topics, setTopics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("overview");

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [problemsData, topicsData] = await Promise.all([
        apiCall(API.GET_ALL_PROBLEMS),
        apiCall(API.GET_ALL_TOPICS_ALL)
      ]);
      
      setProblems(problemsData.content || problemsData);
      setTopics(topicsData);
    } catch (error) {
      setError("Failed to fetch data: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteProblem = async (problemId) => {
    if (window.confirm("Are you sure you want to delete this problem?")) {
      try {
        await apiCall(API.DELETE_PROBLEM_BY_ID(problemId), { method: "DELETE" });
        setProblems(problems.filter(p => p.problemId !== problemId));
        alert("Problem deleted successfully!");
      } catch (error) {
        alert("Failed to delete problem: " + error.message);
      }
    }
  };

  const handleDeleteTopic = async (topicId) => {
    if (window.confirm("Are you sure you want to delete this topic?")) {
      try {
        await apiCall(API.DELETE_TOPIC_BY_ID(topicId), { method: "DELETE" });
        setTopics(topics.filter(t => t.id !== topicId));
        alert("Topic deleted successfully!");
      } catch (error) {
        alert("Failed to delete topic: " + error.message);
      }
    }
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'EASY': return 'bg-green-600';
      case 'MEDIUM': return 'bg-yellow-600';
      case 'HARD': return 'bg-red-600';
      case 'EXPERT': return 'bg-purple-600';
      default: return 'bg-gray-600';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-center mb-8">Admin Dashboard</h1>
        
        {error && (
          <div className="mb-6 p-4 bg-red-600 text-white rounded-lg">
            {error}
          </div>
        )}

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg p-6 text-center">
            <div className="text-3xl font-bold">{problems.length}</div>
            <div className="text-blue-100">Total Problems</div>
          </div>
          <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-lg p-6 text-center">
            <div className="text-3xl font-bold">{topics.length}</div>
            <div className="text-green-100">Total Topics</div>
          </div>
          <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg p-6 text-center">
            <div className="text-3xl font-bold">
              {problems.filter(p => p.difficulty === 'EASY').length}
            </div>
            <div className="text-purple-100">Easy Problems</div>
          </div>
          <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg p-6 text-center">
            <div className="text-3xl font-bold">
              {problems.filter(p => p.difficulty === 'HARD' || p.difficulty === 'EXPERT').length}
            </div>
            <div className="text-orange-100">Hard Problems</div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex justify-center mb-8">
          <div className="bg-gray-800 rounded-lg p-1">
            <button
              onClick={() => setActiveTab("overview")}
              className={`px-6 py-2 rounded-md transition-colors ${
                activeTab === "overview"
                  ? "bg-amber-400 text-black"
                  : "text-gray-300 hover:text-white"
              }`}
            >
              Overview
            </button>
            <button
              onClick={() => setActiveTab("problems")}
              className={`px-6 py-2 rounded-md transition-colors ${
                activeTab === "problems"
                  ? "bg-amber-400 text-black"
                  : "text-gray-300 hover:text-white"
              }`}
            >
              Problems
            </button>
            <button
              onClick={() => setActiveTab("topics")}
              className={`px-6 py-2 rounded-md transition-colors ${
                activeTab === "topics"
                  ? "bg-amber-400 text-black"
                  : "text-gray-300 hover:text-white"
              }`}
            >
              Topics
            </button>
          </div>
        </div>

        {/* Overview Tab */}
        {activeTab === "overview" && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Quick Actions */}
              <div className="bg-gray-800 rounded-lg p-6">
                <h3 className="text-xl font-semibold mb-4">Quick Actions</h3>
                <div className="space-y-3">
                  <button
                    onClick={() => navigate("/admin/problems/create")}
                    className="w-full bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors"
                  >
                    + Create New Problem
                  </button>
                  <button
                    onClick={() => navigate("/admin/topics/create")}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
                  >
                    + Create New Topic
                  </button>
                  <button
                    onClick={() => navigate("/admin/problems")}
                    className="w-full bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition-colors"
                  >
                    Manage All Problems
                  </button>
                  <button
                    onClick={() => navigate("/admin/topics")}
                    className="w-full bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg transition-colors"
                  >
                    Manage All Topics
                  </button>
                </div>
              </div>

              {/* Recent Activity */}
              <div className="bg-gray-800 rounded-lg p-6">
                <h3 className="text-xl font-semibold mb-4">Recent Activity</h3>
                <div className="space-y-2 text-sm text-gray-300">
                  <p>• {problems.length} problems available</p>
                  <p>• {topics.length} topics created</p>
                  <p>• Latest problem: {problems.length > 0 ? problems[problems.length - 1]?.title : "None"}</p>
                  <p>• Latest topic: {topics.length > 0 ? topics[topics.length - 1]?.name : "None"}</p>
                </div>
              </div>
            </div>

            {/* Difficulty Distribution */}
            <div className="bg-gray-800 rounded-lg p-6">
              <h3 className="text-xl font-semibold mb-4">Problem Difficulty Distribution</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-400">
                    {problems.filter(p => p.difficulty === 'EASY').length}
                  </div>
                  <div className="text-sm text-gray-400">Easy</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-yellow-400">
                    {problems.filter(p => p.difficulty === 'MEDIUM').length}
                  </div>
                  <div className="text-sm text-gray-400">Medium</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-red-400">
                    {problems.filter(p => p.difficulty === 'HARD').length}
                  </div>
                  <div className="text-sm text-gray-400">Hard</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-400">
                    {problems.filter(p => p.difficulty === 'EXPERT').length}
                  </div>
                  <div className="text-sm text-gray-400">Expert</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Problems Tab */}
        {activeTab === "problems" && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-semibold">Recent Problems</h2>
              <button
                onClick={() => navigate("/admin/problems")}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
              >
                View All Problems
              </button>
            </div>
            
            <div className="bg-gray-800 rounded-lg overflow-hidden">
              <table className="w-full">
                <thead className="bg-gray-700">
                  <tr>
                    <th className="px-6 py-3 text-left">Title</th>
                    <th className="px-6 py-3 text-left">Topic</th>
                    <th className="px-6 py-3 text-left">Difficulty</th>
                    <th className="px-6 py-3 text-left">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {problems.slice(0, 5).map((problem) => (
                    <tr key={problem.problemId} className="border-t border-gray-700">
                      <td className="px-6 py-4">{problem.title}</td>
                      <td className="px-6 py-4">{problem.topicName || "N/A"}</td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 rounded text-xs ${getDifficultyColor(problem.difficulty)}`}>
                          {problem.difficulty}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => navigate(`/admin/problems/edit/${problem.problemId}`)}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeleteProblem(problem.problemId)}
                            className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Topics Tab */}
        {activeTab === "topics" && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-semibold">Recent Topics</h2>
              <button
                onClick={() => navigate("/admin/topics")}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
              >
                View All Topics
              </button>
            </div>
            
            <div className="bg-gray-800 rounded-lg overflow-hidden">
              <table className="w-full">
                <thead className="bg-gray-700">
                  <tr>
                    <th className="px-6 py-3 text-left">Name</th>
                    <th className="px-6 py-3 text-left">Description</th>
                    <th className="px-6 py-3 text-left">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {topics.slice(0, 5).map((topic) => (
                    <tr key={topic.id} className="border-t border-gray-700">
                      <td className="px-6 py-4">{topic.name}</td>
                      <td className="px-6 py-4">{topic.description || "No description"}</td>
                      <td className="px-6 py-4">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => navigate(`/admin/topics/edit/${topic.id}`)}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeleteTopic(topic.id)}
                            className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Back to Home */}
        <div className="text-center mt-8">
          <button
            onClick={() => navigate("/")}
            className="bg-gray-700 hover:bg-gray-600 text-white px-6 py-2 rounded-lg transition-colors"
          >
            Back to Home
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
