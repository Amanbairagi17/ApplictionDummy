import React from "react";
import CalendarHeatmap from 'react-calendar-heatmap';
import 'react-calendar-heatmap/dist/styles.css';

const ActivityHeatmap = ({ submissions, user, className = "" }) => {
  if (!submissions || submissions.length === 0) {
    return (
      <div className={`bg-gray-800 rounded-lg p-6 ${className}`}>
        <h2 className="text-2xl font-bold mb-6">Activity Heatmap</h2>
        <div className="text-center text-gray-400">
          No activity data available
        </div>
      </div>
    );
  }

  // Generate today - 365 days ago
  const today = new Date();
  const startDate = new Date(today);
  startDate.setDate(startDate.getDate() - 364);

  // Transform submissions to the format expected by react-calendar-heatmap
  const heatmapData = submissions.map(submission => ({
    date: submission.date,
    count: submission.count
  }));

  return (
    <div className={`bg-gray-800 rounded-lg p-6 ${className}`}>
      <h2 className="text-2xl font-bold mb-6">Activity Heatmap</h2>
      
      <CalendarHeatmap
        startDate={startDate}
        endDate={today}
        values={heatmapData}
        classForValue={(value) => {
          if (!value) return 'color-empty';
          if (value.count >= 5) return 'color-github-4';
          if (value.count >= 3) return 'color-github-3';
          if (value.count >= 1) return 'color-github-2';
          return 'color-github-1';
        }}
        tooltipDataAttrs={(value) => {
          return {
            'data-tip': value.date
              ? `${value.date}: ${value.count} submissions`
              : 'No submissions',
          };
        }}
        showWeekdayLabels={true}
        weekdayLabels={['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']}
        gutterSize={2}
        square={true}
      />

      {/* Legend with GitHub-style colors */}
      <div className="flex items-center justify-center mt-4 space-x-2">
        <span className="text-xs text-gray-400">Less</span>
        <div className="flex space-x-1">
          <div className="w-3 h-3 color-empty rounded-sm"></div>
          <div className="w-3 h-3 color-github-1 rounded-sm"></div>
          <div className="w-3 h-3 color-github-2 rounded-sm"></div>
          <div className="w-3 h-3 color-github-3 rounded-sm"></div>
          <div className="w-3 h-3 color-github-4 rounded-sm"></div>
        </div>
        <span className="text-xs text-gray-400">More</span>
      </div>

      {/* Stats */}
      <div className="flex flex-col sm:flex-row justify-center mt-4 space-y-2 sm:space-y-0 sm:space-x-8 text-sm text-gray-400">
        <span>
          Total active days: {submissions.filter((s) => s.count > 0).length}
        </span>
        {user && (
          <>
            <span>Max streak: {user.maxStreak}</span>
            <span>Current streak: {user.streak}</span>
          </>
        )}
      </div>
    </div>
  );
};

export default ActivityHeatmap;
