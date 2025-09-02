// backend/routes/attendanceRoutes.js
import express from "express";
import {
  addAttendance,
  fetchAttendance,
  fetchAttendanceByDate,
  fetchAttendancePercentage,
  exportAttendanceCSV
} from "../controllers/attendanceController.js";

import { protect, authorizeRoles } from "../middleware/authMiddleware.js";

const router = express.Router();

// Mark attendance (only teacher or admin)
router.post("/", protect, authorizeRoles("teacher", "admin"), addAttendance);

// Get attendance by studentId
router.get("/:student_id", protect, fetchAttendance);

// Get attendance between dates
router.get("/:student_id/date", protect, fetchAttendanceByDate);

// Get attendance percentage
router.get("/:student_id/percentage", protect, fetchAttendancePercentage);

// Export attendance CSV
router.get("/:student_id/export", protect, exportAttendanceCSV);

export default router;
