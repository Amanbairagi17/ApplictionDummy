import React, { useState } from "react";

const questions = [
  {
    id: 1,
    question: "What is the capital of France?",
    options: ["Berlin", "Madrid", "Paris", "Lisbon"],
    answer: "Paris",
  },
  {
    id: 2,
    question: "Solve: 12 × 8 = ?",
    options: ["80", "96", "108", "86"],
    answer: "96",
  },
  {
    id: 3,
    question: "Which data structure uses FIFO principle?",
    options: ["Stack", "Queue", "Tree", "Graph"],
    answer: "Queue",
  },
];

const Practice = () => {
  const [selected, setSelected] = useState({});
  const [score, setScore] = useState(null);

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

  return (
    <div className="p-6 text-white min-h-screen bg-[#1a1a1a]">
      <h1 className="text-3xl font-bold mb-6 text-amber-400 text-center">
        Practice Questions
      </h1>

      <div className="space-y-6 max-w-3xl mx-auto">
        {questions.map((q) => (
          <div
            key={q.id}
            className="p-4 bg-[#282828] rounded-xl shadow-md border border-[#343541]"
          >
            <p className="text-lg font-semibold mb-3">{q.question}</p>
            <div className="grid grid-cols-2 gap-3">
              {q.options.map((option) => (
                <button
                  key={option}
                  onClick={() => handleOptionClick(q.id, option)}
                  className={`px-4 py-2 rounded-lg border ${
                    selected[q.id] === option
                      ? "bg-amber-500 text-black font-bold"
                      : "bg-[#1a1a1a] text-white hover:bg-[#333]"
                  }`}
                >
                  {option}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="flex justify-center mt-6">
        <button
          onClick={handleSubmit}
          className="bg-amber-400 hover:bg-amber-500 text-black font-semibold px-6 py-3 rounded-lg"
        >
          Submit
        </button>
      </div>

      {score !== null && (
        <p className="mt-4 text-center text-xl font-bold text-green-400">
          ✅ Your Score: {score} / {questions.length}
        </p>
      )}
    </div>
  );
};

export default Practice;
