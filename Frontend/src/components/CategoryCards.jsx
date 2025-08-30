import React from "react";
import Card from "./Card";
import {
  CalculatorIcon,
  PuzzlePieceIcon,
  ChatBubbleLeftRightIcon,
  ChartBarIcon,
  CpuChipIcon,
} from "@heroicons/react/24/outline";

// You can change this to your actual logo path if you want it on the cards
const appLogo = null; // e.g. "/logo.svg"

const CATEGORIES = [
  {
    title: "Quantitative Aptitude",
    topics: ["Arithmetic", "Algebra", "Geometry", "Numbers", "Time–Work"],
    icon: <CalculatorIcon className="w-6 h-6 text-amber-400" />,
    to: "/practice/quantitative",
  },
  {
    title: "Logical Reasoning",
    topics: ["Arrangements", "Syllogisms", "Blood Relations", "Directions"],
    icon: <PuzzlePieceIcon className="w-6 h-6 text-amber-400" />,
    to: "/practice/logical",
  },
  {
    title: "Verbal Ability",
    topics: ["RC", "Grammar", "Vocabulary", "Para Jumbles"],
    icon: <ChatBubbleLeftRightIcon className="w-6 h-6 text-amber-400" />,
    to: "/practice/verbal",
  },

  
];

const CategoryCards = () => {
  return (
    <section className="px-4 md:px-8 lg:px-12 py-8">
      <div className=" gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 flex justify-between">
        {CATEGORIES.map((cat) => (
          <Card
            key={cat.title}
            title={cat.title}
            topics={cat.topics}
            icon={cat.icon}
            to={cat.to}
            logoSrc={appLogo}
          />
        ))}
      </div>
    </section>
  );
};

export default CategoryCards;
