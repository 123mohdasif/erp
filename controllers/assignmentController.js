import { 
  createAssignment, 
  getAssignments, 
  deleteAssignmentById,
  createSubmission,
  // --- FIX ---: Add getSubmissionsByAssignmentId to the import list
  getSubmissionsByAssignmentId 
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

export const viewSubmissions = async (req, res) => {
  try {
    const { id: assignmentId } = req.params;
    // This line will now work because the function is imported
    const submissions = await getSubmissionsByAssignmentId(assignmentId);
    res.status(200).json(submissions);
  } catch (err) {
    console.error("Error fetching submissions:", err);
    res.status(500).json({ message: "Server error while fetching submissions." });
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
export const submitAssignment = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file was submitted." });
    }

    const { id: assignment_id } = req.params;
    const { id: student_id } = req.user;
    const filePath = req.file.filename;

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

