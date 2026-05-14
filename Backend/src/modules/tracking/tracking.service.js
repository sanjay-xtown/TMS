import BusLiveLocation from './tracking.model.js';
import { Bus } from '../bus/bus.model.js';
import { AppError } from '../../shared/errorHandling/errorHandler.js';
import * as traccarService from '../../shared/services/traccar.service.js';

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
 * Get current live location for a specific bus or driver
 */
export const getBusLocation = async (idOrDeviceOrMobile) => {
  const isMobile = /^(\+?\d{1,3})?\d{10}$/.test(idOrDeviceOrMobile);
  const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(idOrDeviceOrMobile);
  
  let bus;
  if (isUuid) {
    bus = await Bus.findByPk(idOrDeviceOrMobile);
  } else if (isMobile) {
    bus = await Bus.findOne({ where: { driverMobileNumber: idOrDeviceOrMobile } });
    if (!bus && !idOrDeviceOrMobile.startsWith('+')) {
       const Op = (await import('sequelize')).Op;
       bus = await Bus.findOne({ 
         where: { 
           driverMobileNumber: { [Op.like]: `%${idOrDeviceOrMobile}` } 
         } 
       });
    }
  } else {
    bus = await Bus.findOne({ where: { gpsDeviceId: idOrDeviceOrMobile } });
  }

  if (!bus) throw new AppError('No bus found for the provided identifier (ID, Device, or Mobile)', 404);

  let trackingData = null;

  // 1. Try to fetch from Traccar if provider is TRACCAR
  if (bus.gpsProvider === 'TRACCAR') {
    try {
      let traccarPosition = null;
      let traccarDevice = null;
      
      if (bus.gpsDeviceId) {
        traccarPosition = await traccarService.getDevicePosition(bus.gpsDeviceId).catch(() => null);
        const isNumeric = typeof bus.gpsDeviceId === 'number' || /^\d+$/.test(String(bus.gpsDeviceId));
        const deviceRes = await traccarService.traccarApi.get('/api/devices', { 
          params: isNumeric ? { id: bus.gpsDeviceId } : { uniqueId: bus.gpsDeviceId } 
        }).catch(() => ({ data: [] }));
        
        if (deviceRes.data?.length > 0) traccarDevice = deviceRes.data[0];
      }
      
      if ((!traccarPosition || !traccarDevice) && bus.deviceIdentifier) {
        const device = await traccarService.findDeviceByUniqueId(bus.deviceIdentifier);
        if (device) {
          traccarDevice = device;
          traccarPosition = await traccarService.getDevicePosition(device.id).catch(() => null);
        }
      }

      if (traccarPosition) {
        const lastUpdateTime = traccarPosition.serverTime || traccarPosition.fixTime || traccarPosition.deviceTime;
        const fixTime = new Date(lastUpdateTime);
        const currentTime = new Date();
        const diffInSeconds = Math.floor(Math.abs((currentTime - fixTime) / 1000));

        let dynamicStatus = "OFFLINE";
        if (traccarDevice?.status === 'online' || diffInSeconds <= 3600) {
          dynamicStatus = "LIVE";
        }

        trackingData = {
          busId: bus.id,
          busNumber: bus.busNumber,
          busRegisterNumber: bus.busRegisterNumber,
          latitude: traccarPosition.latitude,
          longitude: traccarPosition.longitude,
          speed: dynamicStatus === "OFFLINE" ? 0 : (traccarPosition.speed || 0),
          trackingStatus: dynamicStatus,
          lastUpdated: fixTime,
          status: 'live',
          gpsProvider: 'TRACCAR',
          deviceId: traccarDevice?.id || bus.gpsDeviceId
        };
      }
    } catch (error) {
      console.error('Traccar fetching failed:', error.message);
    }
  }

  // 2. Fallback to local database if Traccar data is missing
  if (!trackingData) {
    const localLocation = await BusLiveLocation.findOne({ where: { busId: bus.id } });
    if (localLocation) {
      const lastUpdateTime = new Date(localLocation.timestamp);
      const diffInSeconds = Math.floor(Math.abs((new Date() - lastUpdateTime) / 1000));
      
      trackingData = {
        busId: bus.id,
        busNumber: bus.busNumber,
        busRegisterNumber: bus.busRegisterNumber,
        latitude: localLocation.latitude,
        longitude: localLocation.longitude,
        speed: diffInSeconds > 600 ? 0 : localLocation.speed,
        trackingStatus: diffInSeconds <= 300 ? 'LIVE' : 'OFFLINE',
        lastUpdated: localLocation.timestamp,
        status: 'live',
        gpsProvider: bus.gpsProvider || 'INTERNAL'
      };
    }
  }

  if (!trackingData) {
    return {
      busId: bus.id,
      busNumber: bus.busNumber,
      busRegisterNumber: bus.busRegisterNumber,
      latitude: null,
      longitude: null,
      speed: 0,
      trackingStatus: 'OFFLINE',
      lastUpdated: null,
      status: 'offline',
      gpsProvider: bus.gpsProvider || 'INTERNAL'
    };
  }

  return trackingData;
};

/**
 * Get current live locations for ALL buses (for Admin Dashboard)
 */
export const getAllFleetLocations = async () => {
  const buses = await Bus.findAll({
    include: [{
      model: BusLiveLocation,
      as: 'liveLocation'
    }]
  });

  return await Promise.all(buses.map(async (bus) => {
     // Use the refined getBusLocation logic for each bus to handle Traccar sync
     return await getBusLocation(bus.id).catch(() => ({
        busId: bus.id,
        busNumber: bus.busNumber,
        trackingStatus: 'OFFLINE'
     }));
  }));
};
