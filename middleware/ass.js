import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

// This single middleware function handles both authentication (is the token valid?)
// and authorization (does the user have the right role?).
export const protectAndAuthorize = (...allowedRoles) => {
  return (req, res, next) => {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1]; // Bearer <token>

    if (!token) {
      return res.status(401).json({ error: "Access Denied. No Token Provided." });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
      if (err) {
        // This handles cases like an expired or malformed token.
        return res.status(403).json({ error: "Invalid or expired token." });
      }

      // At this point, the token is valid. Now we check the role.
      // The 'user' object here is the decoded payload from the JWT.
      if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
        // This user has a valid token, but their role is not permitted for this route.
        return res.status(403).json({ error: "Forbidden: You do not have the necessary permissions." });
      }

      // If we reach here, the user is authenticated and authorized.
      req.user = user; // Attach user info to the request object for later use.
      next(); // Proceed to the next middleware or the controller.
    });
  };
};