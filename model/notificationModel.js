import pool from "../config/db.js";

// Create Notification
export const createNotificationInDB = async ({ title, description, target_role, created_by }) => {
  const [result] = await pool.query(
    "INSERT INTO notifications (title, description, target_role, created_by) VALUES (?, ?, ?, ?)",
    [title, description, target_role, created_by]
  );
  return result.insertId;
};

// Get Notifications by role
export const getNotificationsFromDB = async (role) => {
  // Fetch notifications where target_role matches the user OR for everyone ("all")
  const [rows] = await pool.query(
    "SELECT * FROM notifications WHERE target_role = ? OR target_role = 'all' ORDER BY created_at DESC",
    [role]
  );
  return rows;
};

// Delete Notification
export const deleteNotificationFromDB = async (id) => {
  const [result] = await pool.query("DELETE FROM notifications WHERE id = ?", [id]);
  return result.affectedRows > 0;
};
