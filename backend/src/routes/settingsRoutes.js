const express = require('express');
const router = express.Router();
const { getSettings, updateSettings } = require('../controllers/settingsController');
const { protect, admin } = require('../middleware/authMiddleware');

router.route('/')
    .get(getSettings) // Public access for frontend
    .put(protect, admin, updateSettings); // Admin only update

module.exports = router;
