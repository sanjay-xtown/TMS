import express from 'express';
import { create, getAll, update, remove } from './schooladmin.controller.js';
import { verifyToken } from '../../middleware/auth.middleware.js';
import { authorizeRoles } from '../../middleware/role.middleware.js';

const router = express.Router();

router.use(verifyToken);
router.use(authorizeRoles('superadmin'));

router.post('/create', create);
router.get('/all', getAll);
router.put('/update/:id', update);
router.delete('/delete/:id', remove);

export default router;
