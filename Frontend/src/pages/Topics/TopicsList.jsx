import React, { useEffect, useState } from "react";
import API from "../../api/api";

const TopicsList = () => {
  const [topics, setTopics] = useState([]);

  useEffect(() => {
    fetch(API.GET_ALL_TOPICS)
      .then(res => res.json())
      .then(data => setTopics(data))
      .catch(err => console.error(err));
  }, []);

  return (
    <div className="p-6 text-white">
      <h2 className="text-2xl font-bold mb-4">Topics</h2>
      {topics.length === 0 ? <p>No topics available.</p> : (
        <ul className="space-y-2">
          {topics.map((t) => (
            <li key={t.id} className="bg-gray-700 p-3 rounded-md">{t.name}</li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default TopicsList;
