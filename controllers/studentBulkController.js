import xlsx from "xlsx";
import fs from "fs";
import bcrypt from "bcryptjs";
import { bulkInsertStudents } from "../model/studentBulkModel.js";

export const uploadStudentsFromExcel = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: "No file uploaded" });

    // Read Excel file
    const workbook = xlsx.readFile(req.file.path);
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    const data = xlsx.utils.sheet_to_json(sheet);

    // Hash passwords
    const students = await Promise.all(
      data.map(async (row) => ({
        name: row.name,
        email: row.email,
        password: await bcrypt.hash(row.password, 10), // hash password
        rollnumber: row.rollnumber,
        class: row.class,
        role: row.role || "student", // default student
      }))
    );

    // Insert into DB
    await bulkInsertStudents(students);

    // Remove file after processing
    fs.unlinkSync(req.file.path);

    res.status(201).json({ message: "Students uploaded successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Something went wrong" });
  }
};
