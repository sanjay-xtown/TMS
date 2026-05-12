import express from 'express';
import * as trackingController from './tracking.controller.js';
import { authMiddleware } from '../../shared/middleware/authMiddleware.js';

const router = express.Router();

/**
 * @route   POST /api/tracking/live-location
 * @desc    Receive GPS data from hardware device (Public or device-specific auth)
 * @access  Public (Simulation)
 */
router.post('/live-location', trackingController.updateLiveLocation);
router.post('/update-location', trackingController.updateLiveLocation);

/**
 * @route   GET /api/tracking/:busId
 * @desc    Get current location of a specific bus
 * @access  Private
 */
router.get('/:busId', authMiddleware, trackingController.getBusLocation);

export default router;
