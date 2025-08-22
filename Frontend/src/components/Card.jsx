import React from "react";
import { Link } from "react-router-dom";

/**
 * Reusable Card
 * props:
 * - title: string
 * - topics: string[] (3–6 short items)
 * - icon: React component (e.g., <CalculatorIcon/>)
 * - to: string (route to go when Practice clicked)
 * - logoSrc?: string (optional small logo on the top-right)
 */
const Card = ({ title, topics = [], icon, to = "#", logoSrc }) => {
  return (
    <div className="bg-[#282828] border border-[#343541] rounded-2xl p-5 md:p-6 w-full max-w-sm shadow-md hover:shadow-lg transition-shadow">
      <div className="flex items-start justify-between">
        {/* Icon bubble */}
        <div className="h-12 w-12 rounded-xl bg-[#1a1a1a] border border-[#343541] flex items-center justify-center shrink-0">
          {icon}
        </div>

        {/* Optional small logo */}
        {logoSrc ? (
          <img
            src={logoSrc}
            alt="logo"
            className="h-8 w-8 object-contain opacity-90"
          />
        ) : null}
      </div>

      <h3 className="text-white text-xl font-semibold mt-4">{title}</h3>

      {/* Topics as small chips */}
      <div className="mt-3 flex flex-wrap gap-2">
        {topics.map((t) => (
          <span
            key={t}
            className="text-sm text-white/90 bg-[#1a1a1a] border border-[#343541] px-2.5 py-1 rounded-lg"
          >
            {t}
          </span>
        ))}
      </div>

      <div className="mt-5">
        <Link
          to={to}
          className="inline-flex items-center justify-center px-4 py-2 rounded-lg bg-amber-400 hover:bg-amber-500 text-black font-semibold"
        >
          Practice
        </Link>
      </div>
    </div>
  );
};

export default Card;
