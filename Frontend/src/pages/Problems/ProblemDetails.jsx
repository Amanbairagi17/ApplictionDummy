import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import API, { apiCall } from "../../api/api";

const ProblemDetails = () => {
  const { id } = useParams();
  const [problem, setProblem] = useState(null);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await apiCall(API.GET_PROBLEM_BY_ID(id));
        setProblem(data);
      } catch (e) {
        console.error(e);
      }
    };
    load();
  }, [id]);

  const [selectedOptionId, setSelectedOptionId] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitMsg, setSubmitMsg] = useState("");

  const handleSubmit = async () => {
    if (!selectedOptionId) return;
    try {
      setSubmitting(true);
      setSubmitMsg("");
      await apiCall(API.USER_SUBMIT, {
        method: "POST",
        body: JSON.stringify({ problemId: Number(id), optionId: Number(selectedOptionId) })
      });
      setSubmitMsg("Submitted!");
    } catch (e) {
      setSubmitMsg(e.message || "Submission failed");
    } finally {
      setSubmitting(false);
    }
  };

  if (!problem) return <p className="text-center mt-10">Loading...</p>;

  return (
    <div className="p-6 max-w-2xl mx-auto bg-gray-800 text-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-2">{problem.title}</h2>
      <div className="mb-1 text-sm text-gray-300">Difficulty: {problem.difficulty}</div>
      {problem.category && (
        <div className="mb-4 text-sm text-gray-300">Category: {problem.category}</div>
      )}
      <p className="mb-6">{problem.description}</p>

      {Array.isArray(problem.options) && problem.options.length > 0 && (
        <div className="space-y-3 mb-4">
          {problem.options.map((opt) => (
            <label key={opt.id || opt.optionId || opt.content} className="flex items-center gap-3 bg-gray-700 p-3 rounded">
              <input
                type="radio"
                name="selectedOption"
                className="w-4 h-4"
                checked={String(selectedOptionId) === String(opt.optionId || opt.id)}
                onChange={() => setSelectedOptionId(opt.optionId || opt.id)}
              />
              <span>{opt.content}</span>
            </label>
          ))}
        </div>
      )}

      <button
        onClick={handleSubmit}
        disabled={submitting || !selectedOptionId}
        className={`px-6 py-2 rounded ${submitting || !selectedOptionId ? "bg-gray-600" : "bg-amber-500 hover:bg-amber-600"}`}
      >
        {submitting ? "Submitting..." : "Submit"}
      </button>
      {submitMsg && <div className="mt-3 text-sm">{submitMsg}</div>}
    </div>
  );
};

export default ProblemDetails;
