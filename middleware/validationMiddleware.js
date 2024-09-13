const { body, validationResult } = require('express-validator');

// Middleware to validate and sanitize user registration data
const registerValidationRules = () => {
    return [
        // Validate and sanitize user input
        body('username').isLength({ min: 5 }).withMessage('Username must be at least 5 characters long').trim().escape(),
        body('email').isEmail().withMessage('Invalid email address').normalizeEmail(),
        body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long').trim().escape(),
    ];
};

// Middleware to validate and sanitize user login data
const loginValidationRules = () => {
    return [
        body('email').isEmail().withMessage('Invalid email address').normalizeEmail(),
        body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long').trim().escape(),
    ];
};

// Middleware to handle validation errors
const validate = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    next();
};

module.exports = {
    registerValidationRules,
    loginValidationRules,
    validate
};