import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

export const protect = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1]; // Bearer <token>

  if (!token) return res.status(401).json({ error: "Access Denied. No Token Provided." });

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ error: "Invalid Token" });

    req.user = user; // { id, role }
    next();
  });
};

export const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ error: "Forbidden: You don’t have access" });
    }
    next();
  };
};
