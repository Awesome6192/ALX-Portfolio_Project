const express = require('express'); // Import the Express library
const router = express.Router(); // Create a new router instance
const settingsController = require('../controllers/settingsController'); // Import the settingsController to handle settings-related actions
const authMiddleware = require('../middleware/authMiddleware'); // Import middleware for authentication

router.get('/user/settings', authMiddleware, settingsController.getSettings);
router.post('/user/settings', authMiddleware, settingsController.updateSettings);

module.exports = router; // Export the router to be used in other parts of the application