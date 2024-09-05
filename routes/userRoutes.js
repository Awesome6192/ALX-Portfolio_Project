const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { check, validationResult } = require('express-validator');
const { User } = require('../models/associations');
const authMiddleware = require('../middleware/authMiddleware');
const { Op } = require('sequelize');

// Registration route
router.post('/register', [
    check('email').isEmail().withMessage('Please provide a valid email address'),
    check('username').isAlphanumeric().withMessage('Username needs to be alphanumeric'),
    check('email').custom(async (value) => {
        const user = await User.findOne({ where: { email: value } });
        if (user) {
            throw new Error('Email already exists!');
        }
    }),
    check('username').custom(async (value) => {
        const user = await User.findOne({ where: { username: value } });
        if (user) {
            throw new Error('Username already exists!');
        }
    })
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const hashedPassword = await bcrypt.hash(req.body.password, 10);
        const newUser = await User.create({
            username: req.body.username,
            email: req.body.email,
            password: hashedPassword
        });
        res.status(201).json(newUser);
    } catch (error) {
        console.error('Error registering new user:', error.message);
        res.status(500).json({ error: error.message });
    }
});

// Login route
router.post('/login', async (req, res) => {
    const { username, password } = req.body;

    try {
        const user = await User.findOne({ where: { username } });
        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(401).json({ errors: [{ msg: 'Invalid username or password' }] });
        }

        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });

        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict'
        });

        res.json({ userId: user.id });
    } catch (error) {
        console.error('Error logging in:', error.message);
        res.status(500).json({ error: error.message });
    }
});

// Profile routes
router.get('/profile', authMiddleware, async (req, res) => {
    try {
        const user = await User.findByPk(req.user.id);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.json(user);
    } catch (error) {
        console.error('Error fetching user profile:', error.message);
        res.status(500).json({ error: error.message });
    }
});

router.put('/profile', [
    authMiddleware,
    check('email').optional().isEmail().withMessage('Please provide a valid email address'),
    check('username').optional().isAlphanumeric().withMessage('Username needs to be alphanumeric')
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const user = await User.findByPk(req.user.id);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        if (req.body.email) user.email = req.body.email;
        if (req.body.username) user.username = req.body.username;

        await user.save();
        res.json(user);
    } catch (error) {
        console.error('Error updating user profile:', error.message);
        res.status(500).json({ error: error.message });
    }
});

// Search users
router.get('/search', async (req, res) => {
    try {
        const { query } = req.query;
        if (!query) {
            return res.status(400).json({ error: 'Query parameter is required' });
        }

        // Perform search query
        const users = await User.findAll({
            where: {
                [Op.or]: [
                    { username: { [Op.iLike]: `%${query}%` } },
                    { email: { [Op.iLike]: `%${query}%` } }
                ]
            }
        });

        res.json(users);
    } catch (error) {
        console.error('Error searching users:', error.message);
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;