import fs from "fs";
import FormData from "form-data";
import axios from "axios";
import Pothole from "../models/pothole.js";
import User from "../models/user.js";

export const createPothole = async (req, res) => {
  try {
    const { latitude, longitude } = req.body;

    if (!req.file) {
      return res.status(400).json({ message: "Image is required" });
    }

    if (!latitude || !longitude) {
      return res
        .status(400)
        .json({ message: "Latitude and Longitude required" });
    }

    // 1️⃣ Send image to AI service
    const formData = new FormData();
    formData.append("file", fs.createReadStream(req.file.path));

    const aiResponse = await axios.post(
      "http://127.0.0.1:8000/detect",
      formData,
      { headers: formData.getHeaders() }
    );

    const { severity_score, severity_level } = aiResponse.data;

    // 2️⃣ Save pothole in MongoDB (✅ GEOJSON)
    const pothole = await Pothole.create({
      imageUrl: `/uploads/${req.file.filename}`,
      severity: severity_score,
      severityLevel: severity_level,
      location: {
        type: "Point",
        coordinates: [Number(longitude), Number(latitude)]
      },
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



export const getNearbyPotholes = async (req, res) => {
  try {
    const { lat, lng, radius = 300 } = req.query;

    if (!lat || !lng) {
      return res.status(400).json({ message: "lat & lng required" });
    }

    const potholes = await Pothole.find({
      location: {
        $near: {
          $geometry: {
            type: "Point",
            coordinates: [Number(lng), Number(lat)]
          },
          $maxDistance: Number(radius) // meters
        }
      },
      status: "reported"
    });

    res.json(potholes);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};
