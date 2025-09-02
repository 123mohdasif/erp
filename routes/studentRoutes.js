import express from "express";
import { registerStudent, loginStudent } from "../controllers/studentController.js";
import studentProfileRoutes from "./studentProfileRoutes.js";

const router = express.Router();

// Auth routes
router.post("/register", registerStudent);
router.post("/login", loginStudent);

// Profile routes
router.use("/profile", studentProfileRoutes);

export default router;
