import bcrypt from "bcryptjs";

const password = "AdmIn@1234"; // plain text password for admin
const hashed = await bcrypt.hash(password, 10);

console.log("Hashed password:", hashed);
