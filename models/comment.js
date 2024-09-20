// Import necessary modules from Sequelize
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

// Import the User model for defining foreign key relationship
const User = require('./user');

// Import the Discussion model for defining foreign key relationship
const Discussion = require('./discussion');

// Define the Comment model
const Comment = sequelize.define('Comment', {
    // Define the 'comment_id' field
    comment_id: {
        type: DataTypes.INTEGER, // Specifies the data type as integer
        primaryKey: true, // Sets this field as the primary key of the table
        autoIncrement: true, // Automatically increments the value with each new entry
    },
    // Define the 'user_id' field
    user_id: {
        type: DataTypes.INTEGER, // Define the 'user_id' column as an integer
        allowNull: false, // Indicates that this field cannot be null
        references: {
            model: User, // Specifies the User model for the foreign key relationship
            key: 'user_id' // The key in the User model that this foreign key references
        },
    },
    // Define the 'discussion_id' field
    discussion_id: {
        type: DataTypes.INTEGER, // Specifies the data type as integer
        allowNull: false, // Indicates that this field cannot be null
        references: {
            model: Discussion, // Specifies the Discussion model for the foreign key relationship
            key: 'discussion_id' // The key in the Discussion model that this foreign key references
        },
    },
    // Define the 'comment_text' field
    comment_text: {
        type: DataTypes.TEXT, // Specifies the data type as text for potentially large text content
        allowNull: false, // Indicates that this field cannot be null
    }
}, {
    // Model options
    timestamps: true, // Automatically adds 'createdAt' and 'updatedAt' fields to track record creation and updates
    underscored: true, // Uses snake_case for column names (e.g., 'comment_id' instead of 'commentId')
});

// Export the Comment model for use in other parts of the application
module.exports = Comment;