// backend/model/teacherModel.js
import pool from '../config/db.js';

// Create a new teacher
export const createTeacher = async ({ name, email, password, employee_id, subject }) => {
  const [result] = await pool.query(
    `INSERT INTO teachers (name, email, password, employee_id, subject) VALUES (?, ?, ?, ?, ?)`,
    [name, email, password, employee_id, subject]
  );
  return result.insertId;
};

// Find teacher by email
export const findTeacherByEmail = async (email) => {
  const [rows] = await pool.query(
    `SELECT * FROM teachers WHERE email = ?`,
    [email]
  );
  return rows[0]; // return single teacher
};

//Get teacher profile by ID

export const getTeacherById=async(id)=>{
  const[rows]=await pool.query(
    `SELECT id, name, email, employee_id, subject, role, created_at FROM teachers WHERE id = ?`,
    [id]
  );
  return rows[0];
};

//Get All tecahers(for admin)
export const getAllTeachers=async()=>{
  const[rows]=await pool.query(
     `SELECT id, name, email, employee_id, subject, role, created_at FROM teachers`
     
  );
  return rows;
};

//update teacher profile
export const updateTeacherProfile=async(id,data)=>{
  const{name,subject}=data;
  await pool.query(
        `UPDATE teachers SET name = ?, subject = ? WHERE id = ?`,
    [name, subject, id]
  );
};




