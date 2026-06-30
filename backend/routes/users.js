const express = require('express');
const router = express.Router();
const { toggleBookmark, getUserProfile, getRecommendations, getNotifications } = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');

router.route('/profile').get(protect, getUserProfile);
router.route('/bookmarks').post(protect, toggleBookmark);
router.route('/recommendations').get(protect, getRecommendations);
router.route('/notifications').get(protect, getNotifications);

module.exports = router;
