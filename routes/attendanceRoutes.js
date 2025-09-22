import express from "express";
import {
  addAttendance,
  addBulkAttendance,
  fetchAttendance,
  fetchAttendanceByDate,
  fetchAttendancePercentage,
  exportAttendanceCSV,
  getStudentsByClass
} from "../controllers/attendanceController.js";

// Using the single, combined middleware import
import { protectAndAuthorize } from "../middleware/ass.js";

const router = express.Router();


// --- TEACHER & ADMIN ONLY ROUTES ---
// Using the single protectAndAuthorize("role1", "role2") pattern

// Mark single attendance record
router.post("/", protectAndAuthorize("teacher"), addAttendance);

// Mark bulk attendance for an entire class (NEW)
router.post("/bulk", protectAndAuthorize("teacher"), addBulkAttendance);

// Get a list of all students in a specific class (NEW)
router.get("/class/:classId", protectAndAuthorize("teacher"), getStudentsByClass);


// --- ROUTES FOR ALL AUTHENTICATED USERS (including students) ---
// Using protectAndAuthorize() with no roles specified to allow any authenticated user

// Get all attendance by a student's ID
router.get("/student/:student_id", protectAndAuthorize(), fetchAttendance);

// Get attendance between dates for a student
router.get("/student/:student_id/date", protectAndAuthorize(), fetchAttendanceByDate);

// Get attendance percentage for a student
router.get("/student/:student_id/percentage", protectAndAuthorize(), fetchAttendancePercentage);

// Export attendance CSV for a student
router.get("/student/:student_id/export", protectAndAuthorize(), exportAttendanceCSV);


export default router;

