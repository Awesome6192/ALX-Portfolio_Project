// Import the necessary modules
const express = require('express'); // Import the Express library
const router = express.Router(); // Creating a new router instance
const { check, validationResult } = require('express-validator'); // Import validation middleware for request validation
const Message = require('../models/message'); // Import the Message model to interact with the messages table

// Create a new message
router.post('/', [
    // Validate input fields for creating a message
    check('chat_id').isString().notEmpty().withMessage('Chat ID must be provided'), // Ensure chat_id is a non-empty string
    check('user_id').isInt().withMessage('User ID must be an integer'), // Ensure user_id is an integer
    check('content').isString().notEmpty().withMessage('Message content must be provided'), // Ensure content is a non-empty string
    check('discussion_id').isInt().withMessage('Discussion ID must be an integer') // Ensure discussion_id is an integer
], async (req, res) => {
    // Validate the request and return errors if any
    const errors = validationResult(req); // Check for validation errors
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() }); // Respond with errors if validation fails
    }

    // Destructure the request body to extract fields
    const { chat_id, user_id, content, discussion_id } = req.body;

    try {
        // Create a new message in the database
        const newMessage = await Message.create({ chat_id, user_id, content, discussion_id });
        res.status(201).json(newMessage); // Respond with the created message and a 201 status code
    } catch (error) {
        console.error('Error creating message:', error); // Log the error for debugging
        res.status(500).json({ error: 'Error creating message' }); // Respond with a 500 error if creation fails
    }
});

// Get messages for a specific chat with optional pagination
router.get('/:chat_id', [
    // Validate input fields for fetching messages
    check('chat_id').isString().notEmpty().withMessage('Chat ID must be a non-empty string'), // Ensure chat_id is valid
    check('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'), // Validate optional page parameter
    check('limit').optional().isInt({ min: 1 }).withMessage('Limit must be a positive integer') // Validate optional limit parameter
], async (req, res) => {
    // Validate the request and return errors if any
    const errors = validationResult(req); // Check for validation errors
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() }); // Respond with errors if validation fails
    }

    const chat_id = req.params.chat_id; // Extract chat_id from request parameters
    const page = parseInt(req.query.page, 10) || 1; // Get page number from query parameters or default to 1
    const limit = parseInt(req.query.limit, 10) || 50; // Get limit from query parameters or default to 50

    try {
        // Fetch messages from the database with pagination
        const messages = await Message.findAll({
            where: { chat_id: chat_id }, // Filter messages by chat_id
            order: [['createdAt', 'ASC']], // Order messages by creation time in ascending order
            limit: limit, // Limit the number of results returned
            offset: (page - 1) * limit // Calculate the offset for pagination
        });
        res.json(messages); // Respond with the fetched messages
    } catch (error) {
        console.error('Error fetching messages:', error); // Log the error for debugging
        res.status(500).send('Internal Server Error'); // Respond with a generic error message if fetching fails
    }
});

// Update a message
router.put('/:id', [
    // Validate the content field for updating a message
    check('content').optional().isString().notEmpty().withMessage('Message content must be a non-empty string') // Ensure content is a non-empty string
], async (req, res) => {
    // Validate the request and return errors if any
    const errors = validationResult(req); // Check for validation errors
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() }); // Respond with errors if validation fails
    }

    const { content } = req.body; // Destructure the request body to get updated content

    try {
        // Update the message in the database based on the provided ID
        const [updated] = await Message.update({ content }, {
            where: { id: req.params.id } // Find the message by ID
        });
        if (updated) {
            // If the update was successful, fetch the updated message and respond
            const updatedMessage = await Message.findByPk(req.params.id);
            res.status(200).json(updatedMessage); // Respond with the updated message
        } else {
            res.status(404).json({ error: 'Message not found' }); // Respond if the message was not found
        }
    } catch (error) {
        console.error('Error updating message:', error); // Log the error for debugging
        res.status(500).json({ error: 'Error updating message' }); // Respond with an error message if updating fails
    }
});

// Delete a message
router.delete('/:id', async (req, res) => {
    try {
        // Delete the message from the database based on the provided ID
        const deleted = await Message.destroy({
            where: { id: req.params.id } // Find the message by ID
        });
        if (deleted) {
            res.status(204).json(); // Respond with no content if deleted successfully
        } else {
            res.status(404).json({ error: 'Message not found' }); // Respond if the message was not found
        }
    } catch (error) {
        console.error('Error deleting message:', error); // Log the error for debugging
        res.status(500).json({ error: 'Error deleting message' }); // Respond with an error message if deletion fails
    }
});

// Exporting the router to be used in other parts of the application
module.exports = router;