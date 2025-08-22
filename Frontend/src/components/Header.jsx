import React from 'react';
import "@fontsource/inter";

const Header = () => {
  return (
    <>
      {/* Hero Section */}
      <div className="text-white font-inter min-h-[80vh] flex flex-col items-center justify-center px-6 bg-gradient-to-b from-gray-900 via-gray-800 to-black">
        
        {/* Title */}
        <h1 className="text-5xl md:text-7xl font-extrabold mb-6 text-center leading-tight">
          Master Your{" "}
          <span className="bg-gradient-to-r from-amber-400 to-yellow-500 bg-clip-text text-transparent">
            Aptitude
          </span>
        </h1>

        {/* Subtitle */}
        <p className="text-lg md:text-xl text-gray-300 text-center max-w-2xl mb-4">
          Practice Quantitative, Logical Reasoning, Verbal Ability, and Data Interpretation questions.
        </p>
        <p className="text-lg md:text-xl text-gray-400 text-center max-w-2xl mb-10">
          Track your progress, challenge yourself, and sharpen problem-solving skills.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col md:flex-row gap-4 w-3 md:w-auto">
          <button className="bg-amber-400 hover:bg-amber-500 transition-colors text-black font-semibold py-3 px-8 rounded-xl shadow-lg">
            🚀 Start Practicing
          </button>
          
        </div>
      </div>

      {/* Category Section */}
      <div className="mt-16 text-white font-inter flex flex-col items-center justify-center px-4">
        <h2 className="text-3xl md:text-4xl font-bold mb-4 text-center">
          Choose Your Category
        </h2>
        <p className="text-lg text-gray-400 text-center max-w-xl">
          Select a category below and start practicing aptitude questions right away.
        </p>
      </div>
    </>
  );
};

export default Header;
