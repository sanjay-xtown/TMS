import express from 'express';
import * as parentController from './parent.controller.js';
import { authMiddleware } from '../../shared/middleware/authMiddleware.js';
import { roleMiddleware } from '../../shared/middleware/roleMiddleware.js';
import { verifyToken, checkSchoolAccess } from '../../middleware/auth.middleware.js';

const router = express.Router();

/**
 * @route   POST /api/parents/login
 * @desc    Parent login to access dashboard
 * @access  Public
 */
router.post('/login', parentController.login);

/**
 * @route   GET /api/parents/profile
 * @desc    Get parent dashboard/profile data
 * @access  Private (Parent)
 */
/**
 * @route   PATCH /api/parents/profile
 * @desc    Update parent dashboard/profile data
 * @access  Private (Parent)
 */
router.get('/profile', authMiddleware, parentController.getProfile);

/**
 * @route   PATCH /api/parents/profile
 * @desc    Update parent's own profile
 * @access  Private (Parent)
 */
router.patch('/profile', authMiddleware, parentController.updateProfile);

/**
 * @route   PATCH /api/parents/:id
 * @desc    Admin update parent details
 * @access  Private (Admin)
 */
router.patch('/:id', authMiddleware, roleMiddleware('superadmin', 'school_admin'), parentController.adminUpdateParent);

// --- School Admin Routes ---
router.post('/create', verifyToken, checkSchoolAccess, parentController.createParent);
router.get('/all', verifyToken, checkSchoolAccess, parentController.getAllParents);
router.post('/send-invitation', verifyToken, checkSchoolAccess, parentController.sendInvitation);

export default router;
