import axios from "axios";

// Base URL for your backend
const API_URL = "http://localhost:5000/api/attendance"; // replace with your backend URL

// Fetch attendance by student ID
export const getAttendance = async (studentId, token) => {
  const response = await axios.get(`${API_URL}/${studentId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

// Fetch attendance percentage
export const getAttendancePercentage = async (studentId, token) => {
  const response = await axios.get(`${API_URL}/${studentId}/percentage`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};
