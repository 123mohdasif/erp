import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { createTeacher, findTeacherByEmail, getTeacherById, getAllTeachers, updateTeacherProfile } from '../model/teacherModel.js';

// Teacher registration
export const registerTeacher = async (req, res) => {
  try {
    const { name, email, password, employee_id, subject } = req.body;

    const existing = await findTeacherByEmail(email);
    if (existing) return res.status(400).json({ message: "Teacher already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const id = await createTeacher({ name, email, password: hashedPassword, employee_id, subject });

    res.status(201).json({ message: "Teacher registered successfully", id });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Teacher login
export const loginTeacher = async (req, res) => {
  try {
    const { email, password } = req.body;
    const teacher = await findTeacherByEmail(email);
    if (!teacher) return res.status(400).json({ message: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, teacher.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });
    
    // The payload here is already correct.
    const payload = { 
      id: teacher.id, 
      email: teacher.email, 
      role: "teacher" 
    };

    const token = jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: "5h" }
    );
    
    // --- FIX IS HERE ---
    // Add 'role: "teacher"' to the response for the frontend.
    res.status(200).json({ 
      message: "Login successful", 
      token: token,
      role: "teacher"
    });
    // --- END FIX ---

  } catch (error)
   {
    res.status(500).json({ message: error.message });
  }
};

// Get own profile
export const getProfile = async (req, res) => {
  try {
    const teacher = await getTeacherById(req.user.id);
    res.json({ teacher });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Update own profile
export const updateProfile = async (req, res) => {
  try {
    await updateTeacherProfile(req.user.id, req.body);
    res.json({ message: "Profile updated successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Admin: view all teachers
export const getTeachers = async (req, res) => {
  try {
    const teachers = await getAllTeachers();
    res.json({ teachers });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
