import express from 'express';
import authMiddleware from '../middleware/auth.middleware.js';
const router = express.Router();
import addComponentController from '../controllers/add.component.controller.js';

//middleWare
router.use('/racks',authMiddleware.checkUserAuth);
router.use('/bins',authMiddleware.checkUserAuth);
router.use('/items',authMiddleware.checkUserAuth);
router.use('/levels',authMiddleware.checkUserAuth);


//publicRoutes


//privateRoutes
router.post('/racks',addComponentController.addRack);
router.post('/bins',addComponentController.addBin);
router.post('/items',addComponentController.addItem);
router.put('/levels',addComponentController.addLevel);

export default router