import express from "express";
import * as busStatusController from "./busStatus.controller.js";

const router = express.Router();

// Update bus location (receive GPS data)
router.post("/location", busStatusController.updateLocation);

// Get latest bus status
router.get("/status/:busId", busStatusController.getStatus);

// Get movement history logs
router.get("/logs/:busId", busStatusController.getLogs);

export default router;
