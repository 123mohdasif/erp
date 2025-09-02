import express from "express";
import { 
  uploadAssignment, 
  viewAssignments, 
  deleteAssignment 
} from "../controllers/assignmentController.js";
import { protect, authorizeRoles } from "../middleware/authMiddleware.js";
import upload from "../middleware/uploadMiddleware.js";
import path from "path";

const router = express.Router();

router.delete("/:id", protect, authorizeRoles("teacher"), deleteAssignment);

router.post(
  "/upload",
  protect,
  authorizeRoles("teacher"),
  upload.single("file"),
  uploadAssignment
);

router.get("/", protect, authorizeRoles("student", "teacher"), viewAssignments);

// ✅ Download assignment by filename
router.get("/download/:filename", (req, res) => {
  const filePath = path.join("uploads/assignments", req.params.filename);
  res.download(filePath, (err) => {
    if (err) res.status(404).json({ message: "File not found" });
  });
});

export default router;
