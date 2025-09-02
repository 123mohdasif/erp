import { getResultByRollNumber, createResult, updateResult, deleteResult, getAllResults } from '../model/resultModel.js';
import pool from '../config/db.js';


// Admin: Upload result
export const uploadResult = async (req, res) => {
    try {
        const { rollnumber, student_name, class_name, subject1, subject2, subject3, subject4, subject5, subject6 } = req.body;

        // Check if student exists
        const [student] = await pool.query('SELECT * FROM students WHERE rollnumber = ?', [rollnumber]);
        if (!student.length) return res.status(404).json({ message: 'Student with this roll number not found' });

        // Check if entered name matches the one in the students table
        if (student_name !== student[0].name) {
            return res.status(400).json({ message: `Roll number ${rollnumber} corresponds to ${student[0].name}` });
        }

        // Check if result already exists
        const existingResult = await getResultByRollNumber(rollnumber);
        if (existingResult) return res.status(400).json({ message: 'Result for this roll number already exists' });

        await createResult({ rollnumber, student_name, class_name: student[0].class, subject1, subject2, subject3, subject4, subject5, subject6 });
        res.status(201).json({ message: 'Result uploaded successfully' });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


// Admin: Update result
export const updateResultByRollNumber = async (req, res) => {
    try {
        const { rollnumber } = req.params;

        const result = await getResultByRollNumber(rollnumber);
        if (!result) return res.status(404).json({ message: 'Result not found for this roll number' });

        await updateResult(rollnumber, req.body);
        res.status(200).json({ message: 'Result updated successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Admin: Delete result
export const deleteResultByRollNumber = async (req, res) => {
    try {
        const { rollnumber } = req.params;

        const result = await getResultByRollNumber(rollnumber);
        if (!result) return res.status(404).json({ message: 'Result not found for this roll number' });

        await deleteResult(rollnumber);
        res.status(200).json({ message: 'Result deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Student/Admin: View result
export const getResult = async (req, res) => {
    try {
        const { rollnumber, student_name } = req.body;

        // Check if student exists in students table
        const [student] = await pool.query('SELECT * FROM students WHERE rollnumber = ? AND name = ?', [rollnumber, student_name]);
        if (!student.length) return res.status(404).json({ message: 'Student with this roll number and name is not found' });

        // Check if result exists
        const result = await getResultByRollNumber(rollnumber);
        if (!result) return res.status(404).json({ message: 'Result for this roll number is not found' });

        // Calculate total marks, percentage, and status
        const subjects = ['subject1','subject2','subject3','subject4','subject5','subject6'];
        let totalMarks = 0, obtainedMarks = 0;
        subjects.forEach(sub => { obtainedMarks += result[sub]; totalMarks += 100; });

        const percentage = (obtainedMarks / totalMarks) * 100;
        let status = 'Pass';
        for (let sub of subjects) if (result[sub] < 33) { status = 'Fail'; break; }

        // Return result
        res.status(200).json({
            rollnumber: result.rollnumber,
            name: student[0].name,
            class: student[0].class,
            subjects: {
                subject1: result.subject1,
                subject2: result.subject2,
                subject3: result.subject3,
                subject4: result.subject4,
                subject5: result.subject5,
                subject6: result.subject6
            },
            totalMarks,
            obtainedMarks,
            percentage: percentage.toFixed(2),
            status
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Admin: View all results
export const getAllResultsController = async (req, res) => {
    try {
        const results = await getAllResults();
        res.status(200).json(results);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
