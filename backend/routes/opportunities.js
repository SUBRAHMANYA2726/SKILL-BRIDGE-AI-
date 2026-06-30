const express = require('express');
const router = express.Router();
const { getOpportunities, getPublicOpportunities, createOpportunity, deleteOpportunity } = require('../controllers/opportunityController');
const { protect, admin } = require('../middleware/authMiddleware');

router.route('/public')
  .get(getPublicOpportunities);

router.route('/')
  .get(protect, getOpportunities)
  .post(protect, admin, createOpportunity);

router.route('/:id')
  .delete(protect, admin, deleteOpportunity);

module.exports = router;
