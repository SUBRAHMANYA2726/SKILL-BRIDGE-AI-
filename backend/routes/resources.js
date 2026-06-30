const express = require('express');
const router = express.Router();
const { getResources, createResource, deleteResource } = require('../controllers/resourceController');
const { protect, admin } = require('../middleware/authMiddleware');

router.route('/')
  .get(protect, getResources)
  .post(protect, admin, createResource);

router.route('/:id')
  .delete(protect, admin, deleteResource);

module.exports = router;
