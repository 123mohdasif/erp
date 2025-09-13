

import { createNotificationInDB, getNotificationsFromDB, deleteNotificationFromDB } from "../model/notificationModel.js";

// Create notification (only teachers)
export const createNotification = async (req, res) => {
  try {
    const { title, description } = req.body;
    const created_by = req.user.id; // from JWT

    if (!title || !description) {
      return res.status(400).json({ error: "Title and description are required" });
    }

    const notificationId = await createNotificationInDB({ title, description, created_by });

    res.status(201).json({ message: "Notification created successfully", notificationId });
  } catch (err) {
    console.error(" Error in createNotification:", err);
    res.status(500).json({ error: "Server error" });
  }
};

// Get notifications (teacher/student)
export const getNotifications = async (req, res) => {
  try {
    const role = req.user.role; // from JWT
    const notifications = await getNotificationsFromDB(role);
    res.json(notifications);
  } catch (err) {
    console.error("Error in getNotifications:", err);
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
