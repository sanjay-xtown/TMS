import express from "express";
import {
  createSchool,
  getAllSchools,
  getSchoolById,
  updateSchool,
  deleteSchool,
} from "./school.controller.js";
import { verifyToken } from "../../middleware/auth.middleware.js";
import { authorizeRoles } from "../../middleware/role.middleware.js";

const router = express.Router();

// All routes require authentication
router.use(verifyToken);

// GET routes: Allowed for SUPER_ADMIN and SCHOOL_ADMIN
router.get("/", authorizeRoles("SUPER_ADMIN", "SCHOOL_ADMIN"), getAllSchools);
router.get("/:id", authorizeRoles("SUPER_ADMIN", "SCHOOL_ADMIN"), getSchoolById);

// Mutation routes: Allowed ONLY for SUPER_ADMIN
router.post("/", authorizeRoles("SUPER_ADMIN"), createSchool);
router.put("/:id", authorizeRoles("SUPER_ADMIN"), updateSchool);
router.delete("/:id", authorizeRoles("SUPER_ADMIN"), deleteSchool);

export default router;
