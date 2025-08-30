import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import API, { apiCall } from "../../api/api";

const UserSubmit = () => {
  const [problemId, setProblemId] = useState("");
  const [optionId, setOptionId] = useState("");
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const [problems, setProblems] = useState([]);
  const [selectedProblem, setSelectedProblem] = useState(null);

  useEffect(() => {
    fetchProblems();
  }, []);

  const fetchProblems = async () => {
    try {
      const problemsData = await apiCall(API.GET_ALL_PROBLEMS);
      setProblems(problemsData);
    } catch (error) {
      console.error("Failed to fetch problems:", error);
    }
  };

  const handleProblemSelect = (problem) => {
    setSelectedProblem(problem);
    setProblemId(problem.id);
    setOptionId("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!problemId || !optionId) {
      setMsg("Please select both problem and option");
      return;
    }
    
    try {
      setLoading(true);
      setMsg("");
      await apiCall(API.USER_SUBMIT, {
        method: "POST",
        body: JSON.stringify({ problemId: Number(problemId), optionId: Number(optionId) })
      });
      setMsg("Submitted successfully! 🎉");
      setOptionId("");
    } catch (e) {
      setMsg(e.message || "Submission failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-4 sm:p-6">
      <div className="max-w-4xl mx-auto">
        <div className="bg-gray-800 rounded-lg p-6 mb-6">
          <h2 className="text-2xl font-bold mb-4 break-words">Submit Problem Solution</h2>
          <p className="text-gray-300 mb-6">
            Select a problem and submit your answer. You can also view problems directly from the problems page.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <Link
              to="/problems"
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors text-center"
            >
              View All Problems
            </Link>
            <Link
              to="/practice"
              className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg transition-colors text-center"
            >
              Practice Problems
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Problem Selection */}
          <div className="bg-gray-800 rounded-lg p-6">
            <h3 className="text-xl font-bold mb-4">Select Problem</h3>
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {problems.map((problem) => (
                <div
                  key={problem.id}
                  onClick={() => handleProblemSelect(problem)}
                  className={`p-3 rounded-lg cursor-pointer transition-colors ${
                    selectedProblem?.id === problem.id
                      ? 'bg-blue-600 border-2 border-blue-400'
                      : 'bg-gray-700 hover:bg-gray-600'
                  }`}
                >
                  <div className="font-medium">{problem.title}</div>
                  <div className="text-sm text-gray-300">
                    Difficulty: <span className={`${
                      problem.difficulty === 'EASY' ? 'text-green-400' :
                      problem.difficulty === 'MEDIUM' ? 'text-yellow-400' :
                      'text-red-400'
                    }`}>{problem.difficulty}</span>
                  </div>
                  {problem.category && (
                    <div className="text-sm text-gray-400">Category: {problem.category}</div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Submission Form */}
          <div className="bg-gray-800 rounded-lg p-6">
            <h3 className="text-xl font-bold mb-4">Submit Answer</h3>
            
            {selectedProblem ? (
              <div className="mb-4 p-4 bg-gray-700 rounded-lg">
                <h4 className="font-medium mb-2">Selected Problem:</h4>
                <p className="text-sm text-gray-300 mb-2">{selectedProblem.title}</p>
                <p className="text-sm text-gray-400">{selectedProblem.description}</p>
              </div>
            ) : (
              <div className="mb-4 p-4 bg-gray-700 rounded-lg text-center text-gray-400">
                Please select a problem from the left
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Problem ID
                </label>
                <input
                  type="number"
                  placeholder="Problem ID"
                  value={problemId}
                  onChange={(e) => setProblemId(e.target.value)}
                  className="w-full px-4 py-2 rounded bg-gray-700 border border-gray-600 text-white"
                  required
                  disabled={!!selectedProblem}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Option ID
                </label>
                <input
                  type="number"
                  placeholder="Option ID"
                  value={optionId}
                  onChange={(e) => setOptionId(e.target.value)}
                  className="w-full px-4 py-2 rounded bg-gray-700 border border-gray-600 text-white"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={loading || !problemId || !optionId}
                className={`w-full px-6 py-2 rounded-lg transition-colors ${
                  loading || !problemId || !optionId
                    ? "bg-gray-600 cursor-not-allowed"
                    : "bg-amber-500 hover:bg-amber-600"
                }`}
              >
                {loading ? "Submitting..." : "Submit Answer"}
              </button>
            </form>

            {msg && (
              <div className={`mt-4 p-3 rounded-lg text-sm ${
                msg.includes("successfully") 
                  ? "bg-green-600 text-green-100" 
                  : "bg-red-600 text-red-100"
              }`}>
                {msg}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserSubmit;
