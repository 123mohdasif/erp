import { createComplaint, findAllComplaints, findComplaintByStudentId, updateComplaintStatus } from "../model/complaintModel.js";

// Student: submit complaint
export const addComplaint = async (req, res) => {
  try {
    const studentId = req.user?.id;
    if (!studentId) return res.status(401).json({ message: "Unauthorized" });

    const complaintId = await createComplaint(studentId, req.body);
    res.status(201).json({ message: "Complaint submitted", complaintId });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Student: view own complaints
export const getMyComplaints = async (req, res) => {
  try {
    const studentId = req.user?.id;
    if (!studentId) return res.status(401).json({ message: "Unauthorized" });

    const complaints = await findComplaintByStudentId(studentId);
    res.json({ complaints });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Admin: view all complaints
export const getAllComplaints = async (req, res) => {
  try {
    const complaints = await findAllComplaints();
    res.json({ complaints });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Admin: update status
export const updateStatus = async (req, res) => {
  try {
    await updateComplaintStatus(req.params.id, req.body.status);
    res.status(200).json({ message: "Status updated successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

