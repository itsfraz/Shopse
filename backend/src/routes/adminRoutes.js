const express = require('express');
const router = express.Router();
const { getDashboardStats, getUsers, updateUserStatus } = require('../controllers/adminController');
const { protect, admin } = require('../middleware/authMiddleware');

router.get('/dashboard', protect, admin, getDashboardStats);
router.get('/users', protect, admin, getUsers);
router.put('/users/:id', protect, admin, updateUserStatus);

module.exports = router;
