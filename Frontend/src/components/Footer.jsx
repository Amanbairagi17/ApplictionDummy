import React from "react";

const Footer = () => {
  return (
    <>
      <footer class="bg-[#1e1e1e] border-t border-white text-gray-300 px-10 py-10">
        <div class="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h1 class="text-amber-400 hover:text-amber-500 cursor-pointer font-bold text-xl mb-2">
              Grabitute
            </h1>
            <p class="text-sm mb-4">
              Master your aptitude skills with comprehensive practice questions
              across quantitative, logical, verbal, and data interpretation
              categories.
            </p>
            <div class="flex space-x-4 text-gray-400">
              <a href="#">
                <i class="fa-brands fa-github text-xl"></i>
              </a>
              <a href="#">
                <i class="fa-brands fa-twitter text-xl"></i>
              </a>
              <a href="#">
                <i class="fa-brands fa-linkedin text-xl"></i>
              </a>
              <a href="#">
                <i class="fa-solid fa-envelope text-xl"></i>
              </a>
            </div>
          </div>

          <div>
            <h2 class="font-bold text-white mb-3">Categories</h2>
            <ul class="space-y-1 text-sm gap-1 flex flex-col">
              <li>Quantitative</li>
              <li>Logical Reasoning</li>
              <li>Verbal Ability</li>
              <li>Data Interpretation</li>
            </ul>
          </div>

          <div>
            <h2 class="font-bold text-white mb-3">Resources</h2>
            <ul class="space-y-1 text-sm gap-1 flex flex-col">
              <li>Study Guide</li>
              <li>Practice Tests</li>
              <li>Progress Analytics</li>
              <li>Discussion Forum</li>
            </ul>
          </div>

          <div>
            <h2 class="font-bold text-white mb-3">Support</h2>
            <ul class="cursor-pointer space-y-1 text-sm gap-1 flex flex-col">
              <li>Help Center</li>
              <li>Contact Us</li>
              <li>Privacy Policy</li>
              <li>Terms of Service</li>
            </ul>
          </div>
        </div>

        <div class="mt-10 border-t border-gray-600"></div>
      </footer>

      <div className="text-center text-gray-500 text-sm py-4">
        © {new Date().getFullYear()}{" "}
        <span className="font-semibold text-white">Gravtitude</span>. All rights
        reserved.
      </div>
    </>
  );
};

export default Footer;
