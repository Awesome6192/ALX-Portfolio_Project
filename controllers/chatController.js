// Import the Express module and create a new router instance
const express = require('express');
const router = express.Router();

// Import the Message model to interact with the messages collection in the database
const Message = require('../models/message');

// Route to get messages for a specific chat
router.get('/messages/:chat_id', async (req, res) => {
    try {
        // Extract chatId from request parameters
        const chat_id = req.params.chat_id;

        // Find messages related to the given chatId and sort them by creation date in ascending order
        const messages = await Message.find({ chat_id }).sort({ createdAt: 1 });

        // Send the retrieved messages as a JSON response
        res.json(messages);
    } catch (error) {
        // Log the error and send a 500 status response in case of an exception
        console.error('Error fetching messages:', error);
        res.status(500).send('Server Error');
    }
});

// Route to post a new message to a specific chat
router.post('/messages', async (req, res) => {
    try {
        // Extract chatId, userId, and message content from the request body
        const { chat_id, user_id, message } = req.body;

        // Create a new message instance with the provided data and the current date
        const newMessage = new Message({
            chat_id,
            user_id,
            message,
            createdAt: new Date()
        });

        // Save the new message to the database
        await newMessage.save();

        // Send a 201 status response with the newly created message as JSON
        res.status(201).json(newMessage);
    } catch (error) {
        // Log the error and send a 500 status response in case of an exception
        console.error('Error sending message:', error);
        res.status(500).send('Server Error');
    }
});

// Export the router to be used in other parts of the application
module.exports = router;