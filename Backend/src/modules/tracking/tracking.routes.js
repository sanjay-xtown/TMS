import express from 'express';
import * as trackingController from './tracking.controller.js';
import { authMiddleware } from '../../shared/Middleware/authMiddleware.js';

import { roleMiddleware } from '../../shared/Middleware/roleMiddleware.js';

const router = express.Router();

// Only Admins can update bus location/status
router.post('/update-location', authMiddleware, roleMiddleware('superadmin', 'school_admin'), trackingController.updateLocation);

// Get location can be called by parents/admin
router.get('/bus/:busId', authMiddleware, trackingController.getBusLiveLocation);

export default router;
