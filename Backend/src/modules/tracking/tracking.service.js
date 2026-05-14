import BusLiveLocation from './tracking.model.js';
import { Bus } from '../bus/bus.model.js';
import { AppError } from '../../shared/errorHandling/errorHandler.js';
import traccarService from './traccar.service.js';

/**
 * Update live location based on GPS device data
 */
export const updateLiveLocation = async (locationData) => {
  const { gpsDeviceId, busId, driverMobileNumber, latitude, longitude, speed, status, timestamp } = locationData;

  let bus;
  if (gpsDeviceId) {
    bus = await Bus.findOne({ where: { gpsDeviceId } });
  } else if (busId) {
    bus = await Bus.findByPk(busId);
  } else if (driverMobileNumber) {
    bus = await Bus.findOne({ where: { driverMobileNumber } });
    if (!bus && !driverMobileNumber.startsWith('+')) {
       const { Op } = await import('sequelize');
       bus = await Bus.findOne({ 
         where: { 
           driverMobileNumber: { [Op.like]: `%${driverMobileNumber}` } 
         } 
       });
    }
  }

  if (!bus) {
    throw new AppError(`No bus found for the provided ID, Device, or Mobile Number.`, 404);
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

  // Trigger proximity notifications in the background
  checkAndNotifyParents(bus.id, latitude, longitude).catch(err => 
    console.error('[Notification] Proximity check failed:', err.message)
  );

  return liveLocation;
};

/**
 * Haversine formula to calculate distance between two points in KM
 */
function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371; // Earth radius in km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

/**
 * Check distances and send notifications to parents
 */
export const checkAndNotifyParents = async (busId, currentLat, currentLng) => {
  try {
    const { default: Student } = await import('../student/student.model.js');
    const { default: Parent } = await import('../parent/parent.model.js');
    const { sendBusAlert } = await import('../../services/notification.service.js');

    // Find all students on this bus
    const students = await Student.findAll({
      where: { currentBusId: busId },
      include: [{ model: Parent, as: 'parent' }]
    });

    for (const student of students) {
      if (student.parent && student.parent.fcmToken && student.pickupLat && student.pickupLng) {
        const distance = calculateDistance(
          currentLat, 
          currentLng, 
          student.pickupLat, 
          student.pickupLng
        );

        // If bus is within 2KM, send notification
        if (distance <= 2.0) {
          // In a real production app, we'd check if we already sent this in the last X minutes
          // For now, we'll trigger it.
          await sendBusAlert(student.parent, 'BUS_ARRIVING', student.currentBusId);
        }
      }
    }
  } catch (error) {
    console.error('[Notification] Error in checkAndNotifyParents:', error.message);
  }
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
      // Use gpsDeviceId (internal Traccar ID) or deviceIdentifier (Unique IMEI)
      let traccarPosition = null;
      
      let traccarDevice = null;
      
      // 1. Resolve Device & Position
      if (bus.gpsDeviceId) {
        traccarPosition = await traccarService.getDevicePosition(bus.gpsDeviceId).catch(() => null);
        
        // Fetch device status using either internal ID or unique ID
        const isNumeric = typeof bus.gpsDeviceId === 'number' || /^\d+$/.test(String(bus.gpsDeviceId));
        const deviceRes = await traccarService.traccarApi.get('/api/devices', { 
          params: isNumeric ? { id: bus.gpsDeviceId } : { uniqueId: bus.gpsDeviceId } 
        }).catch(() => ({ data: [] }));
        
        if (deviceRes.data?.length > 0) traccarDevice = deviceRes.data[0];
      }
      
      // 2. Fallback to Unique ID (IMEI) if internal ID lookup failed
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

        // High-Tolerance Status Logic:
        // - LIVE if Traccar reports 'online'
        // - LIVE if the last update was within 3600 seconds (1 hour)
        // - OFFLINE only if device is strictly 'offline' AND older than 1 hour
        let dynamicStatus = "OFFLINE";
        if (traccarDevice?.status === 'online' || diffInSeconds <= 3600) {
          dynamicStatus = "LIVE";
        }

        console.log(`[Tracking] Bus: ${bus.busNumber}, Traccar: ${traccarDevice?.status || 'unknown'}, Diff: ${diffInSeconds}s -> Final: ${dynamicStatus}`);

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
      // We will fallback to local storage if Traccar fails
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
        trackingStatus: diffInSeconds <= 300 ? 'LIVE' : 'OFFLINE', // 5 min threshold for LIVE
        lastUpdated: localLocation.timestamp,
        status: 'live',
        gpsProvider: bus.gpsProvider || 'INTERNAL'
      };
    }
  }

  if (!trackingData) {
    console.warn(`[Tracking] Real-time data missing for ${idOrDeviceOrMobile}`);
    throw new AppError('No live location data found for this bus/driver', 404);
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

  return buses.map(bus => {
    const loc = bus.liveLocation;
    const lastUpdate = loc ? new Date(loc.timestamp) : null;
    const diffInSeconds = lastUpdate ? Math.floor(Math.abs((new Date() - lastUpdate) / 1000)) : null;

    return {
      id: bus.id,
      busNumber: bus.busNumber,
      busRegisterNumber: bus.busRegisterNumber,
      driverName: bus.driverName,
      latitude: loc?.latitude || null,
      longitude: loc?.longitude || null,
      speed: (diffInSeconds && diffInSeconds < 600) ? loc.speed : 0,
      trackingStatus: (diffInSeconds && diffInSeconds <= 300) ? 'LIVE' : 'OFFLINE',
      lastUpdated: loc?.timestamp || null,
      gpsProvider: bus.gpsProvider,
      routeName: bus.routeName
    };
  });
};
