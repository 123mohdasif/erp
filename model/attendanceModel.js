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

    // Loop through each record and execute the insert query
    for (const record of attendanceData) {
      const { student_id, date, status, remarks } = record;
      await connection.query(query, [student_id, date, status, remarks]);
    }

    await connection.commit(); // If all queries succeed, commit the transaction
    return { success: true, inserted: attendanceData.length };
  } catch (error) {
    await connection.rollback(); // If any query fails, roll back all changes
    throw error; // Re-throw the error to be caught by the controller
  } finally {
    connection.release(); // Always release the connection back to the pool
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
    // This query assumes your `students` table has a `class` column.
    // If you used `class_id`, change the column name in the WHERE clause.
    const [rows] = await pool.query(
        "SELECT id, name, rollnumber FROM students WHERE class = ?",
        [classId]
    );
    return rows;
};

// Additional model functions can be added here as needed