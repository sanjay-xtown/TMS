import * as trackingService from './tracking.service.js';
import { updateLocationSchema } from './tracking.schema.js';

export const updateLocation = async (req, res, next) => {
  try {
    const validatedData = updateLocationSchema.parse(req.body);
    const tracking = await trackingService.updateBusLocation(validatedData);
    res.status(200).json({
      status: 'success',
      data: tracking,
    });
  } catch (error) {
    next(error);
  }
};

export const getBusLiveLocation = async (req, res, next) => {
  try {
    const tracking = await trackingService.getBusLocation(req.params.busId);
    res.status(200).json({
      status: 'success',
      data: tracking,
    });
  } catch (error) {
    next(error);
  }
};
