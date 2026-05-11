import express from 'express';
import * as studentController from './student.controller.js';
import { authMiddleware } from '../../shared/middleware/authMiddleware.js';
import { roleMiddleware } from '../../shared/middleware/roleMiddleware.js';

const router = express.Router();

// Only Admins or Schools can create/update/delete students
router.use(authMiddleware);

router.post('/create', roleMiddleware('superadmin', 'school_admin'), studentController.create);
router.patch('/:id', roleMiddleware('superadmin', 'school_admin'), studentController.update);
router.delete('/:id', roleMiddleware('superadmin', 'school_admin'), studentController.remove);
router.get('/', roleMiddleware('superadmin', 'school_admin'), studentController.getAll);
router.post('/:id/assign-bus', roleMiddleware('superadmin', 'school_admin'), studentController.assignBusToStudent);

export default router;
