import * as busStatusService from "./busStatus.service.js";

/**
 * Handle GPS update from bus device
 */
export const updateLocation = async (req, res) => {
  try {
    const { busId, latitude, longitude, speed } = req.body;

    if (!busId || latitude === undefined || longitude === undefined || speed === undefined) {
      return res.status(400).json({
        success: false,
        message: "busId, latitude, longitude, and speed are required.",
      });
    }

    const updatedStatus = await busStatusService.updateBusLocationService({
      busId,
      latitude,
      longitude,
      speed,
    });

    return res.status(200).json({
      success: true,
      message: "Bus location updated successfully",
      data: updatedStatus,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error updating bus location",
      error: error.message,
    });
  }
};

/**
 * Get latest status of a bus
 */
export const getStatus = async (req, res) => {
  try {
    const { busId } = req.params;

    if (!busId) {
      return res.status(400).json({
        success: false,
        message: "busId is required.",
      });
    }

    const status = await busStatusService.getBusStatusService(busId);

    if (!status) {
      return res.status(404).json({
        success: false,
        message: "No status data found for this bus ID",
      });
    }

    return res.status(200).json({
      success: true,
      data: status,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error fetching bus status",
      error: error.message,
    });
  }
};

/**
 * Get logs for a bus
 */
export const getLogs = async (req, res) => {
  try {
    const { busId } = req.params;

    if (!busId) {
      return res.status(400).json({
        success: false,
        message: "busId is required.",
      });
    }

    const logs = await busStatusService.getBusLogsService(busId);

    return res.status(200).json({
      success: true,
      count: logs.length,
      data: logs,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error fetching bus logs",
      error: error.message,
    });
  }
};
