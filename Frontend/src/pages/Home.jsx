import React, { useEffect, useState } from "react";
import API from "../api/api";

const Home = () => {
  const [content, setContent] = useState("");

  useEffect(() => {
    fetch(API.HOME)
      .then(res => res.text())
      .then(data => setContent(data))
      .catch(err => console.error(err));
  }, []);

  return (
    <div className="p-6 text-center text-xl">
      <h1 className="text-3xl font-bold mb-4">Welcome to the App</h1>
      <p>{content}</p>
    </div>
  );
};

export default Home;
