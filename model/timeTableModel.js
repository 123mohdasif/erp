import db from "../config/db.js";


export const createTimetableInDB = async ({ title, file_url, uploaded_by }) => {
  const [result] = await db.execute(
    "INSERT INTO timetables (title, file_url, uploaded_by) VALUES (?, ?, ?)",
    [title, file_url, uploaded_by]
  );
  return result.insertId;
};



export const getTimetablesFromDB = async () => {
  const [rows] = await db.execute(
    "SELECT t.id, t.title, t.file_url, t.uploaded_by, t.uploaded_at, tea.name AS teacher_name FROM timetables t JOIN teachers tea ON t.uploaded_by = tea.id ORDER BY t.uploaded_at DESC"
  );
  return rows;
};



export const deleteTimetableFromDB = async (id) => {
  const [result] = await db.execute("DELETE FROM timetables WHERE id = ?", [id]);
  return result.affectedRows > 0;
};
