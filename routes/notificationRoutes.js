import express from "express";
import {
  createNotification,
  getNotifications,
  deleteNotification,
} from "../controllers/notificationController.js";
import { protect, authorizeRoles } from "../middleware/authMiddleware.js";

const router = express.Router();

// ✅ Health check
router.get("/test", (req, res) => {
  res.send("✅ Notifications route is working");
});

// Create notification (teachers only)
router.post("/", protect, authorizeRoles("teacher"), createNotification);

// Delete notification (teachers only)
router.delete("/:id", protect, authorizeRoles("teacher"), deleteNotification);

// View notifications (students + teachers)
router.get("/", protect, getNotifications);

export default router;
