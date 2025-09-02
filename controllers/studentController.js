import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { createStudent, findStudentByEmail } from "../model/studentModel.js";

// Register student
export const registerStudent = async (req, res) => {
  try {
    const { name, email, password, rollnumber, class: studentClass } = req.body;

    const existing = await findStudentByEmail(email);
    if (existing) return res.status(400).json({ message: "Student already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);

    const id = await createStudent({
      name,
      email,
      password: hashedPassword,
      rollnumber,
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

    const token = jwt.sign(
      { id: student.id, email: student.email, name: student.name },
      process.env.JWT_SECRET,
      { expiresIn: "5h" }
    );

    res.status(200).json({ message: "Login successful", token });
  } catch (error) {
    console.error("Error logging in:", error);
    res.status(500).json({ message: error.message });
  }
};
