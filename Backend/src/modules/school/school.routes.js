import express from 'express';
import { createSchool, getMySchool } from './school.controller.js';
import { verifyToken } from '../../middleware/auth.middleware.js';

const router = express.Router();

router.post('/create', verifyToken, createSchool);
router.get('/my-school', verifyToken, getMySchool);

export default router;
