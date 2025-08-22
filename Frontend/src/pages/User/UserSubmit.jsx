import React, { useEffect, useState } from "react";
import API from "../../api/api";

const UserSubmit = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    fetch(API.USER_SUBMIT)
      .then(res => res.json())
      .then(data => setData(data))
      .catch(err => console.error(err));
  }, []);

  return (
    <div className="p-6 text-white">
      <h2 className="text-2xl font-bold mb-4">User Submissions</h2>
      {data.length === 0 ? (
        <p>No submissions found.</p>
      ) : (
        <ul className="space-y-2">
          {data.map((item, i) => (
            <li key={i} className="bg-gray-700 p-3 rounded-md">{item}</li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default UserSubmit;
