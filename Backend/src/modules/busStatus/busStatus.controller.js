import * as busStatusService from "./busStatus.service.js";
import { updateBusStatusSchema } from "./busStatus.schema.js";

/**
 * Handle GPS update from bus device
 */
export const updateLocation = async (req, res, next) => {
  try {
    const busData = updateBusStatusSchema.parse(req.body);
    const updatedStatus = await busStatusService.updateBusLocationService(busData);

    return res.status(200).json({
      status: 'success',
      message: "Bus location updated successfully",
      data: updatedStatus,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get latest status of a bus
 */
export const getStatus = async (req, res, next) => {
  try {
    const { busId } = req.params;
    const status = await busStatusService.getBusStatusService(busId);

    return res.status(200).json({
      status: 'success',
      data: status,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get logs for a bus
 */
export const getLogs = async (req, res, next) => {
  try {
    const { busId } = req.params;
    const logs = await busStatusService.getBusLogsService(busId);

    return res.status(200).json({
      status: 'success',
      count: logs.length,
      data: logs,
    });
  } catch (error) {
    next(error);
  }
};
