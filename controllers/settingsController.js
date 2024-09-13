const bcrypt = require('bcrypt');
const { User } = require('../models/settings'); // Adjust path based on your project structure

exports.getSettings = async (req, res) => {
    try {
        const user = await User.findByPk(req.user.id); // Assuming req.user is set by authMiddleware
        if (!user) {
            return res.status(404).json({ errors: [{ msg: 'User not found' }] });
        }
        res.json(user);
    } catch (error) {
        console.error('Error fetching settings:', error);
        res.status(500).json({ errors: [{ msg: 'Server error' }] });
    }
};

exports.updateSettings = async (req, res) => {
    const { previousPassword, newPassword, username, email, language } = req.body;

    try {
        const user = await User.findByPk(req.user.id); // Assuming req.user is set by authMiddleware

        if (!user) {
            return res.status(404).json({ errors: [{ msg: 'User not found' }] });
        }

        if (previousPassword && newPassword) {
            // Check previous password
            const isMatch = await bcrypt.compare(previousPassword, user.password);

            if (!isMatch) {
                return res.status(400).json({ errors: [{ msg: 'Incorrect previous password' }] });
            }

            // Update password
            user.password = await bcrypt.hash(newPassword, 10);
        }

        // Update username and email if provided
        if (username) user.username = username;
        if (email) user.email = email;
        if (language) user.language = language;

        await user.save();

        res.json({ msg: 'Settings updated successfully' });
    } catch (error) {
        console.error('Error updating settings:', error);
        res.status(500).json({ errors: [{ msg: 'Server error' }] });
    }
};