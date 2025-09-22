// backend/controllers/attendanceController.js
import { Parser } from 'json2csv';
import {
  markAttendance,
  markBulkAttendance,
  getAttendanceByStudent,
  
  
  
} from '../model/attendanceModel.js';

// Add single attendance record (for teacher/admin)
export const addAttendance = async (req, res) => {
  try {
    const { student_id, date, status, remarks } = req.body;
    const result = await markAttendance(student_id, date, status, remarks);
    res.status(201).json({ message: "Attendance marked successfully", result });
  } catch (err) {
    res.status(500).json({ error: 'Failed to mark attendance: ' + err.message });
  }
};

// Add bulk attendance records (for teacher/admin)
export const addBulkAttendance = async (req, res) => {
  try {
    const attendanceData = req.body;
    if (!Array.isArray(attendanceData) || attendanceData.length === 0) {
      return res.status(400).json({ error: 'Bad Request: Expected a non-empty array of attendance data.' });
    }
    const result = await markBulkAttendance(attendanceData);
    res.status(201).json({ message: "Bulk attendance marked successfully.", result });
  } catch (err) {
    res.status(500).json({ error: 'Failed to mark bulk attendance: ' + err.message });
  }
};

// Fetch all students in a class (for teacher/admin)
export const getStudentsByClass = async (req, res) => {
    try {
      const { classId } = req.params;
      const students = await getStudentsByClassId(classId);
      res.status(200).json(students);
    } catch (err) {
      res.status(500).json({ error: 'Failed to fetch class list: ' + err.message });
    }
};

// Fetch all attendance records for a specific student
export const fetchAttendance = async (req, res) => {
  try {
    const { student_id } = req.params;

    // Security check: Students can only access their own attendance
    if (req.user.role === 'student' && req.user.id != student_id) {
      return res.status(403).json({ error: 'Forbidden: You can only access your own attendance records.' });
    }

    const attendance = await getAttendanceByStudent(student_id);
    res.status(200).json(attendance);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch attendance: ' + err.message });
  }
};

// Fetch attendance between two dates for a specific student
export const fetchAttendanceByDate = async (req, res) => {
  try {
    const { student_id } = req.params;
    const { startDate, endDate } = req.query;

    if (req.user.role === 'student' && req.user.id != student_id) {
        return res.status(403).json({ error: 'Forbidden: You can only access your own attendance records.' });
    }

    const attendance = await getAttendanceByDateRange(student_id, startDate, endDate);
    res.status(200).json(attendance);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch attendance by date: ' + err.message });
  }
};

// Get the attendance percentage for a specific student
export const fetchAttendancePercentage = async (req, res) => {
  try {
    const { student_id } = req.params;

    if (req.user.role === 'student' && req.user.id != student_id) {
        return res.status(403).json({ error: 'Forbidden: You can only access your own attendance records.' });
    }

    const percentage = await getAttendancePercentage(student_id);
    res.status(200).json({ student_id, attendance_percentage: percentage });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch attendance percentage: ' + err.message });
  }
};

// Export attendance to a CSV file for a specific student
export const exportAttendanceCSV = async (req, res) => {
  try {
    const { student_id } = req.params;

     if (req.user.role === 'student' && req.user.id != student_id) {
        return res.status(403).json({ error: 'Forbidden: You can only access your own attendance records.' });
    }

    const attendance = await getAttendanceByStudent(student_id);
    if (attendance.length === 0) {
        return res.status(404).json({ error: 'No attendance data found for this student.' });
    }
    const parser = new Parser();
    const csv = parser.parse(attendance);

    res.header('Content-Type', 'text/csv');
    res.attachment(`attendance_report_${student_id}.csv`);
    res.send(csv);
  } catch (err) {
    res.status(500).json({ error: 'Failed to export attendance data: ' + err.message });
  }
};

