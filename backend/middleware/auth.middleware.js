import jwt from "jsonwebtoken";

/**
 * Verify JWT
 */
export const protect = (req, res, next) => {
  let token = req.headers.authorization;

  if (!token || !token.startsWith("Bearer "))
    return res.status(401).json({ message: "Not authorized" });

  try {
    token = token.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // { id, role }
    next();
  } catch (error) {
    res.status(401).json({ message: "Invalid token" });
  }
};

/**
 * Admin Only
 */
export const adminOnly = (req, res, next) => {
  if (req.user.role !== "admin")
    return res.status(403).json({ message: "Admin access required" });

  next();
};
