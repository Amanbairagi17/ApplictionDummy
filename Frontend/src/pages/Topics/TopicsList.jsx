import React, { useEffect, useState } from "react";
import API, { apiCall } from "../../api/api";

const TopicsList = () => {
  const [topics, setTopics] = useState([]);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await apiCall(API.GET_ALL_TOPICS_ALL);
        setTopics(data);
      } catch (e) {
        console.error(e);
      }
    };
    load();
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
