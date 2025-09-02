import db from "../config/db.js";

export const submitApplication = (data) => {
  const { student_name, student_class, rollnumber, application_text } = data;
  const query = `
    INSERT INTO leave_applications (student_name, student_class, roll_number, application_text)
    VALUES (?, ?, ?, ?)
  `;
  return db.execute(query, [student_name, student_class, rollnumber, application_text]);
};

export const getAllApplications = () => {
  const query = `SELECT * FROM leave_applications ORDER BY created_at DESC`;
  return db.execute(query);
};

export const giveFeedback = (applicationId, feedback) => {
  const query = `UPDATE leave_applications SET feedback = ? WHERE id = ?`;
  return db.execute(query, [feedback, applicationId]);
};

export const deleteApplication = (applicationId) => {
  const query = `DELETE FROM leave_applications WHERE id = ?`;
  return db.execute(query, [applicationId]);
};

export const getStudentApplications = (rollnumber) => {
  const query = `SELECT * FROM leave_applications WHERE roll_number = ? ORDER BY created_at DESC`;
  return db.execute(query, [rollnumber]);
};
