const express = require('express');
const router = express.Router();
const Notification = require('../models/notification');

// Create a new notification
router.post('/', async (req, res) => {
    try {
        const { user_id, message } = req.body;
        const newNotification = await Notification.create({ user_id, message });
        res.status(201).json(newNotification);
    } catch (error) {
        console.error('Error creating notification:', error);
        res.status(500).json({ error: 'Error creating notification' });
    }
});

// Get all notifications for a user
router.get('/', async (req, res) => {
    try {
        const { user_id } = req.query;
        if (!user_id) {
            return res.status(400).json({ error: 'User ID is required' });
        }
        const notifications = await Notification.findAll({
            where: { user_id }
        });
        res.status(200).json(notifications);
    } catch (error) {
        console.error('Error fetching notifications:', error);
        res.status(500).json({ error: 'Error fetching notifications' });
    }
});

// Get a notification by ID
router.get('/:id', async (req, res) => {
    try {
        const notification = await Notification.findByPk(req.params.id);
        if (notification) {
            res.status(200).json(notification);
        } else {
            res.status(404).json({ error: 'Notification not found' });
        }
    } catch (error) {
        console.error('Error fetching notification:', error);
        res.status(500).json({ error: 'Error fetching notification' });
    }
});

// Update a notification
router.put('/:id', async (req, res) => {
    try {
        const { message, read } = req.body;
        const [updated] = await Notification.update({ message, read }, {
            where: { notification_id: req.params.id }
        });
        if (updated) {
            const updatedNotification = await Notification.findByPk(req.params.id);
            res.status(200).json(updatedNotification);
        } else {
            res.status(404).json({ error: 'Notification not found' });
        }
    } catch (error) {
        console.error('Error updating notification:', error);
        res.status(500).json({ error: 'Error updating notification' });
    }
});

// Delete a notification
router.delete('/:id', async (req, res) => {
    try {
        const deleted = await Notification.destroy({
            where: { notification_id: req.params.id }
        });
        if (deleted) {
            res.status(204).json();
        } else {
            res.status(404).json({ error: 'Notification not found' });
        }
    } catch (error) {
        console.error('Error deleting notification:', error);
        res.status(500).json({ error: 'Error deleting notification' });
    }
});

module.exports = router;