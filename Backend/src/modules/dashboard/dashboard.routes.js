import express from 'express';
import * as dashboardController from './dashboard.controller.js';
import { authMiddleware } from '../../shared/Middleware/authMiddleware.js';
import { roleMiddleware } from '../../shared/Middleware/roleMiddleware.js';

const router = express.Router();

router.get('/', authMiddleware, roleMiddleware('parent'), dashboardController.getDashboard);

export default router;
