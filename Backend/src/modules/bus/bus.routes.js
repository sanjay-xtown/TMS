import express from 'express';
import { create, getAll } from './bus.controller.js';
import { verifyToken, checkSchoolAccess } from '../../middleware/auth.middleware.js';

const router = express.Router();

router.use(verifyToken);
router.use(checkSchoolAccess);

router.post('/create', create);
router.get('/all', getAll);

export default router;
