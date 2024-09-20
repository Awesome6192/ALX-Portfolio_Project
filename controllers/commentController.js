// Import the Express module and create a new router instance
const express = require('express');
const router = express.Router();

// Import the Comment model from the associations models
const { Comment } = require('../models/associations');

// Route to get all comments
router.get('/', async (req, res) => {
    try {
        // Retrieve all comments from the database
        const comments = await Comment.findAll();

        // Send the retrieved comments as a JSON response
        res.json(comments);
    } catch (error) {
        // Log the error and send a 500 status response with the error message
        console.error('Error fetching comments:', error.message);
        res.status(500).json({ error: error.message });
    }
});

// Route to create a new comment
router.post('/', async (req, res) => {
    try {
        // Create a new comment using the data from the request body
        const newComment = await Comment.create(req.body);

        // Send a 201 status response with the newly created comment as JSON
        res.status(201).json(newComment);
    } catch (error) {
        // Log the error and send a 500 status response with the error message
        console.error('Error creating comment:', error.message);
        res.status(500).json({ error: error.message });
    }
});

// Route to get a comment by its ID
router.get('/:comment_id', async (req, res) => {
    try {
        // Retrieve the comment with the specified ID
        const comment = await Comment.findByPk(req.params.comment_id);

        // If the comment is not found, send a 404 status response
        if (!comment) {
            return res.status(404).json({ error: 'Comment not found' });
        }

        // Send the retrieved comment as a JSON response
        res.json(comment);
    } catch (error) {
        // Log the error and send a 500 status response with the error message
        console.error('Error fetching comment:', error.message);
        res.status(500).json({ error: error.message });
    }
});

// Route to update a comment by its ID
router.put('/:comment_id', async (req, res) => {
    try {
        // Retrieve the comment with the specified ID
        const comment = await Comment.findByPk(req.params.comment_id);

        // If the comment is not found, send a 404 status response
        if (!comment) {
            return res.status(404).json({ error: 'Comment not found' });
        }

        // Update the comment with the new data from the request body
        await comment.update(req.body);

        // Send the updated comment as a JSON response
        res.json(comment);
    } catch (error) {
        // Log the error and send a 500 status response with the error message
        console.error('Error updating comment:', error.message);
        res.status(500).json({ error: error.message });
    }
});

// Route to delete a comment by its ID
router.delete('/:comment_id', async (req, res) => {
    try {
        // Retrieve the comment with the specified ID
        const comment = await Comment.findByPk(req.params.comment_id);

        // If the comment is not found, send a 404 status response
        if (!comment) {
            return res.status(404).json({ error: 'Comment not found' });
        }

        // Delete the comment from the database
        await comment.destroy();

        // Send a 204 status response to indicate successful deletion
        res.status(204).send();
    } catch (error) {
        // Log the error and send a 500 status response with the error message
        console.error('Error deleting comment:', error.message);
        res.status(500).json({ error: error.message });
    }
});

// Export the router to be used in other parts of the application
module.exports = router;