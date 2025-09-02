import pool from "../config/db.js";

export const bulkInsertStudents = async (students) => {
  const query = `
    INSERT INTO students (name, email, password, rollnumber, class, role) 
    VALUES ?`;
  
  const values = students.map((s) => [
    s.name,
    s.email,
    s.password,
    s.rollnumber,
    s.class,
    s.role || "student", // default role student
  ]);

  const [result] = await pool.query(query, [values]);
  return result;
};
