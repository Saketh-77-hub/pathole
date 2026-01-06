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

    location: {
      latitude: {
        type: Number,
        required: true
      },
      longitude: {
        type: Number,
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
  {
    timestamps: true
  }
);

const Pothole =
  mongoose.models.Pothole || mongoose.model("Pothole", potholeSchema);

export default Pothole;
