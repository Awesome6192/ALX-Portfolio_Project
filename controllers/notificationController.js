const express = require('express');
const router = express.Router();
const { Notification } = require('../models/associations');

// Get all notifications
router.get('/', async (req, res) => {
    try {
        const notifications = await Notification.findAll();
        res.json(notifications);
    } catch (error) {
        console.error('Error fetching notifications:', error.message);
        res.status(500).json({ error: error.message });
    }
});

// Create a new notification
router.post('/', async (req, res) => {
    try {
        const newNotification = await Notification.create(req.body);
        res.status(201).json(newNotification);
    } catch (error) {
        console.error('Error creating notification:', error.message);
        res.status(500).json({ error: error.message });
    }
});

// Get a notification by ID
router.get('/:id', async (req, res) => {
    try {
        const notification = await Notification.findByPk(req.params.id);
        if (!notification) {
            return res.status(404).json({ error: 'Notification not found' });
        }
        res.json(notification);
    } catch (error) {
        console.error('Error fetching notification:', error.message);
        res.status(500).json({ error: error.message });
    }
});

// Update a notification by ID
router.put('/:id', async (req, res) => {
    try {
        const notification = await Notification.findByPk(req.params.id);
        if (!notification) {
            return res.status(404).json({ error: 'Notification not found' });
        }
        await notification.update(req.body);
        res.json(notification);
    } catch (error) {
        console.error('Error updating notification:', error.message);
        res.status(500).json({ error: error.message });
    }
});

// Delete a notification by ID
router.delete('/:id', async (req, res) => {
    try {
        const notification = await Notification.findByPk(req.params.id);
        if (!notification) {
            return res.status(404).json({ error: 'Notification not found' });
        }
        await notification.destroy();
        res.status(204).send();
    } catch (error) {
        console.error('Error deleting notification:', error.message);
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;