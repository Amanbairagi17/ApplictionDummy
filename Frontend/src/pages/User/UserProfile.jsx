import React, { useEffect, useState } from "react";
import API from "../../api/api";

const UserProfile = ({ userId }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    fetch(API.USER_PROFILE_BY_ID(userId))
      .then(res => res.json())
      .then(data => setUser(data))
      .catch(err => console.error(err));
  }, [userId]);

  if (!user) return <p className="text-center mt-10">Loading...</p>;

  return (
    <div className="p-6 max-w-lg mx-auto bg-gray-800 text-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-4">User Profile</h2>
      <p><strong>Name:</strong> {user.name}</p>
      <p><strong>Email:</strong> {user.email}</p>
    </div>
  );
};

export default UserProfile;
