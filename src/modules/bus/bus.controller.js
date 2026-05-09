import { Bus } from "./bus.model.js";
import { School } from "../school/school.model.js";

// Helper to check if user is admin
const isUserAdmin = (role) => ["SUPER_ADMIN", "SCHOOL_ADMIN"].includes(role);

// CREATE BUS
export const createBus = async (req, res) => {
  try {
    const { 
      busNumber, 
      busName, 
      capacity, 
      gpsDeviceId, 
      routeName, 
      schoolId, 
      driverName, 
      driverPhoneNumber 
    } = req.body;

    // 1. Validate duplicate busNumber
    const existingBus = await Bus.findOne({ where: { busNumber } });
    if (existingBus) {
      return res.status(400).json({ message: "Bus number already exists" });
    }

    // 2. Validate school existence
    const school = await School.findByPk(schoolId);
    if (!school) {
      return res.status(404).json({ message: "School not found" });
    }

    // 3. Create bus with new driver fields
    const bus = await Bus.create({
      busNumber,
      busName,
      capacity,
      gpsDeviceId,
      routeName,
      schoolId,
      driverName,
      driverPhoneNumber,
    });

    res.status(201).json({
      message: "Bus created successfully",
      bus,
    });
  } catch (error) {
    res.status(500).json({ message: "Error creating bus", error: error.message });
  }
};

// GET ALL BUSES
export const getAllBuses = async (req, res) => {
  try {
    const buses = await Bus.findAll({
      include: [
        { model: School, as: "school", attributes: ["id", "schoolName"] },
      ],
    });

    const isAdmin = isUserAdmin(req.user.role);

    // Hide driverPhoneNumber for non-admins
    const formattedBuses = buses.map((bus) => {
      const busData = bus.toJSON();
      if (!isAdmin) {
        delete busData.driverPhoneNumber;
      }
      return busData;
    });

    res.status(200).json({
      message: "Buses retrieved successfully",
      count: formattedBuses.length,
      buses: formattedBuses,
    });
  } catch (error) {
    res.status(500).json({ message: "Error fetching buses", error: error.message });
  }
};

// GET BUS BY ID
export const getBusById = async (req, res) => {
  try {
    const { id } = req.params;
    const bus = await Bus.findByPk(id, {
      include: [
        { model: School, as: "school", attributes: ["id", "schoolName", "address"] },
      ],
    });

    if (!bus) {
      return res.status(404).json({ message: "Bus not found" });
    }

    const isAdmin = isUserAdmin(req.user.role);
    const busData = bus.toJSON();

    // Hide driverPhoneNumber for non-admins
    if (!isAdmin) {
      delete busData.driverPhoneNumber;
    }

    res.status(200).json({
      message: "Bus retrieved successfully",
      bus: busData,
    });
  } catch (error) {
    res.status(500).json({ message: "Error fetching bus", error: error.message });
  }
};

// UPDATE BUS
export const updateBus = async (req, res) => {
  try {
    const { id } = req.params;
    const { 
      busNumber, 
      busName, 
      capacity, 
      gpsDeviceId, 
      routeName, 
      schoolId, 
      driverName, 
      driverPhoneNumber 
    } = req.body;

    const bus = await Bus.findByPk(id);
    if (!bus) {
      return res.status(404).json({ message: "Bus not found" });
    }

    // Validate duplicate busNumber if changed
    if (busNumber && busNumber !== bus.busNumber) {
      const existing = await Bus.findOne({ where: { busNumber } });
      if (existing) {
        return res.status(400).json({ message: "Another bus already uses this number" });
      }
    }

    // Validate school if changed
    if (schoolId) {
      const school = await School.findByPk(schoolId);
      if (!school) return res.status(404).json({ message: "School not found" });
    }

    await bus.update({
      busNumber: busNumber || bus.busNumber,
      busName: busName || bus.busName,
      capacity: capacity || bus.capacity,
      gpsDeviceId: gpsDeviceId !== undefined ? gpsDeviceId : bus.gpsDeviceId,
      routeName: routeName || bus.routeName,
      schoolId: schoolId || bus.schoolId,
      driverName: driverName || bus.driverName,
      driverPhoneNumber: driverPhoneNumber || bus.driverPhoneNumber,
    });

    res.status(200).json({
      message: "Bus updated successfully",
      bus,
    });
  } catch (error) {
    res.status(500).json({ message: "Error updating bus", error: error.message });
  }
};

// DELETE BUS
export const deleteBus = async (req, res) => {
  try {
    const { id } = req.params;
    const bus = await Bus.findByPk(id);

    if (!bus) {
      return res.status(404).json({ message: "Bus not found" });
    }

    await bus.destroy();

    res.status(200).json({
      message: "Bus deleted successfully",
    });
  } catch (error) {
    res.status(500).json({ message: "Error deleting bus", error: error.message });
  }
};
