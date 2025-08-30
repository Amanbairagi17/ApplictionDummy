import React, { useState, useEffect } from "react";
import API, { apiCall } from "../../api/api";

const ProblemsList = () => {
  const [problems, setProblems] = useState([]);
  const [topics, setTopics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedTopic, setSelectedTopic] = useState("");
  const [selectedDifficulty, setSelectedDifficulty] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

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

  const filteredProblems = problems.filter(problem => {
    const matchesTopic = !selectedTopic || problem.topic?.id == selectedTopic;
    const matchesDifficulty = !selectedDifficulty || problem.difficulty === selectedDifficulty;
    const matchesSearch = !searchTerm || 
      problem.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      problem.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesTopic && matchesDifficulty && matchesSearch;
  });

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
        <div className="text-xl">Loading problems...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-center mb-8">Practice Problems</h1>
        
        {error && (
          <div className="mb-6 p-4 bg-red-600 text-white rounded-lg">
            {error}
          </div>
        )}

        {/* Filters */}
        <div className="bg-gray-800 p-6 rounded-lg mb-8">
          <h2 className="text-xl font-semibold mb-4">Filters</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Search</label>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search problems..."
                className="w-full px-4 py-2 rounded-md bg-gray-700 border border-gray-600 text-white focus:outline-none focus:border-amber-400"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">Topic</label>
              <select
                value={selectedTopic}
                onChange={(e) => setSelectedTopic(e.target.value)}
                className="w-full px-4 py-2 rounded-md bg-gray-700 border border-gray-600 text-white focus:outline-none focus:border-amber-400"
              >
                <option value="">All Topics</option>
                {topics.map((topic) => (
                  <option key={topic.id} value={topic.id}>
                    {topic.name}
                  </option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">Difficulty</label>
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
                  setSelectedTopic("");
                  setSelectedDifficulty("");
                  setSearchTerm("");
                }}
                className="w-full px-4 py-2 bg-gray-600 hover:bg-gray-500 rounded-md transition-colors"
              >
                Clear Filters
              </button>
            </div>
          </div>
        </div>

        {/* Problems Count */}
        <div className="mb-6">
          <p className="text-lg text-gray-300">
            Showing {filteredProblems.length} of {problems.length} problems
          </p>
        </div>

        {/* Problems Grid */}
        {filteredProblems.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-xl text-gray-400">No problems found matching your criteria.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProblems.map((problem) => (
              <div key={problem.problemId} className="bg-gray-800 rounded-lg p-6 hover:shadow-lg transition-shadow">
                <div className="flex justify-between items-start mb-3">
                  <h3 className="text-xl font-semibold text-amber-400">{problem.title}</h3>
                  <span className={`px-2 py-1 rounded text-xs font-medium ${getDifficultyColor(problem.difficulty)}`}>
                    {problem.difficulty}
                  </span>
                </div>
                
                <p className="text-gray-300 mb-4 line-clamp-3">
                  {problem.description}
                </p>
                
                <div className="flex justify-between items-center mb-4">
                  <span className="text-sm text-gray-400">
                    Topic: {problem.topicName || "Unknown"}
                  </span>
                  <span className="text-sm text-gray-400">
                    {problem.options?.length || 0} options
                  </span>
                </div>
                
                <div className="flex space-x-2">
                  <a
                    href={`/problems/${problem.problemId}`}
                    className="flex-1 bg-amber-400 hover:bg-amber-500 text-black text-center py-2 px-4 rounded-md font-semibold transition-colors"
                  >
                    View Problem
                  </a>
                  
                  {/* Only show solve button if user is authenticated */}
                  {localStorage.getItem("user") && (
                    <a
                      href={`/problems/${problem.problemId}/solve`}
                      className="flex-1 bg-blue-600 hover:bg-blue-700 text-white text-center py-2 px-4 rounded-md font-semibold transition-colors"
                    >
                      Solve
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Back to Home */}
        <div className="text-center mt-12">
          <a
            href="/"
            className="bg-gray-700 hover:bg-gray-600 text-white px-6 py-2 rounded-lg transition-colors"
          >
            Back to Home
          </a>
        </div>
      </div>
    </div>
  );
};

export default ProblemsList;
