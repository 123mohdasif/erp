import express from "express";
import { addComplaint, getAllComplaints, getMyComplaints, updateStatus } from "../controllers/complaintController.js";
import { protect, authorizeRoles } from "../middleware/authMiddleware.js";

const router = express.Router();

// Student: create complaint
router.post("/", protect, addComplaint);

// Student: view own complaints
router.get("/my", protect, getMyComplaints);

// Admin: view all complaints
router.get("/", protect, authorizeRoles("admin","teacher"), getAllComplaints);

// Admin: update complaint status
router.put("/:id/status", protect, authorizeRoles("admin","teacher"), updateStatus);


export default router;
