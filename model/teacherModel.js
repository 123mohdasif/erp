import pool from '../config/db.js'; // Adjust path if needed

// Find a teacher by their email address
export const findTeacherByEmail = async (email) => {
    // This is the key fix: Explicitly selecting 'id', 'name', 'email', and 'password'
    const [rows] = await pool.query(
        "SELECT id, name, email, password FROM teachers WHERE email = ?",
        [email]
    );
    return rows[0]; // Return the first result or undefined
};

// Create a new teacher
export const createTeacher = async ({ name, email, password, employee_id, subject }) => {
    const [result] = await pool.query(
        "INSERT INTO teachers (name, email, password, employee_id, subject) VALUES (?, ?, ?, ?, ?)",
        [name, email, password, employee_id, subject]
    );
    return result.insertId;
};

// Get a single teacher by their ID
export const getTeacherById = async (id) => {
    const [rows] = await pool.query("SELECT id, name, email, employee_id, subject, role, created_at FROM teachers WHERE id = ?", [id]);
    return rows[0];
};

// Get all teachers (for admin)
export const getAllTeachers = async () => {
    const [rows] = await pool.query("SELECT id, name, email, employee_id, subject, role, created_at FROM teachers");
    return rows;
};

// Update a teacher's profile
export const updateTeacherProfile = async (id, data) => {
    const { name, subject } = data;
    await pool.query(
        "UPDATE teachers SET name = ?, subject = ? WHERE id = ?",
        [name, subject, id]
    );
};

