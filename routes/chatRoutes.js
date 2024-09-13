const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const Message = require('../models/message'); // Ensure this path is correct

// Create a new message
router.post('/', [
    check('chatId').isString().notEmpty().withMessage('Chat ID must be provided'),
    check('userId').isInt().withMessage('User ID must be an integer'),
    check('content').isString().notEmpty().withMessage('Message content must be provided')
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { chatId, userId, content } = req.body;

    try {
        const newMessage = await Message.create({ chatId, userId, content });
        res.status(201).json(newMessage);
    } catch (error) {
        console.error('Error creating message:', error);
        res.status(500).json({ error: 'Error creating message' });
    }
});

// Get messages for a specific chat with optional pagination
router.get('/:chatId', [
    check('chatId').isString().notEmpty().withMessage('Chat ID must be a non-empty string'),
    check('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
    check('limit').optional().isInt({ min: 1 }).withMessage('Limit must be a positive integer')
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const chatId = req.params.chatId;
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 50;

    try {
        const messages = await Message.findAll({
            where: { chatId: chatId },
            order: [['createdAt', 'ASC']],
            limit: limit,
            offset: (page - 1) * limit
        });
        res.json(messages);
    } catch (error) {
        console.error('Error fetching messages:', error);
        res.status(500).send('Internal Server Error');
    }
});

// Update a message
router.put('/:id', [
    check('content').optional().isString().notEmpty().withMessage('Message content must be a non-empty string')
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { content } = req.body;

    try {
        const [updated] = await Message.update({ content }, {
            where: { id: req.params.id }
        });
        if (updated) {
            const updatedMessage = await Message.findByPk(req.params.id);
            res.status(200).json(updatedMessage);
        } else {
            res.status(404).json({ error: 'Message not found' });
        }
    } catch (error) {
        console.error('Error updating message:', error);
        res.status(500).json({ error: 'Error updating message' });
    }
});

// Delete a message
router.delete('/:id', async (req, res) => {
    try {
        const deleted = await Message.destroy({
            where: { id: req.params.id }
        });
        if (deleted) {
            res.status(204).json();
        } else {
            res.status(404).json({ error: 'Message not found' });
        }
    } catch (error) {
        console.error('Error deleting message:', error);
        res.status(500).json({ error: 'Error deleting message' });
    }
});

module.exports = router;