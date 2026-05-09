import { Parent, Student, Tracking } from '../../models/initmodels.js';
import { AppError } from '../../shared/errorHandling/errorHandler.js';

/**
 * Fetch detailed dashboard data for a parent
 * - Profile info
 * - Children list
 * - Bus trip status
 * - Live tracking (only if trip is active)
 */
export const getParentDashboardData = async (parentId) => {
  // 1. Get Parent Profile
  const parent = await Parent.findByPk(parentId, {
    attributes: { exclude: ['password'] }
  });

  if (!parent) {
    throw new AppError('Parent not found', 404);
  }

  // 2. Get Children and their current bus assignment
  const children = await Student.findAll({
    where: { parentId },
    attributes: ['id', 'studentName', 'class', 'section', 'pickupPoint', 'currentBusId', 'schoolId']
  });

  // 3. Process each child for tracking and status
  const childrenData = await Promise.all(children.map(async (child) => {
    let trackingData = null;
    let displayMessage = "No active trip available";
    let isTrackingVisible = false;

    if (child.currentBusId) {
      // Fetch latest tracking/trip status for the assigned bus
      const busTracking = await Tracking.findOne({
        where: { busId: child.currentBusId },
        attributes: ['latitude', 'longitude', 'speed', 'status', 'updatedAt']
      });

      if (busTracking) {
        const status = busTracking.status;

        // TRACKING VISIBILITY RULES
        if (status === 'morning_pickup' || status === 'evening_drop') {
          isTrackingVisible = true;
          trackingData = {
            latitude: busTracking.latitude,
            longitude: busTracking.longitude,
            speed: busTracking.speed,
            updatedAt: busTracking.updatedAt
          };
          displayMessage = status === 'morning_pickup' ? "Bus is on the way for pickup" : "Bus is on the way for drop";
        } else {
          // STATUS MESSAGE RULES
          switch (status) {
            case 'school_reached':
              displayMessage = "Student safely reached school";
              break;
            case 'trip_completed':
              displayMessage = "Student safely reached home";
              break;
            case 'private_use':
              displayMessage = "No active trip available";
              break;
            case 'holiday':
              displayMessage = "Holiday - No transport service";
              break;
            case 'breakdown':
              displayMessage = "Bus breakdown. Emergency transfer in progress";
              break;
            case 'maintenance':
              displayMessage = "Bus is under maintenance";
              break;
            default:
              displayMessage = "No active trip available";
          }
        }
      }
    }

    return {
      studentId: child.id,
      studentName: child.studentName,
      class: `${child.class}-${child.section}`,
      pickupPoint: child.pickupPoint,
      busId: child.currentBusId,
      statusMessage: displayMessage,
      isTrackingVisible,
      tracking: trackingData
    };
  }));

  return {
    parentProfile: parent,
    children: childrenData
  };
};
