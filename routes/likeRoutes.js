const express = require('express');
const router = express.Router();
const Like = require('../models/like');

// Create a new like
router.post('/', async (req, res) => {
    try {
        const { user_id, content_type, content_id } = req.body;
        const newLike = await Like.create({ user_id, content_type, content_id });
        res.status(201).json(newLike);
    } catch (error) {
        console.error('Error creating like:', error);
        res.status(500).json({ error: 'Error creating like' });
    }
});

// Get all likes for a content type and ID
router.get('/', async (req, res) => {
    try {
        const { content_type, content_id } = req.query;
        if (!content_type || !content_id) {
            return res.status(400).json({ error: 'Content type and content ID are required' });
        }
        const likes = await Like.findAll({
            where: { content_type, content_id }
        });
        res.status(200).json(likes);
    } catch (error) {
        console.error('Error fetching likes:', error);
        res.status(500).json({ error: 'Error fetching likes' });
    }
});

// Get a like by ID
router.get('/:id', async (req, res) => {
    try {
        const like = await Like.findByPk(req.params.id);
        if (like) {
            res.status(200).json(like);
        } else {
            res.status(404).json({ error: 'Like not found' });
        }
    } catch (error) {
        console.error('Error fetching like:', error);
        res.status(500).json({ error: 'Error fetching like' });
    }
});

// Update a like
router.put('/:id', async (req, res) => {
    try {
        const { user_id, content_type, content_id } = req.body;
        const [updated] = await Like.update({ user_id, content_type, content_id }, {
            where: { like_id: req.params.id }
        });
        if (updated) {
            const updatedLike = await Like.findByPk(req.params.id);
            res.status(200).json(updatedLike);
        } else {
            res.status(404).json({ error: 'Like not found' });
        }
    } catch (error) {
        console.error('Error updating like:', error);
        res.status(500).json({ error: 'Error updating like' });
    }
});

// Delete a like
router.delete('/:id', async (req, res) => {
    try {
        const deleted = await Like.destroy({
            where: { like_id: req.params.id }
        });
        if (deleted) {
            res.status(204).json();
        } else {
            res.status(404).json({ error: 'Like not found' });
        }
    } catch (error) {
        console.error('Error deleting like:', error);
        res.status(500).json({ error: 'Error deleting like' });
    }
});

module.exports = router;