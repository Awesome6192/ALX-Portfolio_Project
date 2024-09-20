// Import necessary modules from Sequelize
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

// Import the User model to define foreign key relationships
const User = require('./user');

// Import the Club model to define foreign key relationships
const Club = require('./club');

// Define the Discussion model
const Discussion = sequelize.define('Discussion', {
    // Define the 'discussion_id' field
    discussion_id: {
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
    // Define the 'club_id' field
    club_id: {
        type: DataTypes.INTEGER, // Specifies the data type as integer
        allowNull: false, // Indicates that this field cannot be null
        references: {
            model: Club, // Specifies the Club model for the foreign key relationship
            key: 'club_id' // The key in the Club model that this foreign key references
        },
    },
    // Define the 'title' field
    title: {
        type: DataTypes.STRING(255), // Specifies the data type as a string with a maximum length of 255 characters
        allowNull: false, // Indicates that this field cannot be null
    },
    // Define the 'body' field
    body: {
        type: DataTypes.TEXT, // Specifies the data type as text for potentially large content
        allowNull: false, // Indicates that this field cannot be null
    }
}, {
    // Model options
    timestamps: true, // Automatically adds 'createdAt' and 'updatedAt' fields to track record creation and updates
    underscored: true, // Uses snake_case for column names (e.g., 'discussion_id' instead of 'discussionId')
});

// Export the Discussion model for use in other parts of the application
module.exports = Discussion;