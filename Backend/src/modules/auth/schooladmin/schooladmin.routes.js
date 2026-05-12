import express from "express";
import {
  login,
  getDashboardStats,
  getAllBuses,
  createBus,
  updateBus,
  deleteBus,
  getAllDrivers,
  createDriver,
  updateDriver,
  deleteDriver,
  getAllRoutes,
  createRoute,
  updateRoute,
  deleteRoute,
  assignBusToRoute,
  getAllStudents,
  seedSchoolAdmin
} from "./schooladmin.controller.js";
import { verifyToken } from "../../../middleware/auth.middleware.js";
import { authorizeRoles } from "../../../middleware/role.middleware.js";

const router = express.Router();

// Public routes
router.post("/login", login);
router.post("/seed", seedSchoolAdmin);

// Protected routes (SchoolAdmin only)
router.use(verifyToken);
router.use(authorizeRoles("schooladmin"));

router.get("/dashboard-stats", getDashboardStats);

// Bus Management
router.get("/buses", getAllBuses);
router.post("/buses", createBus);
router.put("/buses/:id", updateBus);
router.delete("/buses/:id", deleteBus);

// Driver Management
router.get("/drivers", getAllDrivers);
router.post("/drivers", createDriver);
router.put("/drivers/:id", updateDriver);
router.delete("/drivers/:id", deleteDriver);

// Route Management
router.get("/routes", getAllRoutes);
router.post("/routes", createRoute);
router.put("/routes/:id", updateRoute);
router.delete("/routes/:id", deleteRoute);

// Bus Assignment
router.put("/assign-route", assignBusToRoute);

// Student View
router.get("/students", getAllStudents);

export default router;

