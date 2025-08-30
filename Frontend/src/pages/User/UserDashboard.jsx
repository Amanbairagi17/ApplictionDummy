import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import UserStats from "../../components/UserStats";
import ActivityHeatmap from "../../components/ActivityHeatmap";
import ProblemProgress from "../../components/ProblemProgress";
import API, { apiCall } from "../../api/api";

const UserDashboard = () => {
  const [user, setUser] = useState(null);
  const [submissions, setSubmissions] = useState([]);
  const [userStats, setUserStats] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true);
        
        // Get current user ID from localStorage or context
        const userId = localStorage.getItem('userId') || 1; // Fallback for testing
        
        try {
          // Try main endpoints first
          const heatmapData = await apiCall(API.GET_USER_HEATMAP(userId));
          setSubmissions(heatmapData);
          
          const stats = await apiCall(API.GET_USER_STATS(userId));
          setUserStats(stats);
          
          const userProfile = await apiCall(API.GET_USER_BY_ID(userId));
          setUser(userProfile);
        } catch (mainError) {
          console.log("Main endpoints failed, trying test endpoints:", mainError.message);
          
          // Fallback to test endpoints
          const heatmapData = await apiCall(API.TEST_USER_HEATMAP(userId));
          setSubmissions(heatmapData);
          
          const stats = await apiCall(API.TEST_USER_STATS(userId));
          setUserStats(stats);
          
          const userProfile = await apiCall(API.TEST_GET_USER_BY_ID(userId));
          setUser(userProfile);
        }
        
      } catch (err) {
        console.error("Error fetching user data:", err);
        setError(err.message);
        
        // Final fallback to mock data if all APIs fail
        setSubmissions(generateMockSubmissions());
        setUserStats({
          totalSubmissions: 45,
          activeDays: 23,
          currentStreak: 5,
          maxStreak: 12
        });
        setUser({
          name: "John Doe",
          email: "john@example.com",
          streak: 5,
          maxStreak: 12
        });
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  // Mock data generation function (fallback)
  const generateMockSubmissions = () => {
    const mockData = [];
    const today = new Date();
    
    for (let i = 364; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      
      // Random submission count (0-5) with some days having no submissions
      const count = Math.random() > 0.3 ? Math.floor(Math.random() * 6) : 0;
      
      mockData.push({
        date: dateStr,
        count: count
      });
    }
    
    return mockData;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 text-white p-4 sm:p-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-500 mx-auto"></div>
            <p className="mt-4 text-gray-400">Loading dashboard...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-900 text-white p-4 sm:p-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center py-20">
            <div className="bg-red-600 text-red-100 p-4 rounded-lg max-w-md mx-auto">
              <p className="font-semibold">Error loading dashboard</p>
              <p className="text-sm mt-2">{error}</p>
              <p className="text-xs mt-2">Using fallback data for demonstration</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-4 sm:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-gray-800 rounded-lg p-6 mb-6">
          <h1 className="text-3xl font-bold mb-2 break-words">Welcome back, {user?.name || 'User'}!</h1>
          <p className="text-gray-300 mb-4">
            Track your progress and stay motivated with your coding journey.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link to="/problems" className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors text-center">
              Practice Problems
            </Link>
            <Link to="/user/submit" className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg transition-colors text-center">
              Submit Solution
            </Link>
            <Link to="/topics" className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-lg transition-colors text-center">
              Explore Topics
            </Link>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          <UserStats
            title="Total Submissions"
            value={userStats.totalSubmissions || 0}
            icon="📊"
            color="blue"
          />
          <UserStats
            title="Active Days"
            value={userStats.activeDays || 0}
            icon="📅"
            color="green"
          />
          <UserStats
            title="Current Streak"
            value={userStats.currentStreak || 0}
            icon="🔥"
            color="amber"
          />
          <UserStats
            title="Max Streak"
            value={user?.maxStreak || 0}
            icon="🏆"
            color="purple"
          />
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Problem Solving Progress */}
          <div className="bg-gray-800 rounded-lg p-6">
            <h2 className="text-2xl font-bold mb-6 break-words">Problem Solving Progress</h2>
            <ProblemProgress />
          </div>

          {/* Activity Heatmap */}
          <div className="bg-gray-800 rounded-lg p-6">
            <h2 className="text-2xl font-bold mb-6 break-words">Activity Heatmap</h2>
            <ActivityHeatmap 
              submissions={submissions} 
              user={user}
              className=""
            />
          </div>
        </div>

        {/* Recent Activity */}
        <div className="mt-6 bg-gray-800 rounded-lg p-6">
          <h2 className="text-2xl font-bold mb-6">Recent Activity</h2>
          <div className="space-y-4">
            {submissions.slice(-5).reverse().map((submission, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-gray-700 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span className="text-gray-300">
                    {submission.count > 0 ? `${submission.count} submission${submission.count > 1 ? 's' : ''}` : 'No submissions'} on {submission.date}
                  </span>
                </div>
                <span className="text-sm text-gray-400">
                  {new Date(submission.date).toLocaleDateString()}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;
