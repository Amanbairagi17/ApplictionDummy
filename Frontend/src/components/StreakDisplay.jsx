import React, { useState, useEffect } from "react";
import API, { apiCall } from "../api/api";

const StreakDisplay = ({ userId }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (userId) {
      fetchUserStreak();
    }
  }, [userId]);

  const fetchUserStreak = async () => {
    try {
      const userData = await apiCall(API.USER_PROFILE_BY_ID(userId));
      setUser(userData);
    } catch (error) {
      console.error("Failed to fetch user streak:", error);
    } finally {
      setLoading(false);
    }
  };

  const getStreakEmoji = (streak) => {
    if (streak >= 100) return '🔥🔥🔥';
    if (streak >= 50) return '🔥🔥';
    if (streak >= 10) return '🔥';
    if (streak >= 5) return '⚡';
    if (streak >= 1) return '✨';
    return '💤';
  };

  const getStreakColor = (streak) => {
    if (streak >= 100) return 'from-red-500 to-orange-500';
    if (streak >= 50) return 'from-orange-500 to-yellow-500';
    if (streak >= 10) return 'from-yellow-500 to-green-500';
    if (streak >= 5) return 'from-green-500 to-blue-500';
    if (streak >= 1) return 'from-blue-500 to-purple-500';
    return 'from-gray-500 to-gray-600';
  };

  if (loading || !user) {
    return null;
  }

  return (
    <div className="flex items-center space-x-3">
      {/* Streak Display */}
      <div className={`bg-gradient-to-r ${getStreakColor(user.streak)} rounded-lg px-3 py-2 text-white shadow-lg`}>
        <div className="flex items-center space-x-2">
          <span className="text-lg">{getStreakEmoji(user.streak)}</span>
          <div className="text-center">
            <div className="text-sm font-semibold">{user.streak}</div>
            <div className="text-xs opacity-90">days</div>
          </div>
        </div>
      </div>

      {/* Max Streak Badge */}
      {user.maxStreak > 0 && (
        <div className="bg-gradient-to-r from-purple-500 to-blue-600 rounded-lg px-3 py-2 text-white shadow-lg">
          <div className="flex items-center space-x-2">
            <span className="text-lg">🏆</span>
            <div className="text-center">
              <div className="text-sm font-semibold">{user.maxStreak}</div>
              <div className="text-xs opacity-90">best</div>
            </div>
          </div>
        </div>
      )}

      {/* Streak Status */}
      <div className="text-sm text-gray-300">
        {user.streak === 0 && (
          <span>Start your streak today! 🚀</span>
        )}
        {user.streak === 1 && (
          <span>Great start! Keep it up! ✨</span>
        )}
        {user.streak >= 2 && user.streak < 5 && (
          <span>Building momentum! ⚡</span>
        )}
        {user.streak >= 5 && user.streak < 10 && (
          <span>Consistent! You're on fire! 🔥</span>
        )}
        {user.streak >= 10 && user.streak < 50 && (
          <span>Incredible dedication! 🔥🔥</span>
        )}
        {user.streak >= 50 && user.streak < 100 && (
          <span>Legendary! Unstoppable! 🔥🔥🔥</span>
        )}
        {user.streak >= 100 && (
          <span>GOD MODE! 🔥🔥🔥🔥🔥</span>
        )}
      </div>
    </div>
  );
};

export default StreakDisplay;
