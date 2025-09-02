import express from "express";
import { uploadBooklist, getBooklists, deleteBooklist } from "../controllers/booklistController.js";
import { protect, authorizeRoles } from "../middleware/authMiddleware.js";
import upload from "../middleware/uploadMiddleware.js"; // use your existing PDF upload middleware

const router = express.Router();

// Teacher only
router.post("/", protect, authorizeRoles("teacher"), upload.single("file"), uploadBooklist);
router.delete("/:id", protect, authorizeRoles("teacher"), deleteBooklist);

// Any logged-in user
router.get("/", protect, getBooklists);

export default router;
