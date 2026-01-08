import mongoose from "mongoose";

const potholeSchema = new mongoose.Schema(
  {
    imageUrl: {
      type: String,
      required: true
    },

    severity: {
      type: Number,
      required: true,
      min: 0,
      max: 100
    },

    // ✅ CHANGE THIS
    location: {
      type: {
        type: String,
        enum: ["Point"],
        required: true,
        default: "Point"
      },
      coordinates: {
        type: [Number], // [longitude, latitude]
        required: true
      }
    },

    detectedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    status: {
      type: String,
      enum: ["reported", "in_progress", "repaired"],
      default: "reported"
    }
  },
  { timestamps: true }
);

// ✅ REQUIRED for geospatial queries
potholeSchema.index({ location: "2dsphere" });

export default mongoose.model("Pothole", potholeSchema);
