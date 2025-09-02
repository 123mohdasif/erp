import jwt from "jsonwebtoken";
import axios from "axios";
import dotenv from "dotenv";
dotenv.config();

// 🔹 Use an existing student ID from your students table
const studentId = 3; 
const jwtSecret = process.env.JWT_SECRET || "your_jwt_secret";

// Generate JWT
const token = jwt.sign({ id: studentId, role: "student" }, jwtSecret, { expiresIn: "1h" });

console.log("Generated JWT token:", token);

// Sample complaint
const complaintData = {
  title: "WiFi not working",
  description: "The campus WiFi is down since yesterday"
};

// POST complaint
(async () => {
  try {
    const response = await axios.post("http://localhost:5000/api/complaints", complaintData, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    console.log("Response from server:", response.data);
  } catch (err) {
    if (err.response) {
      console.error("Error response:", err.response.data);
    } else {
      console.error(err.message);
    }
  }
})();
