// backend/routes/testUploadRoutes.js
import express from "express";
import multer from "multer";
import fs from "fs";
import path from "path";

const router = express.Router();

// Ensure folders exist at runtime
const dir = path.join(process.cwd(), "uploads", "assignments");
fs.mkdirSync(dir, { recursive: true });

// Minimal multer just for this test (accept any file)
const upload = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => cb(null, "uploads/assignments"),
    filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname),
  }),
});

// Quick ping to confirm mount
router.get("/ping", (req, res) => {
  res.json({ ok: true, msg: "test routes mounted" });
});

// Minimal upload route (no auth)
router.post("/upload", upload.single("file"), (req, res) => {
  if (!req.file) return res.status(400).json({ message: "No file uploaded" });
  res.json({
    message: "Uploaded ✅",
    savedAs: req.file.filename,
    path: req.file.path,
  });
});

export default router;
