const express = require('express');
const router = express.Router();
const { getUsers, deleteUser, toggleBlockUser, getStats } = require('../controllers/adminController');
const { protect, admin } = require('../middleware/authMiddleware');
const { syncLiveJobs } = require('../services/jobAggregator');

// All admin routes must go through protect and admin middlewares
router.use(protect, admin);

router.route('/users').get(getUsers);
router.route('/users/:id').delete(deleteUser);
router.route('/users/:id/block').put(toggleBlockUser);
router.route('/stats').get(getStats);

router.route('/sync-jobs').post(async (req, res) => {
  const result = await syncLiveJobs();
  if (result.success) {
    res.json({ message: `Successfully synced ${result.count} live jobs.` });
  } else {
    res.status(500).json({ message: 'Failed to sync jobs', error: result.error });
  }
});

module.exports = router;
