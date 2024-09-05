const express = require('express');
const router = express.Router();
const { Like } = require('../models/associations');

// Get all likes
router.get('/', async (req, res) => {
    try {
        const likes = await Like.findAll();
        res.json(likes);
    } catch (error) {
        console.error('Error fetching likes:', error.message);
        res.status(500).json({ error: error.message });
    }
});

// Create a new like
router.post('/', async (req, res) => {
    try {
        const newLike = await Like.create(req.body);
        res.status(201).json(newLike);
    } catch (error) {
        console.error('Error creating like:', error.message);
        res.status(500).json({ error: error.message });
    }
});

// Get a like by ID
router.get('/:id', async (req, res) => {
    try {
        const like = await Like.findByPk(req.params.id);
        if (!like) {
            return res.status(404).json({ error: 'Like not found' });
        }
        res.json(like);
    } catch (error) {
        console.error('Error fetching like:', error.message);
        res.status(500).json({ error: error.message });
    }
});

// Update a like by ID
router.put('/:id', async (req, res) => {
    try {
        const like = await Like.findByPk(req.params.id);
        if (!like) {
            return res.status(404).json({ error: 'Like not found' });
        }
        await like.update(req.body);
        res.json(like);
    } catch (error) {
        console.error('Error updating like:', error.message);
        res.status(500).json({ error: error.message });
    }
});

// Delete a like by ID
router.delete('/:id', async (req, res) => {
    try {
        const like = await Like.findByPk(req.params.id);
        if (!like) {
            return res.status(404).json({ error: 'Like not found' });
        }
        await like.destroy();
        res.status(204).send();
    } catch (error) {
        console.error('Error deleting like:', error.message);
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;