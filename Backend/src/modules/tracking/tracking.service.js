import BusLiveLocation from './tracking.model.js';
import { Bus } from '../bus/bus.model.js';
import { AppError } from '../../shared/errorHandling/errorHandler.js';

/**
 * Update live location based on GPS device data
 */
export const updateLiveLocation = async (locationData) => {
  const { gpsDeviceId, busId, latitude, longitude, speed, status, timestamp } = locationData;

  let bus;
  if (gpsDeviceId) {
    bus = await Bus.findOne({ where: { gpsDeviceId } });
  } else if (busId) {
    bus = await Bus.findByPk(busId);
  }

  if (!bus) {
    throw new AppError(`No bus found assigned to the provided ID/Device.`, 404);
  }

  const finalGpsDeviceId = gpsDeviceId || bus.gpsDeviceId;

  // 2. Update or Create live location record
  // We use upsert to maintain only one live location per busId/gpsDeviceId
  const [liveLocation] = await BusLiveLocation.upsert({
    busId: bus.id,
    gpsDeviceId: finalGpsDeviceId,
    latitude,
    longitude,
    speed,
    status: status || 'morning_pickup', // Fallback for simulation
    timestamp: timestamp ? new Date(timestamp) : new Date(),
  });

  return liveLocation;
};

/**
 * Get current live location for a specific bus
 */
export const getBusLocation = async (busId) => {
  const location = await BusLiveLocation.findOne({
    where: { busId },
    include: [
      {
        model: Bus,
        as: 'bus',
        attributes: ['busRegisterNumber', 'busNumber', 'driverName', 'driverPhoneNumber']
      }
    ]
  });

  if (!location) {
    throw new AppError('No live location data found for this bus', 404);
  }

  return location;
};
