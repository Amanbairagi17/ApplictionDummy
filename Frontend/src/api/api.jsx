const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8080";

const API = {
  // User
  REGISTER_USER: `${BASE_URL}/auth/register-user`,
  REGISTER_ADMIN: `${BASE_URL}/auth/register-admin`,
  LOGIN_USER: `${BASE_URL}/auth/login`,
  UPDATE_USER: `${BASE_URL}/user/update`,
  GET_USER_BY_ID: (id) => `${BASE_URL}/get-user-id/${id}`,
  DELETE_USER: `${BASE_URL}/user/delete`,
  USER_SUBMIT: `${BASE_URL}/user/submit`,
  USER_PROFILE_BY_ID: (id) => `${BASE_URL}/profile/${id}`,
  
  // New endpoints for heatmap and user data
  GET_USER_HEATMAP: (id) => `${BASE_URL}/user/${id}/heatmap`,
  GET_USER_STATS: (id) => `${BASE_URL}/user/${id}/stats`,
  GET_USER_SUBMISSIONS: (id, days = 30) => `${BASE_URL}/user/${id}/submissions?days=${days}`,
  
  // Test endpoints (fallback)
  TEST_USER_HEATMAP: (id) => `${BASE_URL}/test/user/${id}/heatmap`,
  TEST_USER_STATS: (id) => `${BASE_URL}/test/user/${id}/stats`,
  TEST_GET_USER_BY_ID: (id) => `${BASE_URL}/test/get-user-id/${id}`,

  // Admin
  ADMIN_UPDATE: `${BASE_URL}/user/update`,
  ADMIN_DELETE: `${BASE_URL}/user/delete`,
  GET_ADMIN_BY_ID: (id) => `${BASE_URL}/user/${id}`,

  // Problems
  CREATE_PROBLEM: `${BASE_URL}/problems/admin/create`,
  GET_ALL_PROBLEMS: `${BASE_URL}/problems/get-problems`,
  UPDATE_PROBLEM: `${BASE_URL}/problems/admin/update`,
  DELETE_PROBLEM_BY_ID: (id) => `${BASE_URL}/problems/admin/delete/${id}`,
  GET_PROBLEM_BY_ID: (id) => `${BASE_URL}/problems/get/${id}`,
  SEARCH_PROBLEM: `${BASE_URL}/problems/search`,

  // Topics
  CREATE_TOPIC: `${BASE_URL}/topics/admin/create`,
  GET_TOPIC_BY_ID: (id) => `${BASE_URL}/topics/get/${id}`,
  GET_ALL_TOPICS: `${BASE_URL}/topics/get-all`,
  GET_ALL_TOPICS_ALL: `${BASE_URL}/topics/all`,
  UPDATE_TOPIC: `${BASE_URL}/topics/admin/update`,
  DELETE_TOPIC_BY_ID: (id) => `${BASE_URL}/topics/admin/delete/${id}`,

  // Root
  HOME: `${BASE_URL}/home`,
  PROFILE_BY_ID: (id) => `${BASE_URL}/profile/${id}`,
  PROFILE_BY_EMAIL: (email) => `${BASE_URL}/get-user/${email}`,
  GET_USER_ID: (id) => `${BASE_URL}/get-user-id/${id}`,
};

// Utility function for making API calls with better error handling
export const apiCall = async (url, options = {}) => {
  try {
    const stored = localStorage.getItem('authToken');
    const authHeader = stored ? { Authorization: `Bearer ${stored}` } : {};
    
    const config = {
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
        ...authHeader,
        ...options.headers,
      },
      credentials: 'include',
      ...options,
    };

    console.log(`Making API call to: ${url}`, config);

    const response = await fetch(url, config);

    console.log(`API Response status: ${response.status}`, response);

    if (!response.ok) {
      if ((response.status === 401 || response.status === 403) && !options.__retry) {
        // try refresh once
        try {
          const refreshRes = await fetch(`${BASE_URL}/auth/refresh`, { 
            method: 'POST', 
            credentials: 'include' 
          });
          if (refreshRes.ok) {
            const data = await refreshRes.json().catch(() => ({}));
            if (data?.token) {
              localStorage.setItem('authToken', data.token);
              return await apiCall(url, { ...options, __retry: true });
            }
          }
        } catch (e) {
          console.error('Token refresh failed:', e);
        }
        // refresh failed
        localStorage.removeItem('authToken');
        localStorage.removeItem('userData');
        if (typeof window !== 'undefined' && !url.includes('/auth/')) {
          window.location.href = '/signin';
        }
      }
      
      let errorMessage;
      try {
        const errorData = await response.json();
        errorMessage = errorData.message || errorData.error || `HTTP error! status: ${response.status}`;
      } catch (e) {
        errorMessage = `HTTP error! status: ${response.status}`;
      }
      
      throw new Error(errorMessage);
    }

    const data = await response.json();
    console.log('API Response data:', data);
    return data;
  } catch (error) {
    console.error("API call failed:", error);
    throw error;
  }
};

export default API;
