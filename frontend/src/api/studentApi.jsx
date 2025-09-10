import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api/students", // mera backend ka url
});

export const loginStudent = (data) => API.post("/login", data);
export const registerStudent = (data) => API.post("/register", data);

// Profile API
export const getProfile = (token) =>
  API.get("/profile/get", { headers: { Authorization: `Bearer ${token}` } });

export const upsertProfile = (token, data) =>
  API.post("/profile/upsert", data, { headers: { Authorization: `Bearer ${token}` } });
