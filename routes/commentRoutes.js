const express = require('express');
const router = express.Router();
const Comment = require('../models/comment');

// Create a new comment
router.post('/', async (req, res) => {
    try {
        const { user_id, discussion_id, content } = req.body;
        const newComment = await Comment.create({ user_id, discussion_id, content });
        res.status(201).json(newComment);
    } catch (error) {
        console.error('Error creating comment:', error);
        res.status(500).json({ error: 'Error creating comment' });
    }
});

// Get all comments for a discussion
router.get('/', async (req, res) => {
    try {
        const { discussion_id } = req.query;
        if (!discussion_id) {
            return res.status(400).json({ error: 'Discussion ID is required' });
        }
        const comments = await Comment.findAll({
            where: { discussion_id }
        });
        res.status(200).json(comments);
    } catch (error) {
        console.error('Error fetching comments:', error);
        res.status(500).json({ error: 'Error fetching comments' });
    }
});

// Get a comment by ID
router.get('/:id', async (req, res) => {
    try {
        const comment = await Comment.findByPk(req.params.id);
        if (comment) {
            res.status(200).json(comment);
        } else {
            res.status(404).json({ error: 'Comment not found' });
        }
    } catch (error) {
        console.error('Error fetching comment:', error);
        res.status(500).json({ error: 'Error fetching comment' });
    }
});

// Update a comment
router.put('/:id', async (req, res) => {
    try {
        const { content } = req.body;
        const [updated] = await Comment.update({ content }, {
            where: { comment_id: req.params.id }
        });
        if (updated) {
            const updatedComment = await Comment.findByPk(req.params.id);
            res.status(200).json(updatedComment);
        } else {
            res.status(404).json({ error: 'Comment not found' });
        }
    } catch (error) {
        console.error('Error updating comment:', error);
        res.status(500).json({ error: 'Error updating comment' });
    }
});

// Delete a comment
router.delete('/:id', async (req, res) => {
    try {
        const deleted = await Comment.destroy({
            where: { comment_id: req.params.id }
        });
        if (deleted) {
            res.status(204).json();
        } else {
            res.status(404).json({ error: 'Comment not found' });
        }
    } catch (error) {
        console.error('Error deleting comment:', error);
        res.status(500).json({ error: 'Error deleting comment' });
    }
});

module.exports = router;