import pool from "../config/db.js";

export const findStudentByEmail = async (email) => {
  const [rows] = await pool.query(
    "SELECT * FROM students WHERE email = ?",
    [email]
  );
  return rows[0];
};

export const createStudent = async (student) => {
  const [result] = await pool.query(
    "INSERT INTO students (name, email, password, rollnumber, class) VALUES (?, ?, ?, ?, ?)",
    [student.name, student.email, student.password, student.rollnumber, student.class]
  );
  return result.insertId;
};

export const findStudentById = async (id) => {
  const [rows] = await pool.query(
    "SELECT id, name, rollnumber, class FROM students WHERE id = ?",
    [id]
  );
  return rows[0];
};
