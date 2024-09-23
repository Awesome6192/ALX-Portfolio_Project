// Import the jsonwebtoken module for handling JWT tokens
const jwt = require('jsonwebtoken');

// Import the User model to interact with the database
const { User } = require('../models/associations');

// Authentication middleware function
const authMiddleware = async (req, res, next) => {
    try {
        // Extract token from cookies or Authorization header
        const token = req.cookies.token || req.headers.authorization?.split(' ')[1];
        
        // If no token is provided, respond with a 401 Unauthorized error
        if (!token) {
            console.log('No token provided');
            return res.status(401).json({ error: 'No token provided' });
        }

        console.log('Token received:', token);

        // Verify the token using the secret key from environment variables
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log('Decoded token:', decoded);

        // Ensure user_id is present in the decoded token
        if (!decoded.user_id) {
            console.error('Decoded token does not contain user_id');
            return res.status(401).json({ error: 'Invalid token payload' });
        }

        // Find the user associated with the token's ID
        const user = await User.findByPk(decoded.user_id);
        console.log('User retrieved:', user);

        // If no user is found, respond with a 401 Unauthorized error
        if (!user) {
            console.log('User not found');
            return res.status(401).json({ error: 'User not found' });
        }

        // Attach the user object to the request for use in subsequent middleware or route handlers
        req.user = user;
        // Proceed to the next middleware or route handler
        next();
    } catch (error) {
        // Handle errors related to token verification or user retrieval
        console.error('Authentication error:', error.message);
        res.status(401).json({ error: 'Invalid token' });
    }
};

// Export the middleware function for use in other parts of the application
module.exports = authMiddleware;