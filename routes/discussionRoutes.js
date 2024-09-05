const express = require('express');
const router = express.Router();
const Discussion = require('../models/discussion');

// Create a new discussion
router.post('/', async (req, res) => {
    try {
        const { user_id, club_id, title, body } = req.body;
        const newDiscussion = await Discussion.create({ user_id, club_id, title, body });
        res.status(201).json(newDiscussion);
    } catch (error) {
        console.error('Error creating discussion:', error);
        res.status(500).json({ error: 'Error creating discussion' });
    }
});

// Get all discussions
router.get('/', async (req, res) => {
    try {
        const discussions = await Discussion.findAll();
        res.status(200).json(discussions);
    } catch (error) {
        console.error('Error fetching discussions:', error);
        res.status(500).json({ error: 'Error fetching discussions' });
    }
});

// Get a discussion by ID
router.get('/:id', async (req, res) => {
    try {
        const discussion = await Discussion.findByPk(req.params.id);
        if (discussion) {
            res.status(200).json(discussion);
        } else {
            res.status(404).json({ error: 'Discussion not found' });
        }
    } catch (error) {
        console.error('Error fetching discussion:', error);
        res.status(500).json({ error: 'Error fetching discussion' });
    }
});

// Update a discussion
router.put('/:id', async (req, res) => {
    try {
        const { title, body } = req.body;
        const [updated] = await Discussion.update({ title, body }, {
            where: { discussion_id: req.params.id }
        });
        if (updated) {
            const updatedDiscussion = await Discussion.findByPk(req.params.id);
            res.status(200).json(updatedDiscussion);
        } else {
            res.status(404).json({ error: 'Discussion not found' });
        }
    } catch (error) {
        console.error('Error updating discussion:', error);
        res.status(500).json({ error: 'Error updating discussion' });
    }
});

// Delete a discussion
router.delete('/:id', async (req, res) => {
    try {
        const deleted = await Discussion.destroy({
            where: { discussion_id: req.params.id }
        });
        if (deleted) {
            res.status(204).json();
        } else {
            res.status(404).json({ error: 'Discussion not found' });
        }
    } catch (error) {
        console.error('Error deleting discussion:', error);
        res.status(500).json({ error: 'Error deleting discussion' });
    }
});

module.exports = router;