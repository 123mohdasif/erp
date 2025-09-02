import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

export const protectResult = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) return res.status(401).json({ error: "No token provided" });

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ error: "Invalid token" });
    req.resultUser = user;
    next();
  });
};

export const authorizeResultRoles = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.resultUser.role)) {
      return res.status(403).json({ error: "Forbidden: You don’t have access" });
    }
    next();
  };
};
