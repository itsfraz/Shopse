const express = require('express');
const router = express.Router();
const { getPageBySlug, updatePage } = require('../controllers/pageController');
const { protect, admin } = require('../middleware/authMiddleware');

router.route('/:slug').get(getPageBySlug);
router.route('/').post(protect, admin, updatePage);

module.exports = router;
