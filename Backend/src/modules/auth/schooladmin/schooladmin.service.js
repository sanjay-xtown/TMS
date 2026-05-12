import SchoolAdmin from "./schooladmin.model.js";
import Bus from "../../bus/bus.model.js";
import Driver from "./driver.model.js";
import Route from "./route.model.js";
import Student from "../../student/student.model.js";
import jwt from "jsonwebtoken";

class SchoolAdminService {
  async login(email, password) {
    const admin = await SchoolAdmin.findOne({ where: { email } });
    if (!admin || !(await admin.comparePassword(password))) {
      throw new Error("Invalid email or password");
    }

    const token = jwt.sign(
      { id: admin.id, role: admin.role, email: admin.email, schoolId: admin.schoolId },
      process.env.JWT_SECRET || "fallback_secret",
      { expiresIn: "1d" }
    );

    return { token, admin };
  }

  async getDashboardStats(schoolId) {
    const [buses, drivers, routes, students] = await Promise.all([
      Bus.count({ where: { schoolId } }),
      Driver.count({ where: { schoolId } }),
      Route.count({ where: { schoolId } }),
      Student.count({ where: { schoolId } }),
    ]);
    return { totalBuses: buses, totalDrivers: drivers, totalRoutes: routes, totalStudents: students };
  }

  // Bus Management
  async getAllBuses(schoolId) {
    return await Bus.findAll({ where: { schoolId } });
  }

  async createBus(data, schoolId) {
    return await Bus.create({ ...data, schoolId });
  }

  async updateBus(id, data, schoolId) {
    const bus = await Bus.findOne({ where: { id, schoolId } });
    if (!bus) throw new Error("Bus not found");
    return await bus.update(data);
  }

  async deleteBus(id, schoolId) {
    const bus = await Bus.findOne({ where: { id, schoolId } });
    if (!bus) throw new Error("Bus not found");
    return await bus.destroy();
  }

  // Driver Management
  async getAllDrivers(schoolId) {
    return await Driver.findAll({ where: { schoolId } });
  }

  async createDriver(data, schoolId) {
    return await Driver.create({ ...data, schoolId });
  }

  async updateDriver(id, data, schoolId) {
    const driver = await Driver.findOne({ where: { id, schoolId } });
    if (!driver) throw new Error("Driver not found");
    return await driver.update(data);
  }

  async deleteDriver(id, schoolId) {
    const driver = await Driver.findOne({ where: { id, schoolId } });
    if (!driver) throw new Error("Driver not found");
    return await driver.destroy();
  }

  // Route Management
  async getAllRoutes(schoolId) {
    return await Route.findAll({ where: { schoolId } });
  }

  async createRoute(data, schoolId) {
    return await Route.create({ ...data, schoolId });
  }

  async updateRoute(id, data, schoolId) {
    const route = await Route.findOne({ where: { id, schoolId } });
    if (!route) throw new Error("Route not found");
    return await route.update(data);
  }

  async deleteRoute(id, schoolId) {
    const route = await Route.findOne({ where: { id, schoolId } });
    if (!route) throw new Error("Route not found");
    return await route.destroy();
  }

  // Bus Assignment
  async assignBusToRoute(busId, routeId, schoolId) {
    const bus = await Bus.findOne({ where: { id: busId, schoolId } });
    if (!bus) throw new Error("Bus not found");
    return await bus.update({ routeId });
  }

  // Student View
  async getAllStudents(schoolId) {
    return await Student.findAll({ where: { schoolId } });
  }
}

export default new SchoolAdminService();

