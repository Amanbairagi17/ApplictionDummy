import React from "react";

const UserStats = ({ user, problemStats, className = "" }) => {
  const getStreakEmoji = (streak) => {
    if (streak >= 100) return '🔥🔥🔥';
    if (streak >= 50) return '🔥🔥';
    if (streak >= 10) return '🔥';
    if (streak >= 5) return '⚡';
    if (streak >= 1) return '✨';
    return '💤';
  };

  if (!user) return null;

  return (
    <div className={`bg-gray-800 rounded-lg p-6 ${className}`}>
      <h2 className="text-xl font-bold mb-4">User Statistics</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* Streak Card */}
        <div className="bg-gradient-to-br from-orange-500 to-red-600 rounded-lg p-4 text-center">
          <div className="text-2xl mb-1">{getStreakEmoji(user.streak)}</div>
          <div className="text-lg font-bold">{user.streak}</div>
          <div className="text-xs text-orange-100">Current Streak</div>
        </div>

        {/* Max Streak Card */}
        <div className="bg-gradient-to-br from-purple-500 to-blue-600 rounded-lg p-4 text-center">
          <div className="text-2xl mb-1">🏆</div>
          <div className="text-lg font-bold">{user.maxStreak}</div>
          <div className="text-xs text-purple-100">Best Streak</div>
        </div>

        {/* Problems Solved Card */}
        <div className="bg-gradient-to-br from-green-500 to-teal-600 rounded-lg p-4 text-center">
          <div className="text-2xl mb-1">✅</div>
          <div className="text-lg font-bold">{problemStats?.solved || 0}</div>
          <div className="text-xs text-green-100">Problems Solved</div>
        </div>

        {/* Last Activity Card */}
        <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg p-4 text-center">
          <div className="text-2xl mb-1">📅</div>
          <div className="text-lg font-bold">
            {user.lastSubmittedAt ? new Date(user.lastSubmittedAt).toLocaleDateString() : 'Never'}
          </div>
          <div className="text-xs text-indigo-100">Last Activity</div>
        </div>
      </div>
    </div>
  );
};

export default UserStats;
