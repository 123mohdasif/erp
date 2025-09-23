import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { createTeacher, findTeacherByEmail, getTeacherById, getAllTeachers, updateTeacherProfile } from '../model/teacherModel.js';

// Teacher registration (no changes)
export const registerTeacher = async (req, res) => { /* ... */ };

// Teacher login
export const loginTeacher = async (req, res) => {
  // --- FINAL DEBUGGING LOGS ---
  console.log("\n--- INCOMING TEACHER LOGIN REQUEST ---");
  console.log("Request Timestamp:", new Date().toISOString());

  try {
    // 1. Log the entire request body to check for parsing issues.
    console.log("1. Received request body:", req.body);
    const { email, password } = req.body;

    // 2. Check if email and password were correctly extracted.
    if (!email || !password) {
      console.error("ERROR: Email or password was not found in the request body.");
      return res.status(400).json({ message: "Bad Request: Email and password are required." });
    }
    console.log(`2. Attempting to find teacher with email: "${email}"`);

    // 3. Find the user in the database.
    const teacher = await findTeacherByEmail(email);

    // 4. Log what was returned from the database.
    if (!teacher) {
      console.error(`ERROR: No teacher found in the database for email: "${email}". The findTeacherByEmail function returned null or undefined.`);
      return res.status(401).json({ message: "Invalid credentials" });
    }
    console.log("3. Teacher record found in DB:", teacher);

    // 5. Compare the password from the request with the hash from the DB.
    console.log(`4. Comparing provided password ("${password}") with stored hash ("${teacher.password}")...`);
    const isMatch = await bcrypt.compare(password, teacher.password);

    // 6. Log the result of the comparison.
    console.log("5. Password comparison result (isMatch):", isMatch);
    if (!isMatch) {
      console.error("ERROR: Password comparison failed. The passwords do not match.");
      return res.status(401).json({ message: "Invalid credentials" });
    }
    
    // If we get here, the login is successful.
    console.log("6. LOGIN SUCCESSFUL. Generating token.");
    
    const payload = { id: teacher.id, email: teacher.email, name: teacher.name, role: "teacher" };
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "5h" });
    
    res.status(200).json({
      token: token,
      user: { id: teacher.id, name: teacher.name, email: teacher.email, role: "teacher" }
    });

  } catch (error) {
    console.error("CRITICAL ERROR: An unexpected error occurred in the login controller:", error);
    res.status(500).json({ message: "An internal server error occurred." });
  }
};

// Other controller functions (no changes)
export const getProfile = async (req, res) => { /* ... */ };
export const updateProfile = async (req, res) => { /* ... */ };
export const getTeachers = async (req, res) => { /* ... */ };

