import express from 'express';
import transferController from '../controllers/transfer.component.controller.js';
import authMiddleware from '../middleware/auth.middleware.js';
const router = express.Router();

router.use('/bin',authMiddleware.checkUserAuth)
router.use('/item',authMiddleware.checkUserAuth)


router.patch('/bin',transferController.transferBin)
router.patch('/item',transferController.transferItem)

export default router;