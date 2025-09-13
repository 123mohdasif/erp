import pool from '../config/db.js';

// Create a complaint
export const createComplaint = async (studentId, data) => {
  const status = data.status || 'pending';
  const [result] = await pool.query(
    `INSERT INTO complaints(student_id, title, description, status) VALUES (?, ?, ?, ?)`,
    [studentId, data.title, data.description, status]
  );
  return result.insertId;
};

// Get complaints for a student
export const findComplaintByStudentId = async (studentId) => {
  const [rows] = await pool.query(
    `SELECT * FROM complaints WHERE student_id = ?`,
    [studentId]
  );
  return rows;
};

// Get all complaints (admin)
export const findAllComplaints = async () => {
  const [rows] = await pool.query(`SELECT * FROM complaints`);
  return rows;
};

// Update complaint status (admin)
export const updateComplaintStatus = async (id, status) => {
  await pool.query(
    `UPDATE complaints SET status = ? WHERE id = ?`,
    [status, id]
  );
};

