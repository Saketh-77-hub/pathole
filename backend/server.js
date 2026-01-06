import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import authRoutes from "./routes/auth.routes.js";
import potholeRoutes from "./routes/pothole.routes.js"; // ✅ ADD
import path from "path"; // ✅ ADD
import adminRoutes from "./routes/admin.routes.js";
import cors from "cors";

dotenv.config();

const app = express();


// ✅ CORS CONFIG (VERY IMPORTANT)
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

app.use(express.json());

// ✅ CONNECT TO MONGODB ONLY ONCE
connectDB();

// ✅ Serve uploaded images
app.use("/uploads", express.static("uploads"));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/potholes", potholeRoutes); 
app.use("/api/admin", adminRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
