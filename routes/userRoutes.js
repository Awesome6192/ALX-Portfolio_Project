const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { User } = require('../models/associations');
const authMiddleware = require('../middleware/authMiddleware');
const { Op } = require('sequelize');
const { check, validationResult } = require('express-validator');

// Middleware for validation
const registerValidationRules = () => {
    return [
        check('email').isEmail().withMessage('Invalid email address').normalizeEmail(),
        check('username').isAlphanumeric().withMessage('Username needs to be alphanumeric').trim().escape(),
        check('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long')
    ];
};

const loginValidationRules = () => {
    return [
        check('identifier').notEmpty().withMessage('Email or Username is required'),
        check('password').notEmpty().withMessage('Password is required')
    ];
};

const validate = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    next();
};

// Registration route
router.post('/register', registerValidationRules(), validate, async (req, res) => {
    try {
        const { email, username, password } = req.body;

        // Check if email or username already exists
        const existingUser = await User.findOne({
            where: {
                [Op.or]: [
                    { email },
                    { username }
                ]
            }
        });

        if (existingUser) {
            return res.status(400).json({ errors: [{ msg: 'Email or Username already exists' }] });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = await User.create({
            username,
            email,
            password: hashedPassword
        });
        res.status(201).json(newUser);
    } catch (error) {
        console.error('Error registering new user:', error.message);
        res.status(500).json({ errors: [{ msg: 'Internal Server Error' }] });
    }
});

// Login route (supports both email and username)
router.post('/login', loginValidationRules(), validate, async (req, res) => {
    const { identifier, password } = req.body; // 'identifier' can be email or username

    try {
        const user = await User.findOne({
            where: {
                [Op.or]: [
                    { email: identifier },
                    { username: identifier }
                ]
            }
        });

        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(401).json({ errors: [{ msg: 'Invalid email/username or password' }] });
        }

        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });

        res.cookie('token', token, {
            httpOnly: true,
            secure: false,
            sameSite: 'strict'
        });

        res.json({ userId: user.id }); // Response without token in the body
    } catch (error) {
        console.error('Error logging in:', error.message);
        res.status(500).json({ errors: [{ msg: 'Internal Server Error' }] });
    }
});

// Logout route
router.post('/logout', (req, res) => {
    try {
        res.clearCookie('token', {
            httpOnly: true,
            secure: false,
            sameSite: 'strict'
        });
        res.status(200).json({ msg: 'Logged out successfully' });
    } catch (error) {
        console.error('Error logging out:', error.message);
        res.status(500).json({ error: 'Internal Server Error' });
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
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

router.put('/profile', [
    authMiddleware,
    check('email').optional().isEmail().withMessage('Invalid email address').normalizeEmail(),
    check('username').optional().isAlphanumeric().withMessage('Username needs to be alphanumeric').trim().escape()
], validate, async (req, res) => {
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
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Search users
router.get('/search', async (req, res) => {
    try {
        const { query } = req.query;
        if (!query) {
            return res.status(400).json({ error: 'Query parameter is required' });
        }

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
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

module.exports = router;