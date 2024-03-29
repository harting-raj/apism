import express from 'express';
import authMiddleware from '../middleware/auth.middleware.js';
const router = express.Router();
import removeComponentController from '../controllers/remove.component.controller.js';

router.get('/:itemID', authMiddleware.checkUserAuth)
router.get('/bins', authMiddleware.checkUserAuth)
router.get('/racks', authMiddleware.checkUserAuth)
//router.get('/bin',authMiddleware.checkUserAuth)
router.get('/serve-item', authMiddleware.checkUserAuth)

router.delete('/:itemID', removeComponentController.removeItem)
router.post('/bins', removeComponentController.removeBin)
router.delete('/racks', removeComponentController.removeRack)
//router.delete('/bin', removeComponentController.removeBin)
router.post('/serve-item', removeComponentController.serveItem)

export default router;