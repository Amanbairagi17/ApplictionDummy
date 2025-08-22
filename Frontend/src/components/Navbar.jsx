import { ChevronDownIcon } from "@heroicons/react/20/solid";
import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <div className="sticky top-0 z-20 shadow-md">
      <nav className="flex justify-between items-center w-full bg-[#1e1e1e] h-14 px-6 md:px-12 border-b border-[#343541]">
        
        {/* Left Side (Logo + Category) */}
        <div className="flex items-center gap-6">
          {/* Logo */}
          <Link to="/" className="text-amber-400 font-extrabold text-2xl tracking-wide hover:text-amber-500 transition">
            Gravtitude
          </Link>

          {/* Category Dropdown */}
          <div className="flex items-center gap-1 cursor-pointer hover:text-amber-400 transition">
            <span className="text-white font-medium">Categories</span>
            <ChevronDownIcon className="w-5 h-5 text-white" />
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

        {/* Right Side (Buttons) */}
        <div className="flex items-center gap-5 text-sm">
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
        </div>
      </nav>
    </div>
  );
};

export default Navbar;
