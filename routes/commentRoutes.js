// Import the necessary modules
const express = require('express'); // Import the Express library
const router = express.Router(); // Create a new router instance
const Comment = require('../models/comment'); // Import the Comment model from the models directory

// Create a new comment
router.post('/', async (req, res) => {
    try {
        // Destructuring the request body to get comment details
        const { user_id, discussion_id, content } = req.body; 
        
        // Creating a new comment record in the database
        const newComment = await Comment.create({ user_id, discussion_id, content }); 
        
        // Responding with the created comment and a 201 status code
        res.status(201).json(newComment); 
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
        
        // Fetching all comments associated with the given discussion ID
        const comments = await Comment.findAll({
            where: { discussion_id } 
        });
        
        // Responding with the list of comments and a 200 status code
        res.status(200).json(comments); 
    } catch (error) {
        console.error('Error fetching comments:', error); // Logging errors to the console
        res.status(500).json({ error: 'Error fetching comments' }); // Responding with a 500 status code if fetching fails
    }
});

// Get a comment by comment_id
router.get('/:comment_id', async (req, res) => {
    try {
        // Fetching a comment by its primary key (comment_id)
        const comment = await Comment.findByPk(req.params.comment_id); 
        if (comment) {
            // Responding with the comment details and a 200 status code if found
            res.status(200).json(comment); 
        } else {
            // Responding with a 404 status code if the comment is not found
            res.status(404).json({ error: 'Comment not found' }); 
        }
    } catch (error) {
        console.error('Error fetching comment:', error); // Logging errors to the console
        res.status(500).json({ error: 'Error fetching comment' }); // Responding with a 500 status code if fetching fails
    }
});

// Update a comment
router.put('/:comment_id', async (req, res) => {
    try {
        // Destructuring the request body to get updated content
        const { content } = req.body; 
        
        // Updating the comment with the specified comment_id
        const [updated] = await Comment.update({ content }, {
            where: { comment_id: req.params.comment_id } 
        });
        
        if (updated) {
            // Fetching the updated comment details
            const updatedComment = await Comment.findByPk(req.params.comment_id); 
            
            // Responding with the updated comment and a 200 status code
            res.status(200).json(updatedComment); 
        } else {
            // Responding with a 404 status code if the comment is not found
            res.status(404).json({ error: 'Comment not found' }); 
        }
    } catch (error) {
        console.error('Error updating comment:', error); // Logging errors to the console
        res.status(500).json({ error: 'Error updating comment' }); // Responding with a 500 status code if updating fails
    }
});

// Delete a comment
router.delete('/:comment_id', async (req, res) => {
    try {
        // Deleting the comment with the specified comment_id
        const deleted = await Comment.destroy({
            where: { comment_id: req.params.comment_id } 
        });
        
        if (deleted) {
            // Responding with a 204 status code indicating successful deletion with no content
            res.status(204).json(); 
        } else {
            // Responding with a 404 status code if the comment is not found
            res.status(404).json({ error: 'Comment not found' }); 
        }
    } catch (error) {
        console.error('Error deleting comment:', error); // Logging errors to the console
        res.status(500).json({ error: 'Error deleting comment' }); // Responding with a 500 status code if deletion fails
    }
});

// Exporting the router to be used in other parts of the application
module.exports = router; 