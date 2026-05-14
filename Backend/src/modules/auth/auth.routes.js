import express from 'express';
import { login } from './auth.controller.js';

const router = express.Router();

router.post('/login', login);

// Update/Delete admins: Protected for superadmins only
router.put('/admins/:id', authMiddleware, roleMiddleware('superadmin'), authController.updateAdmin);
router.delete('/admins/:id', authMiddleware, roleMiddleware('superadmin'), authController.deleteAdmin);

export default router;
