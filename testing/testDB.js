import db from "../config/db.js";

const testDB = async () => {
  try {
    const [rows] = await db.query("SELECT 1+1 AS result");
    console.log("DB works:", rows);
  } catch (err) {
    console.error("DB error:", err);
  }
};

testDB();
