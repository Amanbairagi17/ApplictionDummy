import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import API from "../../api/api";

const ProblemDetails = () => {
  const { id } = useParams();
  const [problem, setProblem] = useState(null);

  useEffect(() => {
    fetch(API.GET_PROBLEM_BY_ID(id))
      .then(res => res.json())
      .then(data => setProblem(data))
      .catch(err => console.error(err));
  }, [id]);

  if (!problem) return <p className="text-center mt-10">Loading...</p>;

  return (
    <div className="p-6 max-w-2xl mx-auto bg-gray-800 text-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-4">{problem.title}</h2>
      <p>{problem.description}</p>
    </div>
  );
};

export default ProblemDetails;
