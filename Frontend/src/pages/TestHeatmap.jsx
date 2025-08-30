import React, { useState } from "react";
import ActivityHeatmap from "../components/ActivityHeatmap";
import { Link } from "react-router-dom";

const TestHeatmap = () => {
  const [submissions, setSubmissions] = useState([]);

  // Generate test data
  React.useEffect(() => {
    const generateTestSubmissions = () => {
      const submissions = [];
      const today = new Date();
      
      for (let i = 0; i < 365; i++) {
        const date = new Date(today);
        date.setDate(date.getDate() - i);
        
        // Random submission count (0-5) with some days having more activity
        let count = 0;
        if (Math.random() > 0.7) {
          count = Math.floor(Math.random() * 5) + 1;
        }
        
        submissions.push({
          date: date.toISOString().split('T')[0],
          count: count
        });
      }
      
      return submissions.reverse();
    };

    setSubmissions(generateTestSubmissions());
  }, []);

  const mockUser = {
    streak: 15,
    maxStreak: 45
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-4">
      <div className="container mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-center">Dashboard Test Page</h1>
        
        <div className="max-w-6xl mx-auto space-y-8">
          {/* Navigation Links */}
          <div className="bg-gray-800 rounded-lg p-6">
            <h2 className="text-2xl font-bold mb-4">Navigation Test</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <Link
                to="/problems"
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors text-center"
              >
                View Problems
              </Link>
              <Link
                to="/user/submit"
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors text-center"
              >
                Submit Solution
              </Link>
              <Link
                to="/practice"
                className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition-colors text-center"
              >
                Practice
              </Link>
              <Link
                to="/topics"
                className="bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-lg transition-colors text-center"
              >
                Topics
              </Link>
            </div>
          </div>

          {/* Heatmap Test */}
          <div className="bg-gray-800 rounded-lg p-6">
            <h2 className="text-2xl font-bold mb-4">Heatmap Test</h2>
            <ActivityHeatmap 
              submissions={submissions} 
              user={mockUser}
              className="mb-4"
            />
            
            <div className="bg-gray-700 rounded-lg p-4">
              <h3 className="text-lg font-semibold mb-2">Test Instructions</h3>
              <ul className="space-y-2 text-sm text-gray-300">
                <li>• The heatmap now properly represents a calendar year</li>
                <li>• Each column represents a week</li>
                <li>• Each row represents a day of the week</li>
                <li>• Day labels (Sun, Mon, Tue, etc.) are shown on the left</li>
                <li>• Month labels are shown at the top</li>
                <li>• Hover over cells to see submission details</li>
                <li>• The layout is responsive and works on mobile</li>
                <li>• Scroll horizontally on small screens to see the full year</li>
              </ul>
            </div>
          </div>

          {/* Responsiveness Test */}
          <div className="bg-gray-800 rounded-lg p-6">
            <h2 className="text-2xl font-bold mb-4">Responsiveness Test</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="bg-gray-700 p-4 rounded-lg">
                <h3 className="font-semibold mb-2">Mobile View</h3>
                <p className="text-sm text-gray-300">Resize your browser to test mobile responsiveness</p>
              </div>
              <div className="bg-gray-700 p-4 rounded-lg">
                <h3 className="font-semibold mb-2">Tablet View</h3>
                <p className="text-sm text-gray-300">Test medium screen sizes</p>
              </div>
              <div className="bg-gray-700 p-4 rounded-lg">
                <h3 className="font-semibold mb-2">Desktop View</h3>
                <p className="text-sm text-gray-300">Full desktop experience</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestHeatmap;
