import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API from "../../api/api";

const ProblemsList = () => {
  const [problems, setProblems] = useState([]);

  useEffect(() => {
    fetch(API.GET_ALL_PROBLEMS)
      .then(res => res.json())
      .then(data => setProblems(data))
      .catch(err => console.error(err));
  }, []);

  return (
    <div className="p-6 text-white">
      <h2 className="text-2xl font-bold mb-4">Problems</h2>
      {problems.length === 0 ? <p>No problems found.</p> : (
        <ul className="space-y-2">
          {problems.map((p) => (
            <li key={p.id} className="bg-gray-700 p-3 rounded-md">
              <Link to={`/problems/${p.id}`} className="text-amber-400 hover:underline">{p.title}</Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ProblemsList;
