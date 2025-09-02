import pool from './../config/db.js';

// Mark attendance
export const markAttendance = async (student_id, date, status, remarks) => {
  const [result] = await pool.query(
    "INSERT INTO attendance (student_id, date, status, remarks) VALUES (?, ?, ?, ?)",
    [student_id, date, status, remarks]
  );
  return result;
};

// Fetch attendance of a student
export const getAttendanceByStudent = async (student_id) => {
  const [rows] = await pool.query(
    "SELECT * FROM attendance WHERE student_id = ? ORDER BY date DESC",
    [student_id]
  );
  return rows;
};

// Fetch attendance in a date range
export const getAttendanceByDateRange = async (student_id, startDate, endDate) => {
  const [rows] = await pool.query(
    "SELECT * FROM attendance WHERE student_id = ? AND date BETWEEN ? AND ? ORDER BY date ASC",
    [student_id, startDate, endDate]
  );
  return rows;
};

// Calculate attendance percentage
export const getAttendancePercentage = async (student_id) => {
  const [presentCount] = await pool.query(
    "SELECT COUNT(*) as present FROM attendance WHERE student_id = ? AND status = 'Present'",
    [student_id]
  );

  const [totalCount] = await pool.query(
    "SELECT COUNT(*) as total FROM attendance WHERE student_id = ?",
    [student_id]
  );

  const percentage = (presentCount[0].present / totalCount[0].total) * 100 || 0;
  return percentage.toFixed(2);
};
