const express = require('express');
const router = express.Router();
const { getPricing, updatePricing } = require('../controllers/pricingController');
const { protect } = require('../middleware/auth');

router.get('/', getPricing);
router.put('/', protect, updatePricing);

module.exports = router;
