import React, { useState, useEffect } from "react";
import API, { apiCall } from "../../api/api";

const CreateProblem = () => {
  const [formData, setFormData] = useState({
    title: "",
    category: "",
    description: "",
    topicId: "",
    difficulty: "EASY"
  });
  const [options, setOptions] = useState([
    { content: "", correct: false },
    { content: "", correct: false },
    { content: "", correct: false },
    { content: "", correct: false }
  ]);
  const [topics, setTopics] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    fetchTopics();
  }, []);

  const fetchTopics = async () => {
    try {
      const topicsData = await apiCall(API.GET_ALL_TOPICS_ALL);
      setTopics(topicsData);
    } catch (error) {
      setError("Failed to fetch topics: " + error.message);
    }
  };

  const handleOptionChange = (index, field, value) => {
    const newOptions = [...options];
    if (field === "correct") {
      // Only one option can be correct
      newOptions.forEach((opt, i) => {
        opt.correct = i === index;
      });
    } else {
      newOptions[index][field] = value;
    }
    setOptions(newOptions);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation
    if (!formData.title.trim() || !formData.description.trim() || !formData.topicId) {
      setError("Please fill in all required fields");
      return;
    }

    if (options.some(opt => !opt.content.trim())) {
      setError("Please fill in all option fields");
      return;
    }

    if (!options.some(opt => opt.correct)) {
      setError("Please select one correct answer");
      return;
    }

    try {
      setLoading(true);
      setError("");
      
      const problemData = {
        ...formData,
        options: options
      };

      await apiCall(API.CREATE_PROBLEM, {
        method: "POST",
        body: JSON.stringify(problemData),
      });

      setSuccess("Problem created successfully! Redirecting...");
      
      // Clear form
      setFormData({
        title: "",
        description: "",
        topicId: "",
        difficulty: "EASY"
      });
      setOptions([
        { content: "", correct: false },
        { content: "", correct: false },
        { content: "", correct: false },
        { content: "", correct: false }
      ]);

      // Redirect after 2 seconds
      setTimeout(() => {
        window.location.href = "/admin/dashboard";
      }, 2000);

    } catch (error) {
      setError("Failed to create problem: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-center mb-8">Create New Problem</h1>
        
        {error && (
          <div className="mb-6 p-4 bg-red-600 text-white rounded-lg">
            {error}
          </div>
        )}
        
        {success && (
          <div className="mb-6 p-4 bg-green-600 text-white rounded-lg">
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit} className="max-w-4xl mx-auto">
          {/* Basic Problem Info */}
          <div className="bg-gray-800 p-6 rounded-lg mb-6">
            <h2 className="text-2xl font-semibold mb-4">Problem Information</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium mb-2">Title *</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  className="w-full px-4 py-2 rounded-md bg-gray-700 border border-gray-600 text-white focus:outline-none focus:border-amber-400"
                  placeholder="Enter problem title"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Category (optional)</label>
                <input
                  type="text"
                  value={formData.category}
                  onChange={(e) => setFormData({...formData, category: e.target.value})}
                  className="w-full px-4 py-2 rounded-md bg-gray-700 border border-gray-600 text-white focus:outline-none focus:border-amber-400"
                  placeholder="Enter category"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Topic *</label>
                <select
                  value={formData.topicId}
                  onChange={(e) => setFormData({...formData, topicId: e.target.value})}
                  className="w-full px-4 py-2 rounded-md bg-gray-700 border border-gray-600 text-white focus:outline-none focus:border-amber-400"
                  required
                >
                  <option value="">Select a topic</option>
                  {topics.map((topic) => (
                    <option key={topic.id} value={topic.id}>
                      {topic.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">Difficulty</label>
              <select
                value={formData.difficulty}
                onChange={(e) => setFormData({...formData, difficulty: e.target.value})}
                className="w-full px-4 py-2 rounded-md bg-gray-700 border border-gray-600 text-white focus:outline-none focus:border-amber-400"
              >
                <option value="EASY">Easy</option>
                <option value="MEDIUM">Medium</option>
                <option value="HARD">Hard</option>
                <option value="EXPERT">Expert</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">Description *</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                className="w-full px-4 py-2 rounded-md bg-gray-700 border border-gray-600 text-white focus:outline-none focus:border-amber-400"
                rows="4"
                placeholder="Enter problem description"
                required
              />
            </div>
          </div>

          {/* Options */}
          <div className="bg-gray-800 p-6 rounded-lg mb-6">
            <h2 className="text-2xl font-semibold mb-4">Answer Options</h2>
            
            {options.map((option, index) => (
              <div key={index} className="flex items-center space-x-4 mb-4">
                <input
                  type="radio"
                  name="correct"
                  checked={option.correct}
                  onChange={() => handleOptionChange(index, "correct", true)}
                  className="w-4 h-4 text-amber-400 bg-gray-700 border-gray-600 focus:ring-amber-400"
                />
                <input
                  type="text"
                  value={option.content}
                  onChange={(e) => handleOptionChange(index, "content", e.target.value)}
                  className="flex-1 px-4 py-2 rounded-md bg-gray-700 border border-gray-600 text-white focus:outline-none focus:border-amber-400"
                  placeholder={`Option ${index + 1}`}
                  required
                />
                <span className="text-sm text-gray-400">
                  {option.correct ? "Correct Answer" : "Incorrect"}
                </span>
              </div>
            ))}
          </div>

          {/* Submit Buttons */}
          <div className="flex justify-center space-x-4">
            <button
              type="submit"
              disabled={loading}
              className={`px-8 py-3 rounded-lg font-semibold transition-colors ${
                loading
                  ? "bg-gray-500 cursor-not-allowed"
                  : "bg-green-600 hover:bg-green-700"
              }`}
            >
              {loading ? "Creating..." : "Create Problem"}
            </button>
            
            <a
              href="/admin/dashboard"
              className="px-8 py-3 bg-gray-700 hover:bg-gray-600 rounded-lg font-semibold transition-colors"
            >
              Cancel
            </a>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateProblem;
