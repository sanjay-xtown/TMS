import express from 'express';
import * as transferController from './transfer.controller.js';
import { authMiddleware } from '../../shared/Middleware/authMiddleware.js';

const router = express.Router();

router.use(authMiddleware);

router.post('/student', transferController.transferStudent);
router.post('/emergency', transferController.emergencyTransfer);

export default router;
