// Middleware function to handle errors in Express applications
const errorHandler = (err, req, res, next) => {
    // Log the error details to the console for debugging purposes
    console.error('Error details:', err);

    // Defaults to 500 (Internal Server Error) if not provided in the error object
    const statusCode = err.statusCode || 500;

    // Respond to the client with a JSON object containing error details
    res.status(statusCode).json({
        error: {
            // Include the error message from the error object, or a generic message if not provided
            message: err.message || 'An unexpected error occurred',
            // Optionally include the stack trace for debugging purposes
            // This is only included if the application is in development mode
            ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
        }
    });
};

// Export the error handler middleware function for use in other parts of the application
module.exports = errorHandler;