const express = require('express');
const router = express.Router();
const { Comment } = require('../models/associations');

// Get all comments
router.get('/', async (req, res) => {
    try {
        const comments = await Comment.findAll();
        res.json(comments);
    } catch (error) {
        console.error('Error fetching comments:', error.message);
        res.status(500).json({ error: error.message });
    }
});

// Create a new comment
router.post('/', async (req, res) => {
    try {
        const newComment = await Comment.create(req.body);
        res.status(201).json(newComment);
    } catch (error) {
        console.error('Error creating comment:', error.message);
        res.status(500).json({ error: error.message });
    }
});

// Get a comment by ID
router.get('/:id', async (req, res) => {
    try {
        const comment = await Comment.findByPk(req.params.id);
        if (!comment) {
            return res.status(404).json({ error: 'Comment not found' });
        }
        res.json(comment);
    } catch (error) {
        console.error('Error fetching comment:', error.message);
        res.status(500).json({ error: error.message });
    }
});

// Update a comment by ID
router.put('/:id', async (req, res) => {
    try {
        const comment = await Comment.findByPk(req.params.id);
        if (!comment) {
            return res.status(404).json({ error: 'Comment not found' });
        }
        await comment.update(req.body);
        res.json(comment);
    } catch (error) {
        console.error('Error updating comment:', error.message);
        res.status(500).json({ error: error.message });
    }
});

// Delete a comment by ID
router.delete('/:id', async (req, res) => {
    try {
        const comment = await Comment.findByPk(req.params.id);
        if (!comment) {
            return res.status(404).json({ error: 'Comment not found' });
        }
        await comment.destroy();
        res.status(204).send();
    } catch (error) {
        console.error('Error deleting comment:', error.message);
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;