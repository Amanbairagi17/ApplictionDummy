import React from "react";
import { ChevronDownIcon } from "@heroicons/react/20/solid";
const Navbar = () => {
  return (
    <div>
      <nav className=" flex  w-full bg-[#282828] h-12 border border-[#343541]">
        <nav className="flex w-xs justify-center items-center mr-25 ml-6">
          <nav className=" text-yellow-500 px-4">
            <span className=" font-bold text-2xl">Gravtitude</span>
          </nav>
          <nav className="flex items-center gap-1 cursor-pointer">
            <span className="text-white p-3">Catagrey</span>
            <ChevronDownIcon className="w-5 h-5 text-white" />
          </nav>
        </nav>

        <nav className=" w-2xw md:flex items-center justify-center mr-25 ">
          <span className="bg-[#1a1a1a] gap-1 rounded-xl border-2 text-white h-10 w-100 items-center md:flex pl-3.5">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="size-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
              />
            </svg>

            <input
              className="mr-5 ml-2 w-95 border-0 focus:outline-none  h-6 "
              type="text"
              placeholder="Search quations..."
            />
          </span>
        </nav>

        <nav className="cursor-pointer w-full md:flex items-center gap-5 pl-11 text-white">
          <span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="white"
              className="size-5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 5.25h.008v.008H12v-.008Z"
              />
            </svg>
          </span>
          <span className="h-8 w-14 md:flex justify-center items-center cursor-pointer">
            <button>Login</button>
          </span >

          <span className="cursor-pointer rounded md:flex justify-center items-center h-8 w-15 bg-yellow-500">Sign up</span>

          <span className="cursor-pointer">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="size-5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21.752 15.002A9.72 9.72 0 0 1 18 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 0 0 3 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 0 0 9.002-5.998Z"
              />
            </svg>
          </span>
        </nav>
      </nav>
    </div>
  );
};

export default Navbar;
