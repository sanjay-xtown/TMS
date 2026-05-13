import express from 'express';
import { getAll, add, update, remove } from './settings.controller.js';
import { verifyToken } from '../../middleware/auth.middleware.js';
import { authorizeRoles } from '../../middleware/role.middleware.js';

const router = express.Router();

router.use(verifyToken);
router.use(authorizeRoles('superadmin'));

router.get('/all', getAll);
router.post('/add', add);
router.put('/update/:id', update);
router.delete('/delete/:id', remove);

export default router;
