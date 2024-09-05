const express = require('express');
const router = express.Router();
const { Discussion } = require('../models/associations');

// Get all discussions
router.get('/', async (req, res) => {
    try {
        const discussions = await Discussion.findAll();
        res.json(discussions);
    } catch (error) {
        console.error('Error fetching discussions:', error.message);
        res.status(500).json({ error: error.message });
    }
});

// Create a new discussion
router.post('/', async (req, res) => {
    try {
        const newDiscussion = await Discussion.create(req.body);
        res.status(201).json(newDiscussion);
    } catch (error) {
        console.error('Error creating discussion:', error.message);
        res.status(500).json({ error: error.message });
    }
});

// Get a discussion by ID
router.get('/:id', async (req, res) => {
    try {
        const discussion = await Discussion.findByPk(req.params.id);
        if (!discussion) {
            return res.status(404).json({ error: 'Discussion not found' });
        }
        res.json(discussion);
    } catch (error) {
        console.error('Error fetching discussion:', error.message);
        res.status(500).json({ error: error.message });
    }
});

// Update a discussion by ID
router.put('/:id', async (req, res) => {
    try {
        const discussion = await Discussion.findByPk(req.params.id);
        if (!discussion) {
            return res.status(404).json({ error: 'Discussion not found' });
        }
        await discussion.update(req.body);
        res.json(discussion);
    } catch (error) {
        console.error('Error updating discussion:', error.message);
        res.status(500).json({ error: error.message });
    }
});

// Delete a discussion by ID
router.delete('/:id', async (req, res) => {
    try {
        const discussion = await Discussion.findByPk(req.params.id);
        if (!discussion) {
            return res.status(404).json({ error: 'Discussion not found' });
        }
        await discussion.destroy();
        res.status(204).send();
    } catch (error) {
        console.error('Error deleting discussion:', error.message);
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;