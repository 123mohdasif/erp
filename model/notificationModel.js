
import pool from "../config/db.js";

export const createNotificationInDB = async ({ title, description, created_by }) => {
  const [result] = await pool.query(
    `INSERT INTO notifications 
    (title, description, target_role, created_by, created_at)
    VALUES (?, ?, 'all', ?, NOW())`,
    [title, description, parseInt(created_by)] // ensure created_by is number
  );
  return result.insertId;
};

export const getNotificationsFromDB = async (role) => {
  const [rows] = await pool.query(
    "SELECT * FROM notifications WHERE LOWER(target_role) = LOWER(?) OR target_role = 'all' ORDER BY created_at DESC",
    [role.toLowerCase()]
  );
  return rows;
};

export const deleteNotificationFromDB = async (id) => {
  const [result] = await pool.query("DELETE FROM notifications WHERE id = ?", [id]);
  return result.affectedRows > 0;
};
