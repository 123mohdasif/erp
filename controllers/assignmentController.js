import { 
  createAssignment, 
  getAssignments, 
  deleteAssignmentById,
  createSubmission // Import the new model function
} from "../model/assignmentModel.js";
import fs from "fs";
import path from "path";

// --- For Teachers ---
export const uploadAssignment = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded or invalid format" });
    }

    const { title, description } = req.body;
    const filePath = req.file.filename; 
    const uploadedBy = req.user.id; // Comes from the 'protect' middleware     

    const assignmentId = await createAssignment({
      title,
      description,
      filePath,
      uploadedBy,
    });

    res.status(201).json({
      message: "Assignment uploaded successfully",
      assignmentId,
    });
  } catch (err) {
    console.error("Error uploading assignment:", err);
    res.status(500).json({ message: "Server error during assignment upload." });
  }
};

export const deleteAssignment = async (req, res) => {
  try {
    const assignmentId = req.params.id;
    const success = await deleteAssignmentById(assignmentId);

    if (success) {
      res.status(200).json({ message: "Assignment deleted successfully" });
    } else {
      res.status(404).json({ message: "Assignment not found" });
    }
  } catch (err) {
    console.error("Error deleting assignment:", err);
    res.status(500).json({ message: "Server error" });
  }
};


// --- For Students & Teachers ---
export const viewAssignments = async (req, res) => {
  try {
    const assignments = await getAssignments();
    res.status(200).json(assignments);
  } catch (err) {
    console.error("Error fetching assignments:", err);
    res.status(500).json({ message: "Server error" });
  }
};


// --- For Students ---
// This is the new controller function for handling submissions.
export const submitAssignment = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file was submitted." });
    }

    const { id: assignment_id } = req.params; // Get assignment ID from URL
    const { id: student_id } = req.user;      // Get student ID from token
    const filePath = req.file.filename;       // Get filename from multer

    const submissionId = await createSubmission({
      assignment_id,
      student_id,
      filePath,
    });

    res.status(201).json({
      message: "Assignment submitted successfully!",
      submissionId,
    });

  } catch (err) {
    console.error("Error submitting assignment:", err);
    res.status(500).json({ message: "Server error during submission." });
  }
};
