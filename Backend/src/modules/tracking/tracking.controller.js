import * as trackingService from './tracking.service.js';
import { liveLocationSchema } from './tracking.schema.js';

export const updateLiveLocation = async (req, res, next) => {
  try {
    const locationData = liveLocationSchema.parse(req.body);
    const result = await trackingService.updateLiveLocation(locationData);

    res.status(200).json({
      status: 'success',
      message: 'Live location updated successfully',
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export const getBusLocation = async (req, res, next) => {
  try {
    const { busId } = req.params;
    const location = await trackingService.getBusLocation(busId);

    res.status(200).json({
      status: 'success',
      data: location,
    });
  } catch (error) {
    next(error);
  }
};

export const getAllFleetLocations = async (req, res, next) => {
  try {
    const fleetStatus = await trackingService.getAllFleetLocations();
    res.status(200).json({
      status: 'success',
      count: fleetStatus.length,
      data: fleetStatus,
    });
  } catch (error) {
    next(error);
  }
};
