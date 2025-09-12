// import express from "express";
// import { 
//   uploadAssignment, 
//   viewAssignments, 
//   deleteAssignment,
//   submitAssignment // Import the new controller function
// } from "../controllers/assignmentController.js";
// import { protect, authorizeRoles } from "../middleware/authMiddleware.js";
// import upload from "../middleware/uploadMiddleware.js";
// import path from "path";

// const router = express.Router();

// // --- Teacher Routes ---
// router.post(
//   "/upload",
//   protect,
//   authorizeRoles("teacher"),
//   upload.single("assignmentFile"), // Make sure this matches the frontend key
//   uploadAssignment
// );

// router.delete("/:id", protect, authorizeRoles("teacher"), deleteAssignment);

// // --- Shared Routes ---
// router.get("/view", protect, authorizeRoles("student", "teacher"), viewAssignments);

// // --- Student Route ---
// // This is the new route for students to submit their work.
// // It includes the assignment ID in the URL.
// router.post(
//   "/:id/submit",
//   protect,
//   authorizeRoles("student"),
//   upload.single("submissionFile"), // Make sure this matches the frontend key
//   submitAssignment
// );


// // --- File Download Route ---
// // NOTE: This should be updated for security to check if the user 
// // (student or teacher) has permission to download the file.
// router.get("/download/:filename", (req, res) => {
//   const filePath = path.join("uploads/assignments", req.params.filename);
//   res.download(filePath, (err) => {
//     if (err) res.status(404).json({ message: "File not found" });
//   });
// });

// export default router;




import express from "express";
import { 
  uploadAssignment, 
  viewAssignments, 
  deleteAssignment,
  submitAssignment 
} from "../controllers/assignmentController.js";
// 1. Import the new, combined middleware function
import { protectAndAuthorize } from "../middleware/ass.js";
import upload from "../middleware/uploadMiddleware.js";
import path from "path";

const router = express.Router();

// --- Teacher Routes ---
router.post(
  "/upload",
  // 2. Use the single middleware for protection and authorization
  protectAndAuthorize("teacher"), 
  upload.single("assignmentFile"),
  uploadAssignment
);

router.delete("/:id", protectAndAuthorize("teacher"), deleteAssignment);

// --- Shared Routes ---
router.get("/view", protectAndAuthorize("student", "teacher"), viewAssignments);

// --- Student Route ---
router.post(
  "/:id/submit",
  protectAndAuthorize("student"),
  upload.single("submissionFile"),
  submitAssignment
);

// --- File Download Route ---
// NOTE: This route is currently unprotected. For enhanced security, you could add
// middleware here to verify that the logged-in user is enrolled in the course
// to which the assignment belongs before allowing the download.
router.get("/download/:filename", (req, res) => {
  const filePath = path.join("uploads/assignments", req.params.filename);
  res.download(filePath, (err) => {
    if (err) {
      console.error("File download error:", err);
      res.status(404).json({ message: "File not found." });
    }
  });
});

export default router;


