const express = require('express');
const router = express.Router();
const { 
  getCases, 
  getCase, 
  createCase, 
  updateCase, 
  completeCase,
  getStats 
} = require('../controllers/caseController');
const { protect } = require('../middleware/auth');

// All routes are protected
router.use(protect);

router.get('/stats', getStats);
router.route('/')
  .get(getCases)
  .post(createCase);

router.route('/:id')
  .get(getCase)
  .put(updateCase);

router.patch('/:id/complete', completeCase);

module.exports = router;
