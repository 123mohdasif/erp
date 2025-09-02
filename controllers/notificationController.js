import { createNotificationInDB, getNotificationsFromDB, deleteNotificationFromDB } from "../model/notificationModel.js";

// Create notification (only teachers)
export const createNotification = async (req, res) => {
  try {
    const { title, description, target_role } = req.body;
    const created_by = req.user.id; // comes from JWT

    if (!title || !description || !target_role) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const notificationId = await createNotificationInDB({ title, description, target_role, created_by });

    res.status(201).json({ message: "Notification created successfully", notificationId });
  } catch (err) {
    console.error("❌ Error in createNotification:", err);
    res.status(500).json({ error: "Server error" });
  }
};

// Get notifications (teacher/student)
export const getNotifications = async (req, res) => {
  try {
    const role = req.user.role; // comes from JWT
    const notifications = await getNotificationsFromDB(role);
    res.json(notifications);
  } catch (err) {
    console.error("❌ Error in getNotifications:", err);
    res.status(500).json({ error: "Server error" });
  }
};

// Delete notification (only teachers)
export const deleteNotification = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await deleteNotificationFromDB(id);

    if (!deleted) return res.status(404).json({ error: "Notification not found" });

    res.json({ message: "Notification deleted successfully" });
  } catch (err) {
    console.error("Error in deleteNotification:", err);
    res.status(500).json({ error: "Server error" });
  }
};
