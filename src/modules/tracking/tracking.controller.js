import { Bus } from "../bus/bus.model.js";
import { BusLog } from "../bus/busLog.model.js";

// UPDATE BUS LOCATION (DRIVER ONLY)
export const updateLocation = async (req, res) => {
  try {
    const { busId, latitude, longitude, speed } = req.body;

    const bus = await Bus.findByPk(busId);
    if (!bus) {
      return res.status(404).json({ message: "Bus not found" });
    }

    // Determine status based on speed
    const status = speed > 5 ? "moving" : "stopped";

    // 1. Update current bus status
    await bus.update({
      latitude,
      longitude,
      speed,
      status,
      lastUpdated: new Date(),
    });

    // 2. Store in history (BusLog)
    await BusLog.create({
      busId,
      latitude,
      longitude,
      speed,
      status,
    });

    res.status(200).json({
      message: "Location updated successfully",
      status,
      currentLocation: { latitude, longitude, speed },
    });
  } catch (error) {
    res.status(500).json({ message: "Error updating location", error: error.message });
  }
};

// GET BUS LIVE DATA (PARENT / ADMIN / SCHOOL_ADMIN)
export const getBusLocation = async (req, res) => {
  try {
    const { busId } = req.params;
    const bus = await Bus.findByPk(busId, {
      attributes: ["id", "busNumber", "latitude", "longitude", "speed", "status", "lastUpdated"],
    });

    if (!bus) {
      return res.status(404).json({ message: "Bus not found" });
    }

    res.status(200).json({
      message: "Bus location retrieved",
      bus,
    });
  } catch (error) {
    res.status(500).json({ message: "Error fetching location", error: error.message });
  }
};

// GET BUS LOGS / HISTORY
export const getBusLogs = async (req, res) => {
  try {
    const { busId } = req.params;
    const logs = await BusLog.findAll({
      where: { busId },
      order: [["createdAt", "DESC"]],
      limit: 50, // Last 50 updates
    });

    res.status(200).json({
      message: "Bus logs retrieved",
      count: logs.length,
      logs,
    });
  } catch (error) {
    res.status(500).json({ message: "Error fetching logs", error: error.message });
  }
};


