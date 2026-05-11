import express from "express";
import { updateLocation, getBusLocation, getBusLogs } from "./tracking.controller.js";
import { verifyToken } from "../../middleware/auth.middleware.js";
import { authorizeRoles } from "../../middleware/role.middleware.js";

const router = express.Router();

router.use(verifyToken);

// Update Location: DRIVER only
router.post("/location", authorizeRoles("DRIVER"), updateLocation);

// Get Live Location: ADMIN, SCHOOL_ADMIN, PARENT
router.get("/status/:busId", authorizeRoles("SUPER_ADMIN", "SCHOOL_ADMIN", "PARENT"), getBusLocation);

// Get History Logs: ADMIN, SCHOOL_ADMIN
router.get("/logs/:busId", authorizeRoles("SUPER_ADMIN", "SCHOOL_ADMIN"), getBusLogs);


export default router;
