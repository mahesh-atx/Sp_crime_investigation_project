const express = require('express');
const router = express.Router();
const { 
  getStationWise, 
  getIOWise, 
  getSubDivisionCompare,
  getPerformance 
} = require('../controllers/analyticsController');
const { protect, authorize } = require('../middleware/auth');

// All routes are protected and admin only
router.use(protect);
router.use(authorize('admin'));

router.get('/station-wise', getStationWise);
router.get('/station/:station/io-wise', getIOWise);
router.get('/subdivision-compare', getSubDivisionCompare);
router.get('/performance', getPerformance);

module.exports = router;
