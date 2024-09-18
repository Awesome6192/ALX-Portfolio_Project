const { DataTypes } = require('sequelize'); // Import DataTypes from Sequelize to define the model attributes
const sequelize = require('../config/database'); // Import the configured Sequelize instance from the database configuration
const User = require('./user'); // Import the User model to set up the foreign key reference

// Define the Notification model
const Notification = sequelize.define('Notification', {
    notification_id: {
        type: DataTypes.INTEGER, // Define the type of the 'notification_id' column as an integer
        primaryKey: true, // Set this column as the primary key
        autoIncrement: true, // Automatically increment this column's value with each new record
    },
    user_id: {
        type: DataTypes.INTEGER, // Define the type of the 'user_id' column as an integer
        allowNull: false, // This column cannot be null
        references: {
            model: User, // Reference the User model
            key: 'user_id' // Reference the 'user_id' column in the User model
        },
    },
    message: {
        type: DataTypes.STRING(255), // Define the type of the 'message' column as a string with a maximum length of 255 characters
        allowNull: false, // This column cannot be null
    },
    is_read: {
        type: DataTypes.BOOLEAN, // Define the type of the 'is_read' column as a boolean
        defaultValue: false, // Default value is false, indicating that the notification is unread by default
    }
}, {
    timestamps: false, // No automatic handling of createdAt and updatedAt timestamps
    underscored: true, // Use snake_case for column names (e.g., 'notification_id' instead of 'notificationId')
});

module.exports = Notification; // Export the Notification model for use in other parts of the application