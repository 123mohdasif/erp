import db from '../config/db.js'; // Adjust this path if your db connection file is elsewhere

// --- CREATE ---

export const createAssignment = async ({ title, description, filePath, uploadedBy }) => {
  try {
    const [result] = await db.query(
      'INSERT INTO assignments (title, description, file_path, uploaded_by) VALUES (?, ?, ?, ?)',
      [title, description, filePath, uploadedBy]
    );
    return result.insertId;
  } catch (error) {
    console.error("Error in createAssignment model:", error);
    throw error;
  }
};

export const createSubmission = async ({ assignment_id, student_id, filePath }) => {
  try {
    const [result] = await db.query(
      'INSERT INTO submissions (assignment_id, student_id, file_path) VALUES (?, ?, ?)',
      [assignment_id, student_id, filePath]
    );
    return result.insertId;
  } catch (error) {
    console.error("Error in createSubmission model:", error);
    throw error;
  }
};


// --- READ / GET ---

export const getAssignments = async () => {
  try {
    // This query now also counts the number of submissions for each assignment
    const [rows] = await db.query(`
      SELECT a.*, COUNT(s.id) AS submission_count
      FROM assignments a
      LEFT JOIN submissions s ON a.id = s.assignment_id
      GROUP BY a.id
      ORDER BY a.created_at DESC
    `);
    return rows;
  } catch (error) {
    console.error("Error in getAssignments model:", error);
    throw error;
  }
};

// This is the new function to get submissions for a specific assignment
export const getSubmissionsByAssignmentId = async (assignmentId) => {
  try {
    const [rows] = await db.query(
      `SELECT 
        s.id, 
        s.file_path, 
        s.submitted_at, 
        u.name AS student_name 
      FROM submissions s
      JOIN students u ON s.student_id = u.id
      WHERE s.assignment_id = ?
      ORDER BY s.submitted_at DESC`,
      [assignmentId]
    );
    return rows;
  } catch (error) {
    console.error("Error in getSubmissionsByAssignmentId model:", error);
    throw error;
  }
};


// --- DELETE ---

export const deleteAssignmentById = async (id) => {
    try {
        const [result] = await db.query('DELETE FROM assignments WHERE id = ?', [id]);
        return result.affectedRows > 0;
    } catch (error) {
        console.error("Error in deleteAssignmentById model:", error);
        throw error;
    }
};

