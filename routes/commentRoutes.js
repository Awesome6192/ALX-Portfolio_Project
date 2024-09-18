const express = require('express'); // Import the Express library
const router = express.Router(); // Create a new router object
const Comment = require('../models/comment'); // Import the Comment model from the models directory

// Create a new comment
router.post('/', async (req, res) => {
    try {
        const { user_id, discussion_id, content } = req.body; // Destructuring the request body to get comment details
        const newComment = await Comment.create({ user_id, discussion_id, content }); // Creating a new comment record in the database
        res.status(201).json(newComment); // Responding with the created comment and a 201 status code
    } catch (error) {
        console.error('Error creating comment:', error); // Logging errors to the console
        res.status(500).json({ error: 'Error creating comment' }); // Responding with a 500 status code if creation fails
    }
});

// Get all comments for a discussion
router.get('/', async (req, res) => {
    try {
        const { discussion_id } = req.query; // Getting discussion ID from query parameters
        if (!discussion_id) {
            return res.status(400).json({ error: 'Discussion ID is required' }); // Responding with a 400 status code if discussion ID is missing
        }
        const comments = await Comment.findAll({
            where: { discussion_id } // Fetching all comments associated with the given discussion ID
        });
        res.status(200).json(comments); // Responding with the list of comments and a 200 status code
    } catch (error) {
        console.error('Error fetching comments:', error); // Logging errors to the console
        res.status(500).json({ error: 'Error fetching comments' }); // Responding with a 500 status code if fetching fails
    }
});

// Get a comment by ID
router.get('/:id', async (req, res) => {
    try {
        const comment = await Comment.findByPk(req.params.id); // Fetching a comment by its primary key (ID)
        if (comment) {
            res.status(200).json(comment); // Responding with the comment details and a 200 status code if found
        } else {
            res.status(404).json({ error: 'Comment not found' }); // Responding with a 404 status code if the comment is not found
        }
    } catch (error) {
        console.error('Error fetching comment:', error); // Logging errors to the console
        res.status(500).json({ error: 'Error fetching comment' }); // Responding with a 500 status code if fetching fails
    }
});

// Update a comment
router.put('/:id', async (req, res) => {
    try {
        const { content } = req.body; // Destructuring the request body to get updated content
        const [updated] = await Comment.update({ content }, {
            where: { comment_id: req.params.id } // Updating the comment with the specified ID
        });
        if (updated) {
            const updatedComment = await Comment.findByPk(req.params.id); // Fetching the updated comment details
            res.status(200).json(updatedComment); // Responding with the updated comment and a 200 status code
        } else {
            res.status(404).json({ error: 'Comment not found' }); // Responding with a 404 status code if the comment is not found
        }
    } catch (error) {
        console.error('Error updating comment:', error); // Logging errors to the console
        res.status(500).json({ error: 'Error updating comment' }); // Responding with a 500 status code if updating fails
    }
});

// Delete a comment
router.delete('/:id', async (req, res) => {
    try {
        const deleted = await Comment.destroy({
            where: { comment_id: req.params.id } // Deleting the comment with the specified ID
        });
        if (deleted) {
            res.status(204).json(); // Responding with a 204 status code indicating successful deletion with no content
        } else {
            res.status(404).json({ error: 'Comment not found' }); // Responding with a 404 status code if the comment is not found
        }
    } catch (error) {
        console.error('Error deleting comment:', error); // Logging errors to the console
        res.status(500).json({ error: 'Error deleting comment' }); // Responding with a 500 status code if deletion fails
    }
});

module.exports = router; // Exporting the router to be used in other parts of the application