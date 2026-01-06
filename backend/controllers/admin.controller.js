import Pothole from "../models/pothole.js";

/**
 * GET ALL POTHOLES WITH FILTERS
 * Query Params:
 *   status = "reported" | "in-progress" | "fixed"
 *   sort = "low" | "high" (severity)
 */
export const getAllPotholes = async (req, res) => {
  try {
    const { status, sort } = req.query;

    const query = {};

    if (status) {
      // Validate status
      const allowedStatus = ["reported", "in-progress", "fixed"];
      if (!allowedStatus.includes(status)) {
        return res.status(400).json({ message: "Invalid status filter" });
      }
      query.status = status;
    }

    // Default sort: newest first
    let sortOption = { createdAt: -1 };

    if (sort === "low") {
      sortOption = { severity: 1 }; // Low → High
    } else if (sort === "high") {
      sortOption = { severity: -1 }; // High → Low
    }

    const potholes = await Pothole.find(query)
      .populate("detectedBy", "name email")
      .sort(sortOption);

    res.json({ potholes });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};



/**
 * UPDATE POTHOLE STATUS (Admin Only)
 * Body: { status: "reported" | "in-progress" | "fixed" }
 */
export const updatePotholeStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const allowedStatus = ["reported", "in-progress", "fixed"];

    if (!allowedStatus.includes(status)) {
      return res.status(400).json({ message: "Invalid status value" });
    }

    const pothole = await Pothole.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    if (!pothole) {
      return res.status(404).json({ message: "Pothole not found" });
    }

    res.json({
      message: "Pothole status updated successfully",
      pothole
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
