import express from 'express';
import { create, getAll, assignBus } from './student.controller.js';
import { verifyToken, checkSchoolAccess } from '../../middleware/auth.middleware.js';

const router = express.Router();

router.use(verifyToken);
router.use(checkSchoolAccess);

router.post('/create', create);
router.get('/all', getAll);
router.post('/assign-bus/:id', assignBus);

export default router;
