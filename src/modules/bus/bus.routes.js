import express from "express";
import {
  createBus,
  getAllBuses,
  getBusById,
  updateBus,
  deleteBus,
} from "./bus.controller.js";
import { verifyToken } from "../../middleware/auth.middleware.js";
import { authorizeRoles } from "../../middleware/role.middleware.js";

const router = express.Router();

router.use(verifyToken);

// GET routes: Allowed for SUPER_ADMIN, SCHOOL_ADMIN, and DRIVER
router.get("/", authorizeRoles("SUPER_ADMIN", "SCHOOL_ADMIN", "DRIVER"), getAllBuses);
router.get("/:id", authorizeRoles("SUPER_ADMIN", "SCHOOL_ADMIN", "DRIVER"), getBusById);

// Create/Update: Allowed for SUPER_ADMIN and SCHOOL_ADMIN
router.post("/", authorizeRoles("SUPER_ADMIN", "SCHOOL_ADMIN"), createBus);
router.put("/:id", authorizeRoles("SUPER_ADMIN", "SCHOOL_ADMIN"), updateBus);

// Delete: ONLY SUPER_ADMIN
router.delete("/:id", authorizeRoles("SUPER_ADMIN"), deleteBus);

export default router;
