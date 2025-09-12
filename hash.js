import bcrypt from "bcryptjs";

const password = "MaaChudiPadiHai@786"; // plain text password for admin
const hashed = await bcrypt.hash(password, 10);

console.log("Hashed password:", hashed);
