// Import the Express module and create a new router instance
const express = require('express');
const router = express.Router();

// Import the Notification model from the associations models
const { Notification } = require('../models/associations');

// Route to get all notifications
router.get('/', async (req, res) => {
    try {
        // Retrieve all notifications from the database
        const notifications = await Notification.findAll();

        // Send the retrieved notifications as a JSON response
        res.json(notifications);
    } catch (error) {
        // Log the error and send a 500 status response with the error message
        console.error('Error fetching notifications:', error.message);
        res.status(500).json({ error: error.message });
    }
});

// Route to create a new notification
router.post('/', async (req, res) => {
    try {
        // Create a new notification using the data from the request body
        const newNotification = await Notification.create(req.body);

        // Send a 201 status response with the newly created notification as JSON
        res.status(201).json(newNotification);
    } catch (error) {
        // Log the error and send a 500 status response with the error message
        console.error('Error creating notification:', error.message);
        res.status(500).json({ error: error.message });
    }
});

// Route to get a notification by its ID
router.get('/:notification_id', async (req, res) => {
    try {
        // Retrieve the notification with the specified ID
        const notification = await Notification.findByPk(req.params.notification_id);

        // If the notification is not found, send a 404 status response
        if (!notification) {
            return res.status(404).json({ error: 'Notification not found' });
        }

        // Send the retrieved notification as a JSON response
        res.json(notification);
    } catch (error) {
        // Log the error and send a 500 status response with the error message
        console.error('Error fetching notification:', error.message);
        res.status(500).json({ error: error.message });
    }
});

// Route to update a notification by its ID
router.put('/:notification_id', async (req, res) => {
    try {
        // Retrieve the notification with the specified ID
        const notification = await Notification.findByPk(req.params.notification_id);

        // If the notification is not found, send a 404 status response
        if (!notification) {
            return res.status(404).json({ error: 'Notification not found' });
        }

        // Update the notification with the new data from the request body
        await notification.update(req.body);

        // Send the updated notification as a JSON response
        res.json(notification);
    } catch (error) {
        // Log the error and send a 500 status response with the error message
        console.error('Error updating notification:', error.message);
        res.status(500).json({ error: error.message });
    }
});

// Route to delete a notification by its ID
router.delete('/:notification_id', async (req, res) => {
    try {
        // Retrieve the notification with the specified ID
        const notification = await Notification.findByPk(req.params.notification_id);

        // If the notification is not found, send a 404 status response
        if (!notification) {
            return res.status(404).json({ error: 'Notification not found' });
        }

        // Delete the notification from the database
        await notification.destroy();

        // Send a 204 status response to indicate successful deletion
        res.status(204).send();
    } catch (error) {
        // Log the error and send a 500 status response with the error message
        console.error('Error deleting notification:', error.message);
        res.status(500).json({ error: error.message });
    }
});

// Export the router to be used in other parts of the application
module.exports = router;