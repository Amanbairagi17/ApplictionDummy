const BASE_URL = "http://localhost:8080";

const API = {
  // User
  REGISTER_USER: `${BASE_URL}/auth/register-user`,
  UPDATE_USER: `${BASE_URL}/user/update`,
  GET_USER_BY_ID: (id) => `${BASE_URL}/user/${id}`,
  DELETE_USER: `${BASE_URL}/user/delete`,
  USER_SUBMIT: `${BASE_URL}/user/submit`,
  USER_PROFILE_BY_ID: (id) => `${BASE_URL}/user/profile/${id}`,

  // Admin
  REGISTER_ADMIN: `${BASE_URL}/auth/register-admin`,
  ADMIN_UPDATE: `${BASE_URL}/user/update`,
  ADMIN_DELETE: `${BASE_URL}/user/delete`,
  GET_ADMIN_BY_ID: (id) => `${BASE_URL}/user/${id}`,

  // Problems
  CREATE_PROBLEM: `${BASE_URL}/admin/problem/create`,
  GET_ALL_PROBLEMS: `${BASE_URL}/problems/get-problems`,
  UPDATE_PROBLEM: `${BASE_URL}/admin/problem/update`,
  DELETE_PROBLEM_BY_ID: (id) => `${BASE_URL}/admin/problem/delete/${id}`,
  GET_PROBLEM_BY_ID: (id) => `${BASE_URL}/problems/get/${id}`,
  SEARCH_PROBLEM: `${BASE_URL}/problems/search`,

  // Topics
  CREATE_TOPIC: `${BASE_URL}/admin/topic/create`,
  GET_TOPIC_BY_ID: (id) => `${BASE_URL}/admin/topic/get/${id}`,
  GET_ALL_TOPICS: `${BASE_URL}/admin/topic/get-all`,
  UPDATE_TOPIC: `${BASE_URL}/admin/topic/update`,
  DELETE_TOPIC_BY_ID: (id) => `${BASE_URL}/admin/topic/delete/${id}`,

  // Root
  HOME: `${BASE_URL}/home`,
  PROFILE_BY_ID: (id) => `${BASE_URL}/profile/${id}`,
  PROFILE_BY_EMAIL: (email) => `${BASE_URL}/profile/${email}`,
  GET_USER_ID: (id) => `${BASE_URL}/${id}`,
};

export default API;
