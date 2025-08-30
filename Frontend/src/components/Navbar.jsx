import { ChevronDownIcon } from "@heroicons/react/20/solid";
import { Link } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import StreakDisplay from "./StreakDisplay";

const Navbar = () => {
  const [showPracticeDropdown, setShowPracticeDropdown] = useState(false);
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const { user, isAuthenticated, logout, isAdmin } = useAuth();

  const handleLogout = () => {
    logout();
    setShowUserDropdown(false);
    window.location.href = '/';
  };

  return (
    <div className="sticky top-0 z-20 shadow-md">
      <nav className="flex justify-between items-center w-full bg-[#1e1e1e] h-14 px-6 md:px-12 border-b border-[#343541]">
        
        {/* Left Side (Logo + Navigation) */}
        <div className="flex items-center gap-6">
          {/* Logo */}
          <Link to="/" className="text-amber-400 font-extrabold text-2xl tracking-wide hover:text-amber-500 transition">
            Grabtitude
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center gap-6">
            <Link to="/problems" className="text-white hover:text-amber-400 transition font-medium">
              Problems
            </Link>
            
            {/* Practice Dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowPracticeDropdown(!showPracticeDropdown)}
                className="flex items-center gap-1 text-white hover:text-amber-400 transition font-medium"
              >
                <span>Practice</span>
                <ChevronDownIcon className="w-5 h-5" />
              </button>
              
              {showPracticeDropdown && (
                <div className="absolute top-full left-0 mt-2 w-48 bg-[#2c2c2c] border border-[#444] rounded-lg shadow-lg py-2 z-50">
                  <Link
                    to="/practice"
                    onClick={() => setShowPracticeDropdown(false)}
                    className="block px-4 py-2 text-white hover:bg-[#3c3c3c] transition"
                  >
                    All Categories
                  </Link>
                  <Link
                    to="/practice/quantitative"
                    onClick={() => setShowPracticeDropdown(false)}
                    className="block px-4 py-2 text-white hover:bg-[#3c3c3c] transition"
                  >
                    Quantitative
                  </Link>
                  <Link
                    to="/practice/logical"
                    onClick={() => setShowPracticeDropdown(false)}
                    className="block px-4 py-2 text-white hover:bg-[#3c3c3c] transition"
                  >
                    Logical
                  </Link>
                  <Link
                    to="/practice/verbal"
                    onClick={() => setShowPracticeDropdown(false)}
                    className="block px-4 py-2 text-white hover:bg-[#3c3c3c] transition"
                  >
                    Verbal
                  </Link>
                </div>
              )}
            </div>
            
            <Link to="/topics" className="text-white hover:text-amber-400 transition font-medium">
              Topics
            </Link>

            {/* Admin Link - Only visible to admins */}
            {isAdmin() && (
              <Link to="/admin/dashboard" className="text-red-400 hover:text-red-300 transition font-medium">
                Admin Panel
              </Link>
            )}
          </div>
        </div>

        {/* Center Search Bar */}
        <div className="hidden md:flex items-center w-96 bg-[#2c2c2c] rounded-xl border border-[#444] px-3 py-1.5 text-white">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-5 h-5 opacity-60"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 
                 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
            />
          </svg>

          <input
            className="ml-2 w-full bg-transparent border-none focus:outline-none placeholder-gray-400 text-sm"
            type="text"
            placeholder="Search aptitude questions..."
          />
        </div>

        {/* Right Side (Authentication + Streak) */}
        <div className="flex items-center gap-5 text-sm">
          {isAuthenticated ? (
            <>
              {/* Streak Display */}
              <div className="hidden lg:block">
                <StreakDisplay userId={user?.userId} />
              </div>
              
              {/* User Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setShowUserDropdown(!showUserDropdown)}
                  className="flex items-center gap-2 text-white hover:text-amber-400 transition font-medium"
                >
                  <div className="w-8 h-8 bg-amber-400 rounded-full flex items-center justify-center text-black font-bold">
                    {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                  </div>
                  <span className="hidden md:block">{user?.name || 'User'}</span>
                  <ChevronDownIcon className="w-4 h-4" />
                </button>
                
                {showUserDropdown && (
                  <div className="absolute top-full right-0 mt-2 w-48 bg-[#2c2c2c] border border-[#444] rounded-lg shadow-lg py-2 z-50">
                    <Link
                      to={`/user/profile/${user?.userId}`}
                      onClick={() => setShowUserDropdown(false)}
                      className="block px-4 py-2 text-white hover:bg-[#3c3c3c] transition"
                    >
                      My Profile
                    </Link>
                    <Link
                      to="/user/submit"
                      onClick={() => setShowUserDropdown(false)}
                      className="block px-4 py-2 text-white hover:bg-[#3c3c3c] transition"
                    >
                      Submit Solution
                    </Link>
                    {isAdmin() && (
                      <Link
                        to="/admin/dashboard"
                        onClick={() => setShowUserDropdown(false)}
                        className="block px-4 py-2 text-red-400 hover:bg-[#3c3c3c] transition"
                      >
                        Admin Dashboard
                      </Link>
                    )}
                    <hr className="border-[#444] my-1" />
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 text-white hover:bg-[#3c3c3c] transition"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <>
              <Link
                to="/signin"
                className="text-white hover:text-amber-400 font-medium transition"
              >
                Login
              </Link>

              <Link
                to="/signup"
                className="bg-amber-400 text-black font-semibold px-4 py-1.5 rounded-md hover:bg-amber-500 transition shadow-md"
              >
                Sign Up
              </Link>
            </>
          )}
        </div>
      </nav>
      
      {/* Click outside to close dropdowns */}
      {(showPracticeDropdown || showUserDropdown) && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => {
            setShowPracticeDropdown(false);
            setShowUserDropdown(false);
          }}
        />
      )}
    </div>
  );
};

export default Navbar;
