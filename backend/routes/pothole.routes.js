import express from "express";
import { createPothole } from "../controllers/pothole.controller.js";
import { protect } from "../middleware/auth.middleware.js";
import { upload } from "../middleware/upload.middleware.js";

const router = express.Router();

router.post(
  "/",
  protect,
  upload.single("image"),
  createPothole
);

export default router;
