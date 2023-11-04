import express from 'express';
import authController from '../controllers/auth.controller.js';
import authMiddleware from '../middleware/auth.middleware.js';
const router = express.Router();

//middleware
router.use('/changepassword', authMiddleware.checkUserAuth)
router.use('/userprofile', authMiddleware.checkUserAuth)
router.use('/regerate-access-token', authMiddleware.checkRefreshAuth)

//public routes
router.post('/register', authController.registerUser)
router.post('/login', authController.userLogin)

//private routes
router.post('/changepassword', authController.changePassword)
router.get('/userprofile', authController.userProfile)
router.post('/regerate-access-token', authController.regenerateAccessToken)

export default router