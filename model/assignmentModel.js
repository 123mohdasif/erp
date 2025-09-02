import pool from "../config/db.js";
import path from "path";
import fs from "fs";

export const createAssignment = async ({ title, description, filePath, uploadedBy }) => {
  const [result] = await pool.query(
    "INSERT INTO assignments (title, description, file_path, uploaded_by) VALUES (?,?,?,?)",
    [title, description, filePath, uploadedBy]
  );
  return result.insertId;
};

export const getAssignments = async () => {
  const [rows] = await pool.query("SELECT * FROM assignments ORDER BY created_at DESC");
  return rows;
};
export const deleteAssignmentById = async (id) => {
  // fetch assignment to get filename
  const [rows] = await pool.query("SELECT * FROM assignments WHERE id = ?", [id]);
  if (rows.length === 0) return false;

  const assignment = rows[0];
  const filePath = path.join("uploads/assignments", assignment.file_path);

  if (fs.existsSync(filePath)) {
    fs.unlinkSync(filePath); // delete the file
  }

  await pool.query("DELETE FROM assignments WHERE id = ?", [id]);
  return true;
};