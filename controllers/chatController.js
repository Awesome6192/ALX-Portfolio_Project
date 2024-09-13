const express = require('express');
const router = express.Router();
const Message = require('../models/message'); // Import your Message model

// Get messages for a specific chat
router.get('/messages/:chatId', async (req, res) => {
    try {
        const chatId = req.params.chatId;
        const messages = await Message.find({ chatId }).sort({ createdAt: 1 });
        res.json(messages);
    } catch (error) {
        console.error('Error fetching messages:', error);
        res.status(500).send('Server Error');
    }
});

// Post a new message to a specific chat
router.post('/messages', async (req, res) => {
    try {
        const { chatId, userId, message } = req.body;
        const newMessage = new Message({
            chatId,
            userId,
            message,
            createdAt: new Date()
        });
        await newMessage.save();
        res.status(201).json(newMessage);
    } catch (error) {
        console.error('Error sending message:', error);
        res.status(500).send('Server Error');
    }
});

module.exports = router;