import { createAssignment, getAssignments } from "../model/assignmentModel.js";

export const uploadAssignment = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded or invalid format" });
    }

    const { title, description } = req.body;
    const filePath = req.file.filename; 
    const uploadedBy = req.user.id;     

    const assignmentId = await createAssignment({
      title,
      description,
      filePath,
      uploadedBy,
    });

    res.status(201).json({
      message: "Assignment uploaded successfully",
      assignmentId,
      file: filePath,
      url: `/uploads/assignments/${filePath}`,
    });
  } catch (err) {
    console.error("Error uploading assignment:", err);
    res.status(500).json({ message: err.message });
  }
};

export const viewAssignments = async (req, res) => {
  try {
    const assignments = await getAssignments();
    res.status(200).json(assignments);
  } catch (err) {
    console.error("Error fetching assignments:", err);
    res.status(500).json({ message: err.message });
  }
};

import fs from "fs";
import path from "path";
import db from "../config/db.js"; 

export const deleteAssignment = async (req, res) => {
  try {
    const assignmentId = req.params.id;

    const [rows] = await db.query("SELECT * FROM assignments WHERE id = ?", [assignmentId]);
    if (rows.length === 0) {
      return res.status(404).json({ message: "Assignment not found" });
    }

    const assignment = rows[0];

    // 2. Delete from DB
    await db.query("DELETE FROM assignments WHERE id = ?", [assignmentId]);

    // 3. Remove file from uploads (if exists)
    if (assignment.file_path) {
      const filePath = path.join("uploads/assignments", assignment.file_path);
      fs.unlink(filePath, (err) => {
        if (err) {
          console.warn("File deletion error:", err.message);
        }
      });
    }

    res.status(200).json({ message: "Assignment deleted successfully" });
  } catch (err) {
    console.error("Error deleting assignment:", err);
    res.status(500).json({ message: "Server error" });
  }
};
