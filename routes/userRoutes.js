// Import the necessary modules
const express = require('express'); // Import the Express library
const router = express.Router(); // Creating a new router instance
const bcrypt = require('bcryptjs'); // Import bcrypt for hashing passwords
const jwt = require('jsonwebtoken'); // Import jsonwebtoken for generating and verifying JWTs
const { User } = require('../models/associations'); // Import the User model from the associations
const authMiddleware = require('../middleware/authMiddleware'); // Import middleware for user authentication
const { Op } = require('sequelize'); // Import Sequelize operators to build complex queries
const { check, validationResult } = require('express-validator'); // Import express-validator for request validation

// Middleware for validation
// Define validation rules for user registration
const registerValidationRules = () => {
    return [
        check('email').isEmail().withMessage('Invalid email address').normalizeEmail(),
        check('username').isAlphanumeric().withMessage('Username must be alphanumeric').trim().escape(),
        check('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long')
    ];
};

// Define validation rules for user login
const loginValidationRules = () => {
    return [
        check('identifier').notEmpty().withMessage('Email or Username is required'),
        check('password').notEmpty().withMessage('Password is required')
    ];
};

// Middleware to validate the request based on defined rules
const validate = (req, res, next) => {
    const errors = validationResult(req); // Validate the request data
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() }); // Return validation errors if any
    }
    next(); // Proceed to the next middleware or route handler if validation passes
};

// Registration route
router.post('/register', registerValidationRules(), validate, async (req, res) => {
    try {
        const { email, username, password } = req.body;

        // Check if the email or username already exists in the database
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

        // Hash the password before storing it
        const hashedPassword = await bcrypt.hash(password, 10);
        
        // Create a new user with hashed password
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
    const { identifier, password } = req.body;

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

        // Set user_id in session
        req.session.user_id = user.user_id; // Use the correct field name

        // Log user ID for debugging
        console.log('User logged in with ID:', req.session.user_id);

        // Create JWT token
        const token = jwt.sign({ user_id: user.user_id }, process.env.JWT_SECRET, { expiresIn: '1h' });

        // Set cookies for both token and user_id
        res.cookie('token', token, {
            httpOnly: false,
            secure: false,
            sameSite: 'strict'
        });

        // Allow the frontend to access user_id by setting httpOnly: false
        res.cookie('user_id', user.user_id, {
            httpOnly: false,
            secure: false,
            sameSite: 'strict'
        });

        res.json({ user_id: user.user_id });
    } catch (error) {
        console.error('Error logging in:', error.message);
        res.status(500).json({ errors: [{ msg: 'Internal Server Error' }] });
    }
});

// Logout route
router.post('/logout', (req, res) => {
    try {
        // Clear the token cookie
        res.clearCookie('token', {
            httpOnly: false,
            secure: false,
            sameSite: 'strict'
        });

        // Clear the user_id cookie (if set)
        res.clearCookie('user_id', {
            httpOnly: false,
            secure: false,
            sameSite: 'strict'
        });

        // Destroy the session (if using session management)
        req.session.destroy(err => {
            if (err) {
                return res.status(500).json({ errors: [{ msg: 'Internal Server Error' }] });
            }

            // Respond with a success message
            res.status(200).json({ msg: 'Logged out successfully' });
        });
    } catch (error) {
        console.error('Error logging out:', error.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Profile routes
// Get user profile
router.get('/profile', authMiddleware, async (req, res) => {
    try {
        // Find the user by their ID from the token
        const user = await User.findByPk(req.user.user_id);
        if (!user) {
            return res.status(404).json({ error: 'User not found' }); // Return error if user does not exist
        }
        res.json(user); // Respond with the user profile
    } catch (error) {
        console.error('Error fetching user profile:', error.message);
        res.status(500).json({ error: 'Internal Server Error' }); // Handle server error
    }
});

// Update user profile
router.put('/profile', [
    authMiddleware, // Ensure user is authenticated
    check('email').optional().isEmail().withMessage('Invalid email address').normalizeEmail(), // Validate optional email
    check('username').optional().isAlphanumeric().withMessage('Username must be alphanumeric').trim().escape() // Validate optional username
], validate, async (req, res) => {
    try {
        // Find the user by their ID from the token
        const user = await User.findByPk(req.user.user_id);
        if (!user) {
            return res.status(404).json({ error: 'User not found' }); // Return error if user does not exist
        }

        // Update user profile fields if provided
        if (req.body.email) user.email = req.body.email;
        if (req.body.username) user.username = req.body.username;

        await user.save(); // Save the updated user data
        res.json(user); // Respond with the updated user profile
    } catch (error) {
        console.error('Error updating user profile:', error.message);
        res.status(500).json({ error: 'Internal Server Error' }); // Handle server error
    }
});

// Search users by username or email
router.get('/search', async (req, res) => {
    try {
        const { query } = req.query; // Get the search query from the request
        if (!query) {
            return res.status(400).json({ error: 'Query parameter is required' }); // Return error if no query is provided
        }

        // Search users by username or email using the provided query
        const users = await User.findAll({
            where: {
                [Op.or]: [
                    { username: { [Op.iLike]: `%${query}%` } },
                    { email: { [Op.iLike]: `%${query}%` } }
                ]
            }
        });

        res.json(users); // Respond with the search results
    } catch (error) {
        console.error('Error searching users:', error.message);
        res.status(500).json({ error: 'Internal Server Error' }); // Handle server error
    }
});

// Export the router to be used in other parts of the application
module.exports = router;