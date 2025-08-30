import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API, { apiCall } from "../../api/api";

const ManageTopics = () => {
  const navigate = useNavigate();
  const [topics, setTopics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchTopics();
  }, []);

  const fetchTopics = async () => {
    try {
      setLoading(true);
      const topicsData = await apiCall(API.GET_ALL_TOPICS_ALL);
      setTopics(topicsData);
    } catch (error) {
      setError("Failed to fetch topics: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteTopic = async (topicId) => {
    if (window.confirm("Are you sure you want to delete this topic? This will also delete all problems associated with it.")) {
      try {
        await apiCall(API.DELETE_TOPIC_BY_ID(topicId), { method: "DELETE" });
        setTopics(topics.filter(t => t.id !== topicId));
        alert("Topic deleted successfully!");
      } catch (error) {
        alert("Failed to delete topic: " + error.message);
      }
    }
  };

  // Filter topics based on search
  const filteredTopics = topics.filter(topic => 
    topic.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (topic.description && topic.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );

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
          <h1 className="text-4xl font-bold">Manage Topics</h1>
          <button
            onClick={() => navigate("/admin/topics/create")}
            className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
          >
            + Add New Topic
          </button>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-600 text-white rounded-lg">
            {error}
          </div>
        )}

        {/* Search Bar */}
        <div className="bg-gray-800 rounded-lg p-6 mb-6">
          <div className="flex space-x-4">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-300 mb-2">Search Topics</label>
              <input
                type="text"
                placeholder="Search by name or description..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2 rounded-md bg-gray-700 border border-gray-600 text-white focus:outline-none focus:border-amber-400"
              />
            </div>
            <div className="flex items-end">
              <button
                onClick={() => setSearchTerm("")}
                className="px-4 py-2 bg-gray-600 hover:bg-gray-500 text-white rounded-md transition-colors"
              >
                Clear
              </button>
            </div>
          </div>
        </div>

        {/* Topics Table */}
        <div className="bg-gray-800 rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Topic Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Description
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                {filteredTopics.length === 0 ? (
                  <tr>
                    <td colSpan="3" className="px-6 py-12 text-center text-gray-400">
                      {searchTerm 
                        ? "No topics match your search. Try adjusting your search criteria."
                        : "No topics available. Create your first topic!"}
                    </td>
                  </tr>
                ) : (
                  filteredTopics.map((topic) => (
                    <tr key={topic.id} className="hover:bg-gray-700 transition-colors">
                      <td className="px-6 py-4">
                        <div className="text-sm font-medium text-white">{topic.name}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-400 max-w-md truncate">
                          {topic.description || "No description provided"}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => navigate(`/admin/topics/edit/${topic.id}`)}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm transition-colors"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeleteTopic(topic.id)}
                            className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm transition-colors"
                          >
                            Delete
                          </button>
                          <button
                            onClick={() => navigate(`/topics/${topic.id}`)}
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
        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-gray-800 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-white">{topics.length}</div>
            <div className="text-sm text-gray-400">Total Topics</div>
          </div>
          <div className="bg-gray-800 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-blue-400">
              {topics.filter(t => t.description && t.description.trim()).length}
            </div>
            <div className="text-sm text-gray-400">With Description</div>
          </div>
          <div className="bg-gray-800 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-green-400">
              {topics.filter(t => !t.description || !t.description.trim()).length}
            </div>
            <div className="text-sm text-gray-400">Without Description</div>
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

export default ManageTopics;
