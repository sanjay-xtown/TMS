import Tracking from './tracking.model.js';
import { AppError } from '../../shared/errorHandling/errorHandler.js';
import { emitBusLocation } from '../../shared/socket/socket.js';

/**
 * Update live GPS coordinates of a bus
 */
export const updateBusLocation = async (data) => {
  const { busId, latitude, longitude, speed, status } = data;

  let tracking = await Tracking.findOne({ where: { busId } });

  if (tracking) {
    tracking = await tracking.update({
      latitude,
      longitude,
      speed: speed ?? tracking.speed,
      status: status ?? tracking.status,
    });
  } else {
    tracking = await Tracking.create({
      busId,
      latitude,
      longitude,
      speed: speed ?? 0,
      status: status ?? 'active',
    });
  }

  // EMIT LIVE UPDATE VIA SOCKET.IO
  emitBusLocation(busId, {
    busId,
    latitude,
    longitude,
    speed: tracking.speed,
    status: tracking.status,
    updatedAt: tracking.updatedAt
  });

  return tracking;
};

/**
 * Get the latest live location of a specific bus
 */
export const getBusLocation = async (busId) => {
  const tracking = await Tracking.findOne({ 
    where: { busId }
  });

  if (!tracking) {
    throw new AppError('No tracking data found for this bus', 404);
  }

  return {
    busId: tracking.busId,
    // Note: busNumber would come from a Join with Bus model if it existed
    latitude: tracking.latitude,
    longitude: tracking.longitude,
    speed: tracking.speed,
    status: tracking.status,
    updatedAt: tracking.updatedAt
  };
};
