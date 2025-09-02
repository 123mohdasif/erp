import express from "express";
import { protect,authorizeRoles } from "../middleware/authMiddleware.js";
import {
  submitApp,
  viewAllApps,
  giveAppFeedback,
  removeApplication,
  viewStudentApps,
} from "../controllers/leaveApplicationController.js";

const router = express.Router();

// Student
router.post("/submit", protect, authorizeRoles("student"), submitApp);
router.get("/my-applications", protect, authorizeRoles("student"), viewStudentApps);

// Teacher
router.get("/", protect, authorizeRoles("teacher"), viewAllApps);
router.put("/feedback/:id", protect, authorizeRoles("teacher"), giveAppFeedback);
router.delete("/:id", protect, authorizeRoles("teacher"), removeApplication);

export default router;
