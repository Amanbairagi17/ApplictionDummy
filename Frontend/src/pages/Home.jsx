import React, { useState, useEffect } from "react";
import API, { apiCall } from "../api/api";

const Home = () => {
  const [testResult, setTestResult] = useState("");
  const [user, setUser] = useState(null);
  const [problems, setProblems] = useState([]);
  const [topics, setTopics] = useState([]);

  useEffect(() => {
    // Check if user is logged in
    const userData = localStorage.getItem("user");
    if (userData) {
      setUser(JSON.parse(userData));
    }

    // Fetch some sample data
    fetchSampleData();
  }, []);

  const fetchSampleData = async () => {
    try {
      const [problemsData, topicsData] = await Promise.all([
        apiCall(API.GET_ALL_PROBLEMS),
        apiCall(API.GET_ALL_TOPICS_ALL)
      ]);
      
      setProblems(problemsData.content || problemsData);
      setTopics(topicsData);
    } catch (error) {
      console.log("Could not fetch sample data:", error.message);
    }
  };

  const testBackendConnection = async () => {
    try {
      const result = await apiCall("http://localhost:8080/auth/test");
      setTestResult(`✅ Backend connected: ${result}`);
    } catch (error) {
      setTestResult(`❌ Backend connection failed: ${error.message}`);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    setUser(null);
    window.location.reload();
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-center mb-8">Welcome to Grabtitude</h1>
        
        {/* User Status */}
        {user && (
          <div className="max-w-md mx-auto bg-green-800 p-4 rounded-lg mb-8 text-center">
            <p className="text-lg">Welcome back, <span className="font-semibold">{user.name}</span>!</p>
            <button
              onClick={handleLogout}
              className="mt-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md"
            >
              Logout
            </button>
          </div>
        )}
        
        {/* Backend Connection Test */}
        <div className="max-w-md mx-auto bg-gray-800 p-6 rounded-lg mb-8">
          <h2 className="text-xl font-semibold mb-4">Backend Connection Test</h2>
          <button
            onClick={testBackendConnection}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded mb-4 w-full"
          >
            Test Backend Connection
          </button>
          {testResult && (
            <div className={`p-3 rounded text-sm ${
              testResult.includes('✅') ? 'bg-green-600' : 'bg-red-600'
            }`}>
              {testResult}
            </div>
          )}
          <a
            href="/test-connection"
            className="block text-center mt-3 text-amber-400 hover:text-amber-300 text-sm underline"
          >
            Full Connection Test
          </a>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-gray-800 p-6 rounded-lg text-center">
            <h3 className="text-2xl font-bold text-amber-400">{problems.length}</h3>
            <p className="text-gray-300">Practice Problems</p>
          </div>
          <div className="bg-gray-800 p-6 rounded-lg text-center">
            <h3 className="text-2xl font-bold text-amber-400">{topics.length}</h3>
            <p className="text-gray-300">Topics</p>
          </div>
          <div className="bg-gray-800 p-6 rounded-lg text-center">
            <h3 className="text-2xl font-bold text-amber-400">
              {user ? "Ready to Practice" : "Sign Up to Start"}
            </h3>
            <p className="text-gray-300">Status</p>
          </div>
        </div>

        {/* Main Actions */}
        <div className="text-center mb-8">
          <p className="text-xl mb-6">Your learning journey starts here!</p>
          <div className="flex flex-wrap justify-center gap-4">
            <a
              href="/problems"
              className="bg-amber-400 hover:bg-amber-500 text-black font-semibold py-3 px-6 rounded-lg shadow-md transition-colors"
            >
              Browse Problems
            </a>
            
            {user ? (
              <>
                <a
                  href="/practice"
                  className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg shadow-md transition-colors"
                >
                  Start Practice
                </a>
                <div className="flex flex-wrap justify-center gap-2 mt-4">
                  <a
                    href="/practice/quantitative"
                    className="bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-lg text-sm transition-colors"
                  >
                    Quantitative
                  </a>
                  <a
                    href="/practice/logical"
                    className="bg-purple-600 hover:bg-purple-700 text-white font-medium py-2 px-4 rounded-lg text-sm transition-colors"
                  >
                    Logical
                  </a>
                  <a
                    href="/practice/verbal"
                    className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-lg text-sm transition-colors"
                  >
                    Verbal
                  </a>
                </div>
                {user.role === 'ADMIN' && (
                  <a
                    href="/admin/dashboard"
                    className="bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 px-6 rounded-lg shadow-md transition-colors"
                  >
                    Admin Panel
                  </a>
                )}
              </>
            ) : (
              <>
                <a
                  href="/signup"
                  className="bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-lg shadow-md transition-colors"
                >
                  Get Started
                </a>
                <a
                  href="/signin"
                  className="bg-gray-700 hover:bg-gray-600 text-white font-semibold py-3 px-6 rounded-lg shadow-md transition-colors"
                >
                  Sign In
                </a>
              </>
            )}
          </div>
        </div>

        {/* Recent Problems Preview */}
        {problems.length > 0 && (
          <div className="mb-8">
            <h2 className="text-2xl font-semibold text-center mb-6">Recent Problems</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {problems.slice(0, 6).map((problem) => (
                <div key={problem.problemId} className="bg-gray-800 p-4 rounded-lg">
                  <h3 className="font-semibold text-amber-400 mb-2">{problem.title}</h3>
                  <p className="text-sm text-gray-300 line-clamp-2">{problem.description}</p>
                  <div className="flex justify-between items-center mt-3">
                    <span className="text-xs text-gray-400">{problem.topicName || "Unknown"}</span>
                    <span className={`px-2 py-1 rounded text-xs ${
                      problem.difficulty === 'EASY' ? 'bg-green-600' :
                      problem.difficulty === 'MEDIUM' ? 'bg-yellow-600' :
                      problem.difficulty === 'HARD' ? 'bg-red-600' :
                      'bg-purple-600'
                    }`}>
                      {problem.difficulty}
                    </span>
                  </div>
                </div>
              ))}
            </div>
            <div className="text-center mt-6">
              <a
                href="/problems"
                className="bg-gray-700 hover:bg-gray-600 text-white px-6 py-2 rounded-lg transition-colors"
              >
                View All Problems
              </a>
            </div>
          </div>
        )}

        {/* Features Overview */}
        <div className="bg-gray-800 p-8 rounded-lg">
          <h2 className="text-2xl font-semibold text-center mb-6">Platform Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="bg-amber-400 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl text-black">📚</span>
              </div>
              <h3 className="font-semibold mb-2">Practice Problems</h3>
              <p className="text-gray-300 text-sm">Access a wide variety of aptitude problems across different topics and difficulty levels.</p>
            </div>
            
            <div className="text-center">
              <div className="bg-amber-400 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl text-black">🎯</span>
              </div>
              <h3 className="font-semibold mb-2">Track Progress</h3>
              <p className="text-gray-300 text-sm">Monitor your performance and track your improvement over time.</p>
            </div>
            
            <div className="text-center">
              <div className="bg-amber-400 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl text-black">🏆</span>
              </div>
              <h3 className="font-semibold mb-2">Achievement System</h3>
              <p className="text-gray-300 text-sm">Earn badges and achievements as you solve problems and improve your skills.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
