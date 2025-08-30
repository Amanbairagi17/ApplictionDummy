import React from "react";

const ProblemProgress = ({ problemStats, className = "" }) => {
  if (!problemStats) return null;

  return (
    <div className={`bg-gray-800 rounded-lg p-6 ${className}`}>
      <h2 className="text-2xl font-bold mb-6">Problem Solving Progress</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Progress Overview */}
        <div className="space-y-6">
          <div className="text-center">
            <div className="relative inline-block">
              <svg className="w-32 h-32 transform -rotate-90">
                <circle
                  cx="64"
                  cy="64"
                  r="56"
                  stroke="currentColor"
                  strokeWidth="8"
                  fill="transparent"
                  className="text-gray-700"
                />
                <circle
                  cx="64"
                  cy="64"
                  r="56"
                  stroke="currentColor"
                  strokeWidth="8"
                  fill="transparent"
                  strokeDasharray={`${(problemStats.solved / problemStats.total) * 352} 352`}
                  className="text-green-500 transition-all duration-1000 ease-out"
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-500">{problemStats.solved}</div>
                  <div className="text-sm text-gray-400">Solved</div>
                </div>
              </div>
            </div>
            <div className="mt-4 text-lg text-gray-300">
              {problemStats.solved} / {problemStats.total} Problems
            </div>
          </div>
        </div>

        {/* Difficulty Breakdown */}
        <div className="space-y-4">
          <h3 className="text-xl font-semibold mb-4">Difficulty Breakdown</h3>
          
          {/* Easy Problems */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-green-400 font-medium">Easy</span>
              <span className="text-gray-300">{problemStats.easy} / {Math.floor(problemStats.total * 0.4)}</span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-2">
              <div 
                className="bg-green-500 h-2 rounded-full transition-all duration-500"
                style={{ width: `${(problemStats.easy / (problemStats.total * 0.4)) * 100}%` }}
              ></div>
            </div>
          </div>

          {/* Medium Problems */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-yellow-400 font-medium">Medium</span>
              <span className="text-gray-300">{problemStats.medium} / {Math.floor(problemStats.total * 0.4)}</span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-2">
              <div 
                className="bg-yellow-500 h-2 rounded-full transition-all duration-500"
                style={{ width: `${(problemStats.medium / (problemStats.total * 0.4)) * 100}%` }}
              ></div>
            </div>
          </div>

          {/* Hard Problems */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-red-400 font-medium">Hard</span>
              <span className="text-gray-300">{problemStats.hard} / {Math.floor(problemStats.total * 0.2)}</span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-2">
              <div 
                className="bg-red-500 h-2 rounded-full transition-all duration-500"
                style={{ width: `${(problemStats.hard / (problemStats.total * 0.2)) * 100}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProblemProgress;
