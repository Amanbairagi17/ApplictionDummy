import React from 'react';
import "@fontsource/inter";

const Header = () => {
  return (
    <>
    <div className= 'text-white font-inter min-h-120 flex flex-col items-center justify-center px-4'>
      <h1 className="text-6xl md:text-7xl font-bold mb-6 text-center">
        Master Your
      </h1>

      <p className="text-lg font-semibold md:text-xl text-center max-w-3xl mb-2">
        Practice quantitative, logical, verbal, and data interpretation questions.
      </p>
      <p className="text-lg md:text-xl font-semibold text-center max-w-3xl mb-8">
        Track your progress and improve your problem-solving skills.
      </p>

      <div className="flex flex-col md:flex-row gap-4">
        <button className="bg-amber-400 hover:bg-amber-500 text-black font-semibold py-3 px-6 rounded-md shadow-md">
          Start Practicing
        </button>
        <input 
          type="text"
          placeholder="Enter something..."
          className="hover:bg-white hover:text-black px-4 py-3 rounded-md  outline-none"
        />
      </div>
    </div>

    <div className= 'mt-5 text-white font-inter flex flex-col items-center justify-center'>
         <h1 className="text-3xl md:text-4xl font-bold mb-2 text-center">
        Choose Your Category
      </h1>
       <p className="text-lg text-center max-w-xl mb-2">
          select a category to start Practicing questions
      </p>
    </div>

      </>
  );
};

export default Header;
