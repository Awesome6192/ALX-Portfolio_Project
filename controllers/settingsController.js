// Import bcrypt for password hashing and comparison
const bcrypt = require('bcrypt');

// Import the User model from the settings models
const { User } = require('../models/settings');

// Function to get the current user's settings
const getSettings = async (req, res) => {
    try {
        // Find the user by their ID, which is set by the authentication middleware
        const user = await User.findByPk(req.user.id);

        // If the user is not found, send a 404 status with an error message
        if (!user) {
            return res.status(404).json({ errors: [{ msg: 'User not found' }] });
        }

        // Send the user's settings as a JSON response
        res.json(user);
    } catch (error) {
        // Log the error and send a 500 status response if an error occurs
        console.error('Error fetching settings:', error);
        res.status(500).json({ errors: [{ msg: 'Server error' }] });
    }
};

// Function to update the current user's settings
const updateSettings = async (req, res) => {
    // Destructure previous password, new password, username, email, and language from the request body
    const { previousPassword, newPassword, username, email, language } = req.body;

    try {
        // Find the user by their ID
        const user = await User.findByPk(req.user.id);

        // If the user is not found, send a 404 status with an error message
        if (!user) {
            return res.status(404).json({ errors: [{ msg: 'User not found' }] });
        }

        // Check if both previous and new passwords are provided
        if (previousPassword && newPassword) {
            // Compare the provided previous password with the stored password
            const isMatch = await bcrypt.compare(previousPassword, user.password);

            // If the passwords do not match, send a 400 status with an error message
            if (!isMatch) {
                return res.status(400).json({ errors: [{ msg: 'Incorrect previous password' }] });
            }

            // Hash the new password and update the user's password
            user.password = await bcrypt.hash(newPassword, 10);
        }

        // Update the user's username, email, and language if provided
        if (username) user.username = username;
        if (email) user.email = email;
        if (language) user.language = language;

        // Save the updated user settings to the database
        await user.save();

        // Send a success message as a JSON response
        res.json({ msg: 'Settings updated successfully' });
    } catch (error) {
        // Log the error and send a 500 status response if an error occurs
        console.error('Error updating settings:', error);
        res.status(500).json({ errors: [{ msg: 'Server error' }] });
    }
};

// Export the functions to be used in routes
module.exports = {
    getSettings,
    updateSettings,
};