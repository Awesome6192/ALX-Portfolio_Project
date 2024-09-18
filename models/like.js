const { DataTypes } = require('sequelize'); // Import DataTypes from Sequelize to define model attributes
const sequelize = require('../config/database'); // Import the configured Sequelize instance
const User = require('./user'); // Import the User model
const Discussion = require('./discussion'); // Import the Discussion model
const Comment = require('./comment'); // Import the Comment model

// Define the Like model
const Like = sequelize.define('Like', {
    like_id: {
        type: DataTypes.INTEGER, // The type of the like_id column
        primaryKey: true, // This column is the primary key
        autoIncrement: true, // The value of this column will auto-increment
    },
    user_id: {
        type: DataTypes.INTEGER, // The type of the user_id column
        allowNull: false, // This column cannot be null
        references: {
            model: User, // This column references the User model
            key: 'user_id', // The primary key of the User model
        },
    },
    discussion_id: {
        type: DataTypes.INTEGER, // The type of the discussion_id column
        allowNull: true, // This column can be null (optional)
        references: {
            model: Discussion, // This column references the Discussion model
            key: 'discussion_id', // The primary key of the Discussion model
        },
    },
    comment_id: {
        type: DataTypes.INTEGER, // The type of the comment_id column
        allowNull: true, // This column can be null (optional)
        references: {
            model: Comment, // This column references the Comment model
            key: 'comment_id', // The primary key of the Comment model
        },
    }
}, {
    timestamps: false, // Disable automatic timestamps (createdAt, updatedAt)
    underscored: true, // Use snake_case for column names (like `like_id` instead of `likeId`)
});

// Export the Like model
module.exports = Like;