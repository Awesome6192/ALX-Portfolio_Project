const express = require('express');
const router = express.Router();
const settingsController = require('../controllers/settingsController');
const authMiddleware = require('../middleware/authMiddleware');

router.get('/user/settings', authMiddleware, settingsController.getSettings);
router.post('/user/settings', authMiddleware, settingsController.updateSettings);

module.exports = router;