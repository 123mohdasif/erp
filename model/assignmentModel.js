import pool from "../config/db.js";
import path from "path";
import fs from "fs";

// --- For Teachers ---
export const createAssignment = async ({ title, description, filePath, uploadedBy }) => {
  const [result] = await pool.query(
    "INSERT INTO assignments (title, description, file_path, uploaded_by) VALUES (?, ?, ?, ?)",
    [title, description, filePath, uploadedBy]
  );
  return result.insertId;
};

export const deleteAssignmentById = async (id) => {
  const [rows] = await pool.query("SELECT file_path FROM assignments WHERE id = ?", [id]);
  if (rows.length === 0) return false;

  const assignment = rows[0];
  if (assignment.file_path) {
    const filePath = path.join("uploads/assignments", assignment.file_path);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath); // delete the file
    }
  }

  await pool.query("DELETE FROM assignments WHERE id = ?", [id]);
  return true;
};

// --- For Students & Teachers ---
export const getAssignments = async () => {
  const [rows] = await pool.query("SELECT * FROM assignments ORDER BY created_at DESC");
  return rows;
};


// --- For Students ---
// This new function inserts a record into your 'submissions' table.
export const createSubmission = async ({ assignment_id, student_id, filePath }) => {
  const [result] = await pool.query(
    "INSERT INTO submissions (assignment_id, student_id, file_path) VALUES (?, ?, ?)",
    [assignment_id, student_id, filePath]
  );
  return result.insertId;
};
