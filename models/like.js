// Import necessary modules from Sequelize
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

// Import the User model to define foreign key relationships
const User = require('./user');

// Import the Discussion model
const Discussion = require('./discussion');

// Import the Comment model
const Comment = require('./comment');

// Define the Like model
const Like = sequelize.define('Like', {
    // Define the 'like_id' field
    like_id: {
        type: DataTypes.INTEGER, // The type of the like_id column
        primaryKey: true, // This column is the primary key
        autoIncrement: true, // The value of this column will auto-increment
    },
    // Define the 'user_id' field
    user_id: {
        type: DataTypes.INTEGER, // Define the 'user_id' column as an integer
        allowNull: false, // Indicates that this field cannot be null
        references: {
            model: User, // Specifies the User model for the foreign key relationship
            key: 'user_id', // The key in the User model that this foreign key references
        },
    },
    // Define the 'discussion_id' field
    discussion_id: {
        type: DataTypes.INTEGER, // Specifies the data type as integer
        allowNull: true, // Indicates that this field cannot be null
        references: {
            model: Discussion, // Specifies the Discussion model for the foreign key relationship
            key: 'discussion_id', // The key in the Discussion model that this foreign key references
        },
    },
    // Define the 'comment_id' field
    comment_id: {
        type: DataTypes.INTEGER, // The type of the comment_id column
        allowNull: true, // This column can be null (optional)
        references: {
            model: Comment, // This column references the Comment model
            key: 'comment_id', // The primary key of the Comment model
        },
    }
}, {
    // Model options
    timestamps: false, // Disable automatic timestamps (createdAt, updatedAt)
    underscored: true, // Use snake_case for column names (like `like_id` instead of `likeId`)
});

// Export the Like model
module.exports = Like;