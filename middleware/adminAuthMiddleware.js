import jwt from "jsonwebtoken";
import pool from "../config/db.js";
import dotenv from "dotenv";
dotenv.config();

// Protect route (JWT)
export const protect = async (req, res, next) => {
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
    token = req.headers.authorization.split(" ")[1];
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Check if student exists
      const [rows] = await pool.execute("SELECT * FROM students WHERE id=?", [decoded.id]);
      if (rows.length === 0) return res.status(401).json({ message: "User not found" });

      req.user = rows[0];
      next();
    } catch (err) {
      res.status(401).json({ message: "Not authorized, token failed" });
    }
  } else {
    res.status(401).json({ message: "No token provided" });
  }
};

// Admin only middleware
export const adminOnly = async (req, res, next) => {
  try {
    const [rows] = await pool.execute("SELECT * FROM teacher WHERE id=?", [req.user.id]);
    const admin = rows[0];
    if (admin && admin.role === "admin") next();
    else res.status(403).json({ message: "Admin access only" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};
