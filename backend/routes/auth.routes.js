import express from "express";
import { register, login } from "../controllers/auth.controller.js";
import { protect, adminOnly } from "../middleware/auth.middleware.js";

const router = express.Router();

// Public routes
router.post("/register", register);
router.post("/login", login);

// Protected route example
router.get("/profile", protect, (req, res) => {
  res.json({
    message: "Profile accessed",
    user: req.user
  });
});

// Admin-only route example
router.get("/admin", protect, adminOnly, (req, res) => {
  res.json({ message: "Welcome Admin" });
});

export default router;
