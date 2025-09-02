import pool from "../config/db.js";


// export const getProfileByStudentId = async (studentId) => {
//   const [rows] = await pool.query(
//     "SELECT * FROM student_profiles WHERE student_id = ?",
//     [studentId]
//   );
//   return rows[0] || null; 
// };
export const getProfileByStudentId = async (studentId) => {
  const [rows] = await pool.query(
    `SELECT s.name, s.rollnumber, s.class, p.* 
     FROM students s
     LEFT JOIN student_profiles p ON s.id = p.student_id
     WHERE s.id = ?`,
    [studentId]
  );
  return rows[0] || null;
};




export const createProfile = async (studentId, data) => {
  const [result] = await pool.query(
    `INSERT INTO student_profiles 
    (student_id, dob, gender, phone, address, city, state, pincode, guardian_name, guardian_phone, admission_year, photo_url) 
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      studentId,
      data.dob || null,
      data.gender || null,
      data.phone || null,
      data.address || null,
      data.city || null,
      data.state || null,
      data.pincode || null,
      data.guardian_name || null,
      data.guardian_phone || null,
      data.admission_year || null,
      data.photo_url || null
    ]
  );
  return result.insertId;
};


export const updateProfile = async (studentId, data) => {
  const [result] = await pool.query(
    `UPDATE student_profiles SET 
      dob=?, gender=?, phone=?, address=?, city=?, state=?, pincode=?, 
      guardian_name=?, guardian_phone=?, admission_year=?, photo_url=?, updated_at=NOW()
      WHERE student_id=?`,
    [
      data.dob || null,
      data.gender || null,
      data.phone || null,
      data.address || null,
      data.city || null,
      data.state || null,
      data.pincode || null,
      data.guardian_name || null,
      data.guardian_phone || null,
      data.admission_year || null,
      data.photo_url || null,
      studentId
    ]
  );
  return result.affectedRows;
};
