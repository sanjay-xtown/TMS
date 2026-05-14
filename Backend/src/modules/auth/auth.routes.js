import express from 'express';
import * as authController from './auth.controller.js';
import { authMiddleware } from '../../shared/middleware/authMiddleware.js';
import { roleMiddleware } from '../../shared/middleware/roleMiddleware.js';

const router = express.Router();

router.post('/login', authController.login);

// Register admin: Protected for superadmins only
router.post('/register-admin', authMiddleware, roleMiddleware('superadmin'), authController.register);

// Get all admins: Protected for superadmins only
router.get('/admins', authMiddleware, roleMiddleware('superadmin'), authController.getAllAdmins);

export default router;
