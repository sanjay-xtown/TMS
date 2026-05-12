import SchoolAdminService from "./schooladmin.service.js";
import SchoolAdmin from "./schooladmin.model.js";

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const { token, admin } = await SchoolAdminService.login(email, password);
    res.status(200).json({
      success: true,
      token,
      admin: { id: admin.id, username: admin.username, email: admin.email, role: admin.role, schoolId: admin.schoolId }
    });
  } catch (error) {
    res.status(401).json({ success: false, message: error.message });
  }
};

export const getDashboardStats = async (req, res) => {
  try {
    const stats = await SchoolAdminService.getDashboardStats(req.user.schoolId);
    res.status(200).json({ success: true, stats });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Bus Management
export const getAllBuses = async (req, res) => {
  try {
    const buses = await SchoolAdminService.getAllBuses(req.user.schoolId);
    res.status(200).json({ success: true, data: buses });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const createBus = async (req, res) => {
  try {
    const bus = await SchoolAdminService.createBus(req.body, req.user.schoolId);
    res.status(201).json({ success: true, data: bus });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateBus = async (req, res) => {
  try {
    const bus = await SchoolAdminService.updateBus(req.params.id, req.body, req.user.schoolId);
    res.status(200).json({ success: true, data: bus });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteBus = async (req, res) => {
  try {
    await SchoolAdminService.deleteBus(req.params.id, req.user.schoolId);
    res.status(200).json({ success: true, message: "Bus deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Driver Management
export const getAllDrivers = async (req, res) => {
  try {
    const drivers = await SchoolAdminService.getAllDrivers(req.user.schoolId);
    res.status(200).json({ success: true, data: drivers });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const createDriver = async (req, res) => {
  try {
    const driver = await SchoolAdminService.createDriver(req.body, req.user.schoolId);
    res.status(201).json({ success: true, data: driver });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateDriver = async (req, res) => {
  try {
    const driver = await SchoolAdminService.updateDriver(req.params.id, req.body, req.user.schoolId);
    res.status(200).json({ success: true, data: driver });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteDriver = async (req, res) => {
  try {
    await SchoolAdminService.deleteDriver(req.params.id, req.user.schoolId);
    res.status(200).json({ success: true, message: "Driver deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Route Management
export const getAllRoutes = async (req, res) => {
  try {
    const routes = await SchoolAdminService.getAllRoutes(req.user.schoolId);
    res.status(200).json({ success: true, data: routes });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const createRoute = async (req, res) => {
  try {
    const route = await SchoolAdminService.createRoute(req.body, req.user.schoolId);
    res.status(201).json({ success: true, data: route });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateRoute = async (req, res) => {
  try {
    const route = await SchoolAdminService.updateRoute(req.params.id, req.body, req.user.schoolId);
    res.status(200).json({ success: true, data: route });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteRoute = async (req, res) => {
  try {
    await SchoolAdminService.deleteRoute(req.params.id, req.user.schoolId);
    res.status(200).json({ success: true, message: "Route deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Bus Assignment
export const assignBusToRoute = async (req, res) => {
  try {
    const { busId, routeId } = req.body;
    const bus = await SchoolAdminService.assignBusToRoute(busId, routeId, req.user.schoolId);
    res.status(200).json({ success: true, message: "Bus assigned to route", data: bus });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Student View
export const getAllStudents = async (req, res) => {
  try {
    const students = await SchoolAdminService.getAllStudents(req.user.schoolId);
    res.status(200).json({ success: true, data: students });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Seed Helper
export const seedSchoolAdmin = async (req, res) => {
  try {
    const { username, email, password, schoolId } = req.body;
    const exists = await SchoolAdmin.findOne({ where: { email } });
    if (exists) return res.status(400).json({ message: "Admin already exists" });

    const admin = await SchoolAdmin.create({ username, email, password, schoolId });
    res.status(201).json({ success: true, data: admin });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
}

