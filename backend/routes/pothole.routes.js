import express from "express";
import {
  createPothole,
  getNearbyPotholes
} from "../controllers/pothole.controller.js";
import { protect } from "../middleware/auth.middleware.js";
import { upload } from "../middleware/upload.middleware.js";

const router = express.Router();

// ✅ Report pothole (already correct)
router.post(
  "/",
  protect,
  upload.single("image"),
  createPothole
);

// ✅ NEW: Get potholes near user
router.get(
  "/nearby",
  protect,
  getNearbyPotholes
);

export default router;
