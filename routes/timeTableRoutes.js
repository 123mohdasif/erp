import express from "express";
import { uploadTimetable, getTimetables, deleteTimetable } from "../controllers/timetableController.js";
import { protect, authorizeRoles } from "../middleware/authMiddleware.js";
import uploadPDF from "../middleware/uploadTimetableMiddleware.js";

const router = express.Router();

// Test route
router.get("/test", (req, res) => res.send("Timetable route is working"));

// Teacher uploads PDF
router.post("/", protect, authorizeRoles("teacher"), uploadPDF.single("file"), uploadTimetable);

// Teacher deletes timetable
router.delete("/:id", protect, authorizeRoles("teacher"), deleteTimetable);

// Any logged-in user can view timetables
router.get("/", protect, getTimetables);

export default router;
