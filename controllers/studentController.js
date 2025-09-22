import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { createStudent, findStudentByEmail } from "../model/studentModel.js";

// Register student
export const registerStudent = async (req, res) => {
  try {
    const { name, email, password, rollNumber, class: studentClass } = req.body;

    const existing = await findStudentByEmail(email);
    if (existing) return res.status(400).json({ message: "Student already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);

    const id = await createStudent({
      name,
      email,
      password: hashedPassword,
      rollnumber: rollNumber,
      class: studentClass
    });

    res.status(201).json({ message: "Student registered successfully", id });
  } catch (error) {
    console.error("Error registering student:", error);
    res.status(500).json({ message: error.message });
  }
};

// Login student
export const loginStudent = async (req, res) => {
  try {
    const { email, password } = req.body;

    const student = await findStudentByEmail(email);
    if (!student) return res.status(400).json({ message: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, student.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

    // --- FIX IS HERE ---
    // 1. Create a complete payload for the JWT
    const payload = {
      id: student.id,
      email: student.email,
      name: student.name,
      role: student.role || "student", // Use role from DB or default
      class: student.class
    };

    const token = jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: "5h" }
    );

    // 2. Send back a 'user' object along with the token.
    // This is what the frontend will store in localStorage as 'userInfo'.
    res.status(200).json({
      token: token,
      user: {
        id: student.id,
        name: student.name,
        email: student.email,
        role: student.role || "student",
        class: student.class // The class is crucial for the attendance component
      }
    });
    // --- END FIX ---

  } catch (error) {
    console.error("Error logging in:", error);
    res.status(500).json({ message: error.message });
  }
};

