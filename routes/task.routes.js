import express from 'express';
import authMiddleware from '../middleware/auth.middleware.js';
const router = express.Router();
import taskController from '../controllers/task.controller.js';
import { checkUserRole } from '../middleware/check.user.role.js';

router.post('/add-item',checkUserRole('supervisor'),taskController.addItemTask)
router.post('/add-bin',taskController.addBinTask)
router.post('/serve-item',taskController.serveItemTask)
router.get('/get-task/:id',taskController.getTask);
export default router