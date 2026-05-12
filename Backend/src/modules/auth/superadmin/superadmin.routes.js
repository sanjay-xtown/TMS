import express from "express";
import {
  login,
  createSchool,
  updateSchoolStatus,
  getAllSchools,
  getAllSchoolAdmins,
  getDashboardStats,
  seedSuperAdmin
} from "./superadmin.controller.js";
import { verifyToken } from "../../../middleware/auth.middleware.js";
import { authorizeRoles } from "../../../middleware/role.middleware.js";

const router = express.Router();

// Public routes
router.post("/login", login);
router.post("/seed", seedSuperAdmin); // For initial setup

// Protected routes (SuperAdmin only)
router.use(verifyToken);
router.use(authorizeRoles("superadmin"));

router.get("/dashboard-stats", getDashboardStats);
router.post("/schools", createSchool);
router.put("/schools/:id/status", updateSchoolStatus);
router.get("/schools", getAllSchools);
router.get("/school-admins", getAllSchoolAdmins);

export default router;

