import fs from "fs";
import FormData from "form-data";
import axios from "axios";
import Pothole from "../models/Pothole.js";
import User from "../models/user.js";


export const createPothole = async (req, res) => {
  try {
    const { latitude, longitude } = req.body;

    if (!req.file)
      return res.status(400).json({ message: "Image is required" });

    if (!latitude || !longitude)
      return res
        .status(400)
        .json({ message: "Latitude and Longitude required" });

    // 1️⃣ Send image to AI service
    const formData = new FormData();
    formData.append("file", fs.createReadStream(req.file.path)); // Node.js file stream

    const aiResponse = await axios.post(
      "http://127.0.0.1:8000/detect",
      formData,
      { headers: formData.getHeaders() } // required for multipart/form-data
    );

    console.log("AI Service Response:", aiResponse.data);

    const { severity_score, severity_level } = aiResponse.data;

    // 2️⃣ Save pothole in MongoDB
    const pothole = await Pothole.create({
      imageUrl: `/uploads/${req.file.filename}`,
      severity: severity_score,
      severityLevel: severity_level,
      location: { latitude, longitude },
      detectedBy: req.user.id
    });

    // 3️⃣ Push pothole into user
    await User.findByIdAndUpdate(req.user.id, {
      $push: { potholes: pothole._id }
    });

    res.status(201).json({
      message: "Pothole reported successfully",
      pothole
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};
