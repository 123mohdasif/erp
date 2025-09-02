import pool from "../config/db.js";


export const getResultByRollNumber = async (rollnumber) => {
    const [rows] = await pool.query('SELECT * FROM results WHERE rollnumber = ?', [rollnumber]);
    return rows[0];
};

export const createResult = async (data) => {
    const { rollnumber, student_name, class_name, subject1, subject2, subject3, subject4, subject5, subject6 } = data;
    const [rows] = await pool.query(
        `INSERT INTO results (rollnumber, student_name, class, subject1, subject2, subject3, subject4, subject5, subject6)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [rollnumber, student_name, class_name, subject1, subject2, subject3, subject4, subject5, subject6]
    );
    return rows;
};

export const updateResult = async (rollnumber, data) => {
    const { subject1, subject2, subject3, subject4, subject5, subject6 } = data;
    const [rows] = await pool.query(
        `UPDATE results SET subject1=?, subject2=?, subject3=?, subject4=?, subject5=?, subject6=? WHERE rollnumber=?`,
        [subject1, subject2, subject3, subject4, subject5, subject6, rollnumber]
    );
    return rows;
};

export const deleteResult = async (rollnumber) => {
    const [rows] = await pool.query('DELETE FROM results WHERE rollnumber = ?', [rollnumber]);
    return rows;
};

export const getAllResults = async () => {
    const [rows] = await pool.query('SELECT * FROM results');
    return rows;
};
