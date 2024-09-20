// Import necessary modules from Sequelize
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

// Import the User model to define foreign key relationships
const User = require('./user');

// Define the Notification model
const Notification = sequelize.define('Notification', {
    // Define the 'notification_id' field
    notification_id: {
        type: DataTypes.INTEGER, // Define the 'user_id' column as an integer
        primaryKey: true, // Set this column as the primary key
        autoIncrement: true, // Automatically increment this column's value with each new record
    },
    // Define the 'user_id' field
    user_id: {
        type: DataTypes.INTEGER, // Define the type of the 'user_id' column as an integer
        allowNull: false, // Indicates that this field cannot be null
        references: {
            model: User, // Specifies the User model for the foreign key relationship
            key: 'user_id' // The key in the User model that this foreign key references
        },
    },
    // Define the 'message' field
    message: {
        type: DataTypes.STRING(255), // Define the type of the 'message' column as a string with a maximum length of 255 characters
        allowNull: false, // This column cannot be null
    },
    is_read: {
        type: DataTypes.BOOLEAN, // Define the type of the 'is_read' column as a boolean
        defaultValue: false, // Default value is false, indicating that the notification is unread by default
    }
}, {
    // Model options
    timestamps: false, // Disable automatic timestamps (createdAt, updatedAt)
    underscored: true, // Use snake_case for column names (e.g., 'notification_id' instead of 'notificationId')
});

// Export the Notification model for use in other parts of the application
module.exports = Notification;