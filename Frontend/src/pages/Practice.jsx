import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

const Practice = () => {
  const { category } = useParams();
  const navigate = useNavigate();
  const [selected, setSelected] = useState({});
  const [score, setScore] = useState(null);
  const [questions, setQuestions] = useState([]);

  // Sample questions for different categories
  const categoryQuestions = {
    quantitative: [
      {
        id: 1,
        question: "Solve: 15 × 12 = ?",
        options: ["160", "180", "170", "190"],
        answer: "180",
      },
      {
        id: 2,
        question: "What is 25% of 80?",
        options: ["15", "20", "25", "30"],
        answer: "20",
      },
      {
        id: 3,
        question: "If x + 5 = 12, what is x?",
        options: ["5", "6", "7", "8"],
        answer: "7",
      },
      {
        id: 4,
        question: "What is the square root of 144?",
        options: ["10", "11", "12", "13"],
        answer: "12",
      },
    ],
    logical: [
      {
        id: 1,
        question: "Find the next number: 2, 4, 8, 16, ?",
        options: ["24", "32", "30", "28"],
        answer: "32",
      },
      {
        id: 2,
        question: "If all roses are flowers and some flowers are red, then:",
        options: ["All roses are red", "Some roses are red", "No roses are red", "Cannot determine"],
        answer: "Cannot determine",
      },
      {
        id: 3,
        question: "Complete the sequence: A, C, E, G, ?",
        options: ["H", "I", "J", "K"],
        answer: "I",
      },
      {
        id: 4,
        question: "If 3 workers can complete a task in 6 days, how many days will 2 workers take?",
        options: ["8 days", "9 days", "10 days", "12 days"],
        answer: "9 days",
      },
    ],
    verbal: [
      {
        id: 1,
        question: "Choose the correct meaning of 'Ubiquitous':",
        options: ["Very small", "Present everywhere", "Very large", "Rare"],
        answer: "Present everywhere",
      },
      {
        id: 2,
        question: "Select the synonym for 'Eloquent':",
        options: ["Quiet", "Articulate", "Shy", "Rude"],
        answer: "Articulate",
      },
      {
        id: 3,
        question: "Choose the correct word: The weather is _____ today.",
        options: ["good", "well", "better", "best"],
        answer: "good",
      },
      {
        id: 4,
        question: "What is the opposite of 'Benevolent'?",
        options: ["Kind", "Generous", "Malevolent", "Charitable"],
        answer: "Malevolent",
      },
    ],
  };

  useEffect(() => {
    // Validate category and set questions
    if (category && categoryQuestions[category]) {
      setQuestions(categoryQuestions[category]);
    } else {
      // Invalid category, redirect to practice selection
      navigate("/practice");
    }
  }, [category, navigate]);

  const handleOptionClick = (qid, option) => {
    setSelected({ ...selected, [qid]: option });
  };

  const handleSubmit = () => {
    let s = 0;
    questions.forEach((q) => {
      if (selected[q.id] === q.answer) s++;
    });
    setScore(s);
  };

  const handleReset = () => {
    setSelected({});
    setScore(null);
  };

  const getCategoryTitle = () => {
    const titles = {
      quantitative: "Quantitative Aptitude",
      logical: "Logical Reasoning",
      verbal: "Verbal Ability",
    };
    return titles[category] || "Practice";
  };

  const getCategoryDescription = () => {
    const descriptions = {
      quantitative: "Test your mathematical skills and numerical reasoning",
      logical: "Challenge your analytical thinking and problem-solving abilities",
      verbal: "Improve your language skills and comprehension",
    };
    return descriptions[category] || "";
  };

  if (!category || !categoryQuestions[category]) {
    return (
      <div className="p-6 text-white min-h-screen bg-[#1a1a1a]">
        <h1 className="text-3xl font-bold mb-6 text-amber-400 text-center">
          Practice Categories
        </h1>
        <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
          {Object.keys(categoryQuestions).map((cat) => (
            <div
              key={cat}
              onClick={() => navigate(`/practice/${cat}`)}
              className="p-6 bg-[#282828] rounded-xl shadow-md border border-[#343541] cursor-pointer hover:bg-[#333] transition-colors"
            >
              <h2 className="text-2xl font-bold mb-3 text-amber-400 capitalize">
                {cat === "quantitative" ? "Quantitative" : cat === "logical" ? "Logical" : "Verbal"}
              </h2>
              <p className="text-gray-300 mb-4">
                {getCategoryDescription(cat)}
              </p>
              <button className="w-full bg-amber-400 hover:bg-amber-500 text-black font-semibold px-4 py-2 rounded-lg">
                Start Practice
              </button>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 text-white min-h-screen bg-[#1a1a1a]">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-3 text-amber-400">
            {getCategoryTitle()}
          </h1>
          <p className="text-gray-300 mb-4">{getCategoryDescription()}</p>
          <div className="flex justify-center gap-4">
            <button
              onClick={() => navigate("/practice")}
              className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg"
            >
              ← Back to Categories
            </button>
            <button
              onClick={handleReset}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
            >
              Reset
            </button>
          </div>
        </div>

        <div className="space-y-6">
          {questions.map((q) => (
            <div
              key={q.id}
              className="p-6 bg-[#282828] rounded-xl shadow-md border border-[#343541]"
            >
              <p className="text-lg font-semibold mb-4">Question {q.id}: {q.question}</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {q.options.map((option) => (
                  <button
                    key={option}
                    onClick={() => handleOptionClick(q.id, option)}
                    className={`px-4 py-3 rounded-lg border transition-colors ${
                      selected[q.id] === option
                        ? "bg-amber-500 text-black font-bold border-amber-500"
                        : "bg-[#1a1a1a] text-white hover:bg-[#333] border-[#555]"
                    }`}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="flex justify-center mt-8">
          <button
            onClick={handleSubmit}
            disabled={Object.keys(selected).length < questions.length}
            className={`px-8 py-3 rounded-lg font-semibold transition-colors ${
              Object.keys(selected).length < questions.length
                ? "bg-gray-500 cursor-not-allowed"
                : "bg-amber-400 hover:bg-amber-500 text-black"
            }`}
          >
            Submit Answers
          </button>
        </div>

        {score !== null && (
          <div className="mt-8 text-center">
            <div className="bg-[#282828] p-6 rounded-xl border border-[#343541]">
              <h2 className="text-2xl font-bold text-green-400 mb-2">
                ✅ Practice Complete!
              </h2>
              <p className="text-xl text-white mb-4">
                Your Score: <span className="text-amber-400 font-bold">{score}</span> / <span className="text-amber-400 font-bold">{questions.length}</span>
              </p>
              <p className="text-gray-300 mb-4">
                Percentage: <span className="text-amber-400 font-bold">{Math.round((score / questions.length) * 100)}%</span>
              </p>
              <button
                onClick={handleReset}
                className="bg-amber-400 hover:bg-amber-500 text-black font-semibold px-6 py-2 rounded-lg"
              >
                Try Again
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Practice;
