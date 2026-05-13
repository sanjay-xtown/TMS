import express from 'express';
import { login, register, getProfile } from './superadmin.controller.js';
import { verifyToken } from '../../middleware/auth.middleware.js';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/profile', verifyToken, getProfile);

export default router;
