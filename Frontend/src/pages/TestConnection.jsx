import React, { useState, useEffect } from 'react';
import API, { apiCall } from '../api/api';
import { useAuth } from '../context/AuthContext';

const TestConnection = () => {
  const [tests, setTests] = useState({
    backend: { status: 'pending', message: '' },
    auth: { status: 'pending', message: '' },
    problems: { status: 'pending', message: '' },
    topics: { status: 'pending', message: '' }
  });
  const [loading, setLoading] = useState(false);
  const { isAuthenticated, user } = useAuth();

  const updateTest = (testName, status, message) => {
    setTests(prev => ({
      ...prev,
      [testName]: { status, message }
    }));
  };

  const testBackendConnection = async () => {
    try {
      const response = await apiCall(`${API.HOME.replace('/home', '')}/auth/test`);
      updateTest('backend', 'success', `✅ ${response}`);
    } catch (error) {
      updateTest('backend', 'error', `❌ ${error.message}`);
    }
  };

  const testAuthentication = async () => {
    if (!isAuthenticated) {
      updateTest('auth', 'warning', '⚠️ Not authenticated - please sign in');
      return;
    }
    
    try {
      const response = await apiCall(`${API.HOME.replace('/home', '')}/auth/health`);
      updateTest('auth', 'success', `✅ Auth working: ${response}`);
    } catch (error) {
      updateTest('auth', 'error', `❌ Auth failed: ${error.message}`);
    }
  };

  const testProblems = async () => {
    try {
      const response = await apiCall(API.GET_ALL_PROBLEMS);
      const problemCount = Array.isArray(response) ? response.length : (response.content ? response.content.length : 0);
      updateTest('problems', 'success', `✅ Loaded ${problemCount} problems`);
    } catch (error) {
      updateTest('problems', 'error', `❌ Problems failed: ${error.message}`);
    }
  };

  const testTopics = async () => {
    try {
      const response = await apiCall(API.GET_ALL_TOPICS_ALL);
      const topicCount = Array.isArray(response) ? response.length : 0;
      updateTest('topics', 'success', `✅ Loaded ${topicCount} topics`);
    } catch (error) {
      updateTest('topics', 'error', `❌ Topics failed: ${error.message}`);
    }
  };

  const runAllTests = async () => {
    setLoading(true);
    
    // Reset all tests
    setTests({
      backend: { status: 'pending', message: 'Testing...' },
      auth: { status: 'pending', message: 'Testing...' },
      problems: { status: 'pending', message: 'Testing...' },
      topics: { status: 'pending', message: 'Testing...' }
    });

    // Run tests sequentially
    await testBackendConnection();
    await testAuthentication();
    await testProblems();
    await testTopics();
    
    setLoading(false);
  };

  useEffect(() => {
    runAllTests();
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case 'success': return 'bg-green-600';
      case 'error': return 'bg-red-600';
      case 'warning': return 'bg-yellow-600';
      default: return 'bg-gray-600';
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-center">Frontend-Backend Connection Test</h1>
        
        {/* User Info */}
        <div className="bg-gray-800 p-6 rounded-lg mb-8">
          <h2 className="text-xl font-semibold mb-4">Authentication Status</h2>
          {isAuthenticated ? (
            <div className="text-green-400">
              ✅ Authenticated as: {user?.name} ({user?.email}) - Role: {user?.role}
            </div>
          ) : (
            <div className="text-yellow-400">
              ⚠️ Not authenticated - <a href="/signin" className="text-blue-400 underline">Sign in</a>
            </div>
          )}
        </div>

        {/* Test Results */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {Object.entries(tests).map(([testName, test]) => (
            <div key={testName} className="bg-gray-800 p-6 rounded-lg">
              <h3 className="text-lg font-semibold mb-3 capitalize">{testName} Test</h3>
              <div className={`p-3 rounded ${getStatusColor(test.status)}`}>
                {test.message || 'Waiting...'}
              </div>
            </div>
          ))}
        </div>

        {/* Actions */}
        <div className="text-center space-y-4">
          <button
            onClick={runAllTests}
            disabled={loading}
            className={`px-6 py-3 rounded-lg font-semibold ${
              loading 
                ? 'bg-gray-600 cursor-not-allowed' 
                : 'bg-amber-400 text-black hover:bg-amber-500'
            }`}
          >
            {loading ? 'Running Tests...' : 'Run All Tests'}
          </button>
          
          <div className="flex justify-center gap-4">
            <a
              href="/problems"
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition"
            >
              View Problems
            </a>
            <a
              href="/topics"
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition"
            >
              View Topics
            </a>
            {isAuthenticated && user?.role === 'ADMIN' && (
              <a
                href="/admin/dashboard"
                className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition"
              >
                Admin Panel
              </a>
            )}
          </div>
        </div>

        {/* API Endpoints Info */}
        <div className="mt-8 bg-gray-800 p-6 rounded-lg">
          <h2 className="text-xl font-semibold mb-4">API Configuration</h2>
          <div className="space-y-2 text-sm">
            <p><strong>Backend URL:</strong> {API.HOME.replace('/home', '')}</p>
            <p><strong>Frontend URL:</strong> {window.location.origin}</p>
            <p><strong>Auth Token:</strong> {localStorage.getItem('authToken') ? '✅ Present' : '❌ Missing'}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestConnection;
