import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API, { apiCall } from "../../api/api";

const CreateTopic = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    description: ""
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (id) {
      setIsEditing(true);
      fetchTopic();
    }
  }, [id]);

  const fetchTopic = async () => {
    try {
      const topic = await apiCall(API.GET_TOPIC_BY_ID(id));
      setFormData({
        name: topic.name || "",
        description: topic.description || ""
      });
    } catch (error) {
      setError("Failed to fetch topic: " + error.message);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      setError("Topic name is required");
      return;
    }

    try {
      setLoading(true);
      setError("");
      
      if (isEditing) {
        await apiCall(API.UPDATE_TOPIC, {
          method: "PUT",
          body: JSON.stringify({
            id: parseInt(id),
            ...formData
          }),
        });
        setSuccess("Topic updated successfully!");
      } else {
        await apiCall(API.CREATE_TOPIC, {
          method: "POST",
          body: JSON.stringify(formData),
        });
        setSuccess("Topic created successfully!");
      }
      
      setTimeout(() => {
        navigate("/admin/dashboard");
      }, 1500);

    } catch (error) {
      setError(`Failed to ${isEditing ? 'update' : 'create'} topic: ` + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-center mb-8">
          {isEditing ? "Edit Topic" : "Create New Topic"}
        </h1>
        
        {error && (
          <div className="mb-6 p-4 bg-red-600 text-white rounded-lg">
            {error}
          </div>
        )}
        
        {success && (
          <div className="mb-6 p-4 bg-green-600 text-white rounded-lg">
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit} className="max-w-2xl mx-auto">
          <div className="bg-gray-800 p-6 rounded-lg mb-6">
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">Topic Name *</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                className="w-full px-4 py-2 rounded-md bg-gray-700 border border-gray-600 text-white focus:outline-none focus:border-amber-400"
                placeholder="Enter topic name"
                required
              />
            </div>
            
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">Description</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                className="w-full px-4 py-2 rounded-md bg-gray-700 border border-gray-600 text-white focus:outline-none focus:border-amber-400"
                rows="4"
                placeholder="Enter topic description (optional)"
              />
            </div>
          </div>

          <div className="flex justify-center space-x-4">
            <button
              type="submit"
              disabled={loading}
              className={`px-8 py-3 rounded-lg font-semibold transition-colors ${
                loading
                  ? "bg-gray-500 cursor-not-allowed"
                  : "bg-green-600 hover:bg-green-700"
              }`}
            >
              {loading ? (isEditing ? "Updating..." : "Creating...") : (isEditing ? "Update Topic" : "Create Topic")}
            </button>
            
            <button
              type="button"
              onClick={() => navigate("/admin/dashboard")}
              className="px-8 py-3 bg-gray-700 hover:bg-gray-600 rounded-lg font-semibold transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateTopic;
