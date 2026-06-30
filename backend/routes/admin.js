const express = require('express');
const router = express.Router();
const { getUsers, deleteUser, toggleBlockUser, getStats } = require('../controllers/adminController');
const { protect, admin } = require('../middleware/authMiddleware');

// All admin routes must go through protect and admin middlewares
router.use(protect, admin);

router.route('/users').get(getUsers);
router.route('/users/:id').delete(deleteUser);
router.route('/users/:id/block').put(toggleBlockUser);
router.route('/stats').get(getStats);

module.exports = router;
