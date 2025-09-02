import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import path from "path";

// Load env from project root
dotenv.config({ path: path.resolve("../.env") });  // adjust path if needed

const studentId = 1; // must exist in students table

const token = jwt.sign(
  { id: studentId, role: "student" },
  process.env.JWT_SECRET,
  { expiresIn: "1h" }
);

console.log("JWT token for student:", token);
