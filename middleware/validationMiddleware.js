// Import the 'body' and 'validationResult' functions from the 'express-validator' package
const { body, validationResult } = require('express-validator');

// Middleware to define validation and sanitization rules for user registration
const registerValidationRules = () => {
    return [
        // Validate that the username is at least 5 characters long and sanitize it
        body('username')
            .isLength({ min: 5 })
            .withMessage('Username must be at least 5 characters long')
            .trim()
            .escape(),

        // Validate that the email is a valid format and normalize it
        body('email')
            .isEmail()
            .withMessage('Invalid email address')
            .normalizeEmail(),

        // Validate that the password is at least 6 characters long and sanitize it
        body('password')
            .isLength({ min: 6 })
            .withMessage('Password must be at least 6 characters long')
            .trim()
            .escape(),
    ];
};

// Middleware to define validation and sanitization rules for user login
const loginValidationRules = () => {
    return [
        // Validate that the email is a valid format and normalize it
        body('email')
            .isEmail()
            .withMessage('Invalid email address')
            .normalizeEmail(),

        // Validate that the password is at least 6 characters long and sanitize it
        body('password')
            .isLength({ min: 6 })
            .withMessage('Password must be at least 6 characters long')
            .trim()
            .escape(),
    ];
};

// Middleware to check if there are validation errors and return them
const validate = (req, res, next) => {
    // Extract validation results from the request object
    const errors = validationResult(req);

    // If there are validation errors, respond with a 400 status and the errors
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    // If no errors, proceed to the next middleware or route handler
    next();
};

// Export the validation rules and error handling middleware
module.exports = {
    registerValidationRules,
    loginValidationRules,
    validate
};
