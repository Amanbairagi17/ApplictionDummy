import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import API, { apiCall } from "../../api/api";
import UserStats from "../../components/UserStats";
import ActivityHeatmap from "../../components/ActivityHeatmap";
import ProblemProgress from "../../components/ProblemProgress";

const UserProfile = () => {
  const { id } = useParams();
  const [user, setUser] = useState(null);
  const [submissions, setSubmissions] = useState([]);
  const [userStats, setUserStats] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true);
        
        try {
          // Try main endpoints first
          const heatmapData = await apiCall(API.GET_USER_HEATMAP(id));
          setSubmissions(heatmapData);
          
          const stats = await apiCall(API.GET_USER_STATS(id));
          setUserStats(stats);
          
          const userProfile = await apiCall(API.GET_USER_BY_ID(id));
          setUser(userProfile);
        } catch (mainError) {
          console.log("Main endpoints failed, trying test endpoints:", mainError.message);
          
          // Fallback to test endpoints
          const heatmapData = await apiCall(API.TEST_USER_HEATMAP(id));
          setSubmissions(heatmapData);
          
          const stats = await apiCall(API.TEST_USER_STATS(id));
          setUserStats(stats);
          
          const userProfile = await apiCall(API.TEST_GET_USER_BY_ID(id));
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

    if (id) {
      fetchUserData();
    }
  }, [id]);

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
            <p className="mt-4 text-gray-400">Loading profile...</p>
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
              <p className="font-semibold">Error loading profile</p>
              <p className="text-sm mt-2">{error}</p>
              <p className="text-xs mt-2">Using fallback data for demonstration</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-900 text-white p-4 sm:p-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center py-20">
            <div className="text-xl">User not found</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-4 sm:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Profile Header */}
        <div className="bg-gray-800 rounded-lg p-6 mb-6">
          <div className="flex flex-col lg:flex-row items-center lg:items-start space-y-4 lg:space-y-0 lg:space-x-8">
            {/* Avatar Section */}
            <div className="flex flex-col items-center">
              <div className="w-24 h-24 lg:w-32 lg:h-32 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full flex items-center justify-center text-2xl lg:text-4xl font-bold text-black mb-4">
                {user.name.charAt(0).toUpperCase()}
              </div>
              <div className="text-center">
                <h1 className="text-xl lg:text-3xl font-bold text-white break-words">{user.name}</h1>
                <p className="text-gray-400 text-sm lg:text-base break-words">{user.email}</p>
                {user.role === 'ADMIN' && (
                  <span className="inline-block bg-red-600 text-white px-3 py-1 rounded-full text-xs lg:text-sm font-semibold mt-2">
                    Admin
                  </span>
                )}
              </div>
            </div>

            {/* Quick Stats */}
            <div className="flex-1 grid grid-cols-2 md:grid-cols-4 gap-4">
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
                value={user.maxStreak || 0}
                icon="🏆"
                color="purple"
              />
            </div>
          </div>
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

        {/* User Details */}
        <div className="mt-6 bg-gray-800 rounded-lg p-6">
          <h2 className="text-2xl font-bold mb-6">Profile Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {user.institute && (
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Institute</label>
                <p className="text-white text-sm lg:text-base break-words">{user.institute}</p>
              </div>
            )}
            {user.country && (
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Country</label>
                <p className="text-white text-sm lg:text-base break-words">{user.country}</p>
              </div>
            )}
            {user.linkedIn && (
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">LinkedIn</label>
                <a 
                  href={user.linkedIn} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-amber-400 hover:text-amber-300 underline text-sm lg:text-base break-words"
                >
                  View Profile
                </a>
              </div>
            )}
            {user.github && (
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">GitHub</label>
                <a 
                  href={user.github} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-amber-400 hover:text-amber-300 underline text-sm lg:text-base break-words"
                >
                  View Profile
                </a>
              </div>
            )}
          </div>
          
          {user.about && (
            <div className="mt-6">
              <label className="block text-sm font-medium text-gray-400 mb-2">About</label>
              <p className="text-white text-sm lg:text-base break-words">{user.about}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
