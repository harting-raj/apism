import express from 'express';
import authMiddleware from '../middleware/auth.middleware.js';
const router = express.Router();
import getDataController from '../controllers/get.data.controller.js';
import getReportController from '../controllers/get.report.data.controller.js';

router.use('/home', authMiddleware.checkUserAuth)
router.use('/racklist', authMiddleware.checkUserAuth)
router.use('/rackdetail/:rackID', authMiddleware.checkUserAuth)
router.use('/binlist', authMiddleware.checkUserAuth)
router.use('/emptybinlist', authMiddleware.checkUserAuth)
router.use('/itemlist', authMiddleware.checkUserAuth)
router.use('/bindetail/:binID', authMiddleware.checkUserAuth)
router.use('/itemdetail/:itemID', authMiddleware.checkUserAuth)
router.use('/userlist/:role', authMiddleware.checkUserAuth)
router.use('/lowquantity', authMiddleware.checkUserAuth)
router.use('/exireditems', authMiddleware.checkUserAuth)
router.use('/gettasknumber', authMiddleware.checkUserAuth)


router.get('/home', getDataController.getComponentCount)
router.get('/racklist', getDataController.getRackList);
router.get('/rackdetail/:rackID', getDataController.getRackDetail)
router.get('/binlist', getDataController.getBinList)
router.get('/emptybinlist', getDataController.getEmptyBins)
router.get('/itemlist', getDataController.getItemList)
router.get('/bindetail/:binID', getDataController.getBinDetail)
router.get('/itemdetail/:itemID', getDataController.getItemDetail)
router.get('/userlist/:role', getDataController.getUserList)
router.get('/lowquantity', getReportController.getLowQuantityItems)
router.get('/expireditems', getReportController.getExpiredItems)
router.get('/rackwithposition', getDataController.getRackWithPosition)
router.get('/rackwithbins', getDataController.getRackWithBins)
router.get('/gettasknumber', getReportController.getTaskNumber)
router.get('/getLastAccessedList',getReportController.getLastAccessedList)

export default router;