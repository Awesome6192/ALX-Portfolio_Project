const express = require('express');
const router = express.Router();
const { Message } = require('../models');

// Get messages for a specific chat
router.get('/:chatId', async (req, res) => {
    try {
        const messages = await Message.findAll({
            where: { chatId: req.params.chatId },
            order: [['createdAt', 'ASC']]
        });
        res.json(messages);
    } catch (error) {
        console.error('Error fetching messages:', error);
        res.status(500).send('Internal Server Error');
    }
});

module.exports = router;