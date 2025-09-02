// backend/controllers/attendanceController.js
import { Parser } from 'json2csv';
import {
  markAttendance,
  getAttendanceByStudent,
  getAttendanceByDateRange,
  getAttendancePercentage
} from '../model/attendanceModel.js';

// Add attendance (only teacher/admin)
export const addAttendance = async (req, res) => {
  try {
    const { student_id, date, status, remarks } = req.body;

    // Only teacher or admin can mark attendance
    if (!req.user || !['teacher', 'admin'].includes(req.user.role)) {
      return res.status(403).json({ error: 'Forbidden: Only teacher/admin can mark attendance' });
    }

    const result = await markAttendance(student_id, date, status, remarks);
    res.status(201).json({ message: "Attendance marked successfully", result });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Fetch all attendance of a student
export const fetchAttendance = async (req, res) => {
  try {
    const { student_id } = req.params;

    // Students can only access their own attendance
    if (req.user?.role === 'student' && req.user.id != student_id) {
      return res.status(403).json({ error: 'Forbidden: Cannot access other student attendance' });
    }

    const attendance = await getAttendanceByStudent(student_id);
    res.status(200).json(attendance);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Fetch attendance between two dates
export const fetchAttendanceByDate = async (req, res) => {
  try {
    const { student_id } = req.params;
    const { startDate, endDate } = req.query;

    if (req.user?.role === 'student' && req.user.id != student_id) {
      return res.status(403).json({ error: 'Forbidden: Cannot access other student attendance' });
    }

    const attendance = await getAttendanceByDateRange(student_id, startDate, endDate);
    res.status(200).json(attendance);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get attendance percentage
export const fetchAttendancePercentage = async (req, res) => {
  try {
    const { student_id } = req.params;

    if (req.user?.role === 'student' && req.user.id != student_id) {
      return res.status(403).json({ error: 'Forbidden: Cannot access other student attendance' });
    }

    const percentage = await getAttendancePercentage(student_id);
    res.status(200).json({ student_id, attendance_percentage: percentage });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Export attendance to CSV
export const exportAttendanceCSV = async (req, res) => {
  try {
    const { student_id } = req.params;

    if (req.user?.role === 'student' && req.user.id != student_id) {
      return res.status(403).json({ error: 'Forbidden: Cannot access other student attendance' });
    }

    const attendance = await getAttendanceByStudent(student_id);
    const parser = new Parser();
    const csv = parser.parse(attendance);

    res.header('Content-Type', 'text/csv');
    res.attachment(`attendance_${student_id}.csv`);
    res.send(csv);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
