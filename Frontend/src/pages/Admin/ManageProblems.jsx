import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API, { apiCall } from "../../api/api";

const ManageProblems = () => {
  const navigate = useNavigate();
  const [problems, setProblems] = useState([]);
  const [topics, setTopics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTopic, setSelectedTopic] = useState("");
  const [selectedDifficulty, setSelectedDifficulty] = useState("");

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
    if (window.confirm("Are you sure you want to delete this problem? This action cannot be undone.")) {
      try {
        await apiCall(API.DELETE_PROBLEM_BY_ID(problemId), { method: "DELETE" });
        setProblems(problems.filter(p => p.problemId !== problemId));
        alert("Problem deleted successfully!");
      } catch (error) {
        alert("Failed to delete problem: " + error.message);
      }
    }
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'EASY': return 'bg-green-600 text-white';
      case 'MEDIUM': return 'bg-yellow-600 text-white';
      case 'HARD': return 'bg-red-600 text-white';
      case 'EXPERT': return 'bg-purple-600 text-white';
      default: return 'bg-gray-600 text-white';
    }
  };

  const getDifficultyText = (difficulty) => {
    switch (difficulty) {
      case 'EASY': return 'Easy';
      case 'MEDIUM': return 'Medium';
      case 'HARD': return 'Hard';
      case 'EXPERT': return 'Expert';
      default: return difficulty;
    }
  };

  // Filter problems based on search and filters
  const filteredProblems = problems.filter(problem => {
    const matchesSearch = problem.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         problem.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTopic = !selectedTopic || problem.topicName === selectedTopic;
    const matchesDifficulty = !selectedDifficulty || problem.difficulty === selectedDifficulty;
    
    return matchesSearch && matchesTopic && matchesDifficulty;
  });

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
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold">Manage Problems</h1>
          <button
            onClick={() => navigate("/admin/problems/create")}
            className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
          >
            + Add New Problem
          </button>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-600 text-white rounded-lg">
            {error}
          </div>
        )}

        {/* Search and Filters */}
        <div className="bg-gray-800 rounded-lg p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Search Problems</label>
              <input
                type="text"
                placeholder="Search by title or description..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2 rounded-md bg-gray-700 border border-gray-600 text-white focus:outline-none focus:border-amber-400"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Filter by Topic</label>
              <select
                value={selectedTopic}
                onChange={(e) => setSelectedTopic(e.target.value)}
                className="w-full px-4 py-2 rounded-md bg-gray-700 border border-gray-600 text-white focus:outline-none focus:border-amber-400"
              >
                <option value="">All Topics</option>
                {topics.map((topic) => (
                  <option key={topic.id} value={topic.name}>
                    {topic.name}
                  </option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Filter by Difficulty</label>
              <select
                value={selectedDifficulty}
                onChange={(e) => setSelectedDifficulty(e.target.value)}
                className="w-full px-4 py-2 rounded-md bg-gray-700 border border-gray-600 text-white focus:outline-none focus:border-amber-400"
              >
                <option value="">All Difficulties</option>
                <option value="EASY">Easy</option>
                <option value="MEDIUM">Medium</option>
                <option value="HARD">Hard</option>
                <option value="EXPERT">Expert</option>
              </select>
            </div>
            
            <div className="flex items-end">
              <button
                onClick={() => {
                  setSearchTerm("");
                  setSelectedTopic("");
                  setSelectedDifficulty("");
                }}
                className="w-full px-4 py-2 bg-gray-600 hover:bg-gray-500 text-white rounded-md transition-colors"
              >
                Clear Filters
              </button>
            </div>
          </div>
        </div>

        {/* Problems Table */}
        <div className="bg-gray-800 rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Problem
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Topic
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Difficulty
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Created
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                {filteredProblems.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="px-6 py-12 text-center text-gray-400">
                      {searchTerm || selectedTopic || selectedDifficulty 
                        ? "No problems match your filters. Try adjusting your search criteria."
                        : "No problems available. Create your first problem!"}
                    </td>
                  </tr>
                ) : (
                  filteredProblems.map((problem) => (
                    <tr key={problem.problemId} className="hover:bg-gray-700 transition-colors">
                      <td className="px-6 py-4">
                        <div>
                          <div className="text-sm font-medium text-white">{problem.title}</div>
                          <div className="text-sm text-gray-400 truncate max-w-xs">
                            {problem.description}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          {problem.topicName || "N/A"}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getDifficultyColor(problem.difficulty)}`}>
                          {getDifficultyText(problem.difficulty)}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-400">
                        {problem.createdAt ? new Date(problem.createdAt).toLocaleDateString() : "N/A"}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => navigate(`/admin/problems/edit/${problem.problemId}`)}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm transition-colors"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeleteProblem(problem.problemId)}
                            className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm transition-colors"
                          >
                            Delete
                          </button>
                          <button
                            onClick={() => navigate(`/problems/${problem.problemId}`)}
                            className="bg-gray-600 hover:bg-gray-500 text-white px-3 py-1 rounded text-sm transition-colors"
                          >
                            View
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Summary Stats */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-gray-800 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-white">{problems.length}</div>
            <div className="text-sm text-gray-400">Total Problems</div>
          </div>
          <div className="bg-gray-800 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-green-400">
              {problems.filter(p => p.difficulty === 'EASY').length}
            </div>
            <div className="text-sm text-gray-400">Easy</div>
          </div>
          <div className="bg-gray-800 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-yellow-400">
              {problems.filter(p => p.difficulty === 'MEDIUM').length}
            </div>
            <div className="text-sm text-gray-400">Medium</div>
          </div>
          <div className="bg-gray-800 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-red-400">
              {problems.filter(p => p.difficulty === 'HARD').length + problems.filter(p => p.difficulty === 'EXPERT').length}
            </div>
            <div className="text-sm text-gray-400">Hard/Expert</div>
          </div>
        </div>

        {/* Back to Dashboard */}
        <div className="text-center mt-8">
          <button
            onClick={() => navigate("/admin/dashboard")}
            className="bg-gray-700 hover:bg-gray-600 text-white px-6 py-2 rounded-lg transition-colors"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    </div>
  );
};

export default ManageProblems;
