const express = require('express'); // Import the Express library
const router = express.Router(); // Create a new router instance
const Notification = require('../models/notification'); // Import the Notification model from the models directory

// Create a new notification
router.post('/', async (req, res) => {
    try {
        // Extract user_id and message from the request body
        const { user_id, message } = req.body;
        // Create a new notification record in the database
        const newNotification = await Notification.create({ user_id, message });
        // Respond with the newly created notification and a 201 status code
        res.status(201).json(newNotification);
    } catch (error) {
        console.error('Error creating notification:', error); // Log any errors to the console
        // Respond with a 500 status code if an error occurs
        res.status(500).json({ error: 'Error creating notification' });
    }
});

// Get all notifications for a user
router.get('/', async (req, res) => {
    try {
        // Extract user_id from the query parameters
        const { user_id } = req.query;
        // Ensure user_id is provided
        if (!user_id) {
            return res.status(400).json({ error: 'User ID is required' });
        }
        // Fetch all notifications associated with the given user_id
        const notifications = await Notification.findAll({
            where: { user_id }
        });
        // Respond with the list of notifications and a 200 status code
        res.status(200).json(notifications);
    } catch (error) {
        console.error('Error fetching notifications:', error); // Log any errors to the console
        // Respond with a 500 status code if an error occurs
        res.status(500).json({ error: 'Error fetching notifications' });
    }
});

// Get a notification by ID
router.get('/:id', async (req, res) => {
    try {
        // Fetch a notification by its primary key (ID)
        const notification = await Notification.findByPk(req.params.id);
        if (notification) {
            // Respond with the notification details and a 200 status code if found
            res.status(200).json(notification);
        } else {
            // Respond with a 404 status code if the notification is not found
            res.status(404).json({ error: 'Notification not found' });
        }
    } catch (error) {
        console.error('Error fetching notification:', error); // Log any errors to the console
        // Respond with a 500 status code if an error occurs
        res.status(500).json({ error: 'Error fetching notification' });
    }
});

// Update a notification
router.put('/:id', async (req, res) => {
    try {
        // Extract updated message and read status from the request body
        const { message, read } = req.body;
        // Update the notification with the specified ID
        const [updated] = await Notification.update({ message, read }, {
            where: { notification_id: req.params.id }
        });
        if (updated) {
            // Fetch the updated notification details
            const updatedNotification = await Notification.findByPk(req.params.id);
            // Respond with the updated notification and a 200 status code
            res.status(200).json(updatedNotification);
        } else {
            // Respond with a 404 status code if the notification is not found
            res.status(404).json({ error: 'Notification not found' });
        }
    } catch (error) {
        console.error('Error updating notification:', error); // Log any errors to the console
        // Respond with a 500 status code if an error occurs
        res.status(500).json({ error: 'Error updating notification' });
    }
});

// Delete a notification
router.delete('/:id', async (req, res) => {
    try {
        // Delete the notification with the specified ID
        const deleted = await Notification.destroy({
            where: { notification_id: req.params.id }
        });
        if (deleted) {
            // Respond with a 204 status code indicating successful deletion with no content
            res.status(204).json();
        } else {
            // Respond with a 404 status code if the notification is not found
            res.status(404).json({ error: 'Notification not found' });
        }
    } catch (error) {
        console.error('Error deleting notification:', error); // Log any errors to the console
        // Respond with a 500 status code if an error occurs
        res.status(500).json({ error: 'Error deleting notification' });
    }
});

module.exports = router; // Export the router to be used in other parts of the application