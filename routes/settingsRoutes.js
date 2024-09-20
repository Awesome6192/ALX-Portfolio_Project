// Import the necessary modules
const express = require('express'); // Import the Express library for creating server routes
const router = express.Router(); // Create a new router instance for defining routes
const settingsController = require('../controllers/settingsController'); // Import the settingsController for handling settings-related logic
const authMiddleware = require('../middleware/authMiddleware'); // Import middleware for authentication to protect routes

// Define routes
// Route to get user settings; requires authentication
router.get('/user/settings', authMiddleware, settingsController.getSettings);

// Route to update user settings; requires authentication
router.post('/user/settings', authMiddleware, settingsController.updateSettings);

// Export the router to be used in other parts of the application
module.exports = router; 