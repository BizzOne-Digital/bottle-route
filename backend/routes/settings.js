const express = require('express');
const router = express.Router();
const { getSettings, updateSettings } = require('../controllers/settingsController');
const { protect } = require('../middleware/auth');
const { upload } = require('../config/cloudinary');

router.get('/', getSettings);
router.put('/', protect, upload.single('logo'), updateSettings);

module.exports = router;
