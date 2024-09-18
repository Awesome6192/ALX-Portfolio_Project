const express = require('express'); // Import the Express library
const router = express.Router(); // Create a new router instance
const bcrypt = require('bcryptjs'); // Import bcrypt for password hashing
const jwt = require('jsonwebtoken'); // Import jsonwebtoken for generating JWTs
const { User } = require('../models/associations'); // Import the User model
const authMiddleware = require('../middleware/authMiddleware'); // Import middleware for authentication
const { Op } = require('sequelize'); // Import Sequelize operators for querying
const { check, validationResult } = require('express-validator'); // Import express-validator for request validation

// Middleware for validation
// Define validation rules for registration
const registerValidationRules = () => {
    return [
        check('email').isEmail().withMessage('Invalid email address').normalizeEmail(),
        check('username').isAlphanumeric().withMessage('Username needs to be alphanumeric').trim().escape(),
        check('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long')
    ];
};

// Define validation rules for login
const loginValidationRules = () => {
    return [
        check('identifier').notEmpty().withMessage('Email or Username is required'),
        check('password').notEmpty().withMessage('Password is required')
    ];
};

// Middleware to validate request based on rules
const validate = (req, res, next) => {
    const errors = validationResult(req); // Check if there are validation errors
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() }); // Send errors if validation fails
    }
    next(); // Proceed to the next middleware or route handler if validation passes
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
            return res.status(400).json({ errors: [{ msg: 'Email or Username already exists' }] }); // Return error if user exists
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);
        // Create a new user
        const newUser = await User.create({
            username,
            email,
            password: hashedPassword
        });
        res.status(201).json(newUser); // Respond with the newly created user
    } catch (error) {
        console.error('Error registering new user:', error.message);
        res.status(500).json({ errors: [{ msg: 'Internal Server Error' }] }); // Handle server error
    }
});

// Login route (supports both email and username)
router.post('/login', loginValidationRules(), validate, async (req, res) => {
    const { identifier, password } = req.body; // 'identifier' can be email or username

    try {
        // Find the user by email or username
        const user = await User.findOne({
            where: {
                [Op.or]: [
                    { email: identifier },
                    { username: identifier }
                ]
            }
        });

        // Validate user existence and password
        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(401).json({ errors: [{ msg: 'Invalid email/username or password' }] }); // Return error if invalid credentials
        }

        // Generate JWT token
        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });

        // Set token in cookie
        res.cookie('token', token, {
            httpOnly: true, // Prevent JavaScript access
            secure: false, // Set to true if using HTTPS
            sameSite: 'strict' // CSRF protection
        });

        res.json({ userId: user.id }); // Respond with user ID
    } catch (error) {
        console.error('Error logging in:', error.message);
        res.status(500).json({ errors: [{ msg: 'Internal Server Error' }] }); // Handle server error
    }
});

// Logout route
router.post('/logout', (req, res) => {
    try {
        // Clear the authentication cookie
        res.clearCookie('token', {
            httpOnly: true,
            secure: false, // Set to true if using HTTPS
            sameSite: 'strict'
        });
        res.status(200).json({ msg: 'Logged out successfully' }); // Respond with success message
    } catch (error) {
        console.error('Error logging out:', error.message);
        res.status(500).json({ error: 'Internal Server Error' }); // Handle server error
    }
});

// Profile routes
// Get user profile
router.get('/profile', authMiddleware, async (req, res) => {
    try {
        // Find the user by ID from the token
        const user = await User.findByPk(req.user.id);
        if (!user) {
            return res.status(404).json({ error: 'User not found' }); // Return error if user not found
        }
        res.json(user); // Respond with user profile
    } catch (error) {
        console.error('Error fetching user profile:', error.message);
        res.status(500).json({ error: 'Internal Server Error' }); // Handle server error
    }
});

// Update user profile
router.put('/profile', [
    authMiddleware, // Authentication middleware
    check('email').optional().isEmail().withMessage('Invalid email address').normalizeEmail(),
    check('username').optional().isAlphanumeric().withMessage('Username needs to be alphanumeric').trim().escape()
], validate, async (req, res) => {
    try {
        // Find the user by ID from the token
        const user = await User.findByPk(req.user.id);
        if (!user) {
            return res.status(404).json({ error: 'User not found' }); // Return error if user not found
        }

        // Update the user profile if provided in request
        if (req.body.email) user.email = req.body.email;
        if (req.body.username) user.username = req.body.username;

        await user.save(); // Save the updated user
        res.json(user); // Respond with updated user profile
    } catch (error) {
        console.error('Error updating user profile:', error.message);
        res.status(500).json({ error: 'Internal Server Error' }); // Handle server error
    }
});

// Search users
router.get('/search', async (req, res) => {
    try {
        const { query } = req.query;
        if (!query) {
            return res.status(400).json({ error: 'Query parameter is required' }); // Return error if query is missing
        }

        // Search users by username or email
        const users = await User.findAll({
            where: {
                [Op.or]: [
                    { username: { [Op.iLike]: `%${query}%` } },
                    { email: { [Op.iLike]: `%${query}%` } }
                ]
            }
        });

        res.json(users); // Respond with search results
    } catch (error) {
        console.error('Error searching users:', error.message);
        res.status(500).json({ error: 'Internal Server Error' }); // Handle server error
    }
});

module.exports = router; // Export the router to be used in other parts of the application