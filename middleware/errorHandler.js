// errorHandler.js

const errorHandler = (err, req, res, next) => {
    // Log the error details for debugging
    console.error('Error details:', err);

    // Determine the status code to use
    const statusCode = err.statusCode || 500;

    // Respond with a generic message and the status code
    res.status(statusCode).json({
        error: {
            message: err.message || 'An unexpected error occurred',
            // Optionally include stack trace in development
            ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
        }
    });
};

module.exports = errorHandler;