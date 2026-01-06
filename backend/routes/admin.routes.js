import express from "express";
import {
  getAllPotholes,
  updatePotholeStatus
} from "../controllers/admin.controller.js";
import { protect, adminOnly } from "../middleware/auth.middleware.js";

const router = express.Router();

// GET potholes (sorting + filtering)
router.get("/potholes", protect, adminOnly, getAllPotholes);

// UPDATE pothole status
router.put("/potholes/:id/status", protect, adminOnly, updatePotholeStatus);

export default router;
