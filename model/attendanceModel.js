import pool from './../config/db.js';

// Mark a single attendance record
export const markAttendance = async (student_id, date, status, remarks) => {
  const [result] = await pool.query(
    "INSERT INTO attendance (student_id, date, status, remarks) VALUES (?, ?, ?, ?)",
    [student_id, date, status, remarks]
  );
  return result;
};

// Mark multiple attendance records in a single transaction
export const markBulkAttendance = async (attendanceData) => {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();
    const query = "INSERT INTO attendance (student_id, date, status, remarks) VALUES (?, ?, ?, ?)";
    for (const record of attendanceData) {
      const { student_id, date, status, remarks } = record;
      await connection.query(query, [student_id, date, status, remarks]);
    }
    await connection.commit();
    return { success: true, inserted: attendanceData.length };
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
};

// Fetch all attendance records for a specific student
export const getAttendanceByStudent = async (student_id) => {
  const [rows] = await pool.query(
    "SELECT * FROM attendance WHERE student_id = ? ORDER BY date DESC",
    [student_id]
  );
  return rows;
};

// Fetch all students from a specific class
export const fetchStudentsByClass = async (classId) => {
    const [rows] = await pool.query(
        "SELECT id, name, rollnumber FROM students WHERE class = ?",
        [classId]
    );
    return rows;
};

// --- NEWLY ADDED FUNCTIONS ---

// Fetch attendance records for a specific student within a date range
export const getAttendanceByDateRange = async (student_id, startDate, endDate) => {
  const [rows] = await pool.query(
    "SELECT * FROM attendance WHERE student_id = ? AND date BETWEEN ? AND ? ORDER BY date ASC",
    [student_id, startDate, endDate]
  );
  return rows;
};

// Calculate and return the attendance percentage for a specific student
export const getAttendancePercentage = async (student_id) => {
  const [presentResult] = await pool.query(
    "SELECT COUNT(*) as presentCount FROM attendance WHERE student_id = ? AND (status = 'Present' OR status = 'Late')",
    [student_id]
  );
  const [totalResult] = await pool.query(
    "SELECT COUNT(*) as totalCount FROM attendance WHERE student_id = ?",
    [student_id]
  );

  const presentCount = presentResult[0].presentCount;
  const totalCount = totalResult[0].totalCount;

  if (totalCount === 0) {
    return 0; // Avoid division by zero
  }

  return (presentCount / totalCount) * 100;
};
