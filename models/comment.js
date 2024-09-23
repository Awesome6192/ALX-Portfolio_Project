// Import necessary modules from Sequelize
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

// Import the User model for defining foreign key relationship
const User = require('./user');

// Import the Post model for defining foreign key relationship
const Post = require('./post');

// Define the Comment model
const Comment = sequelize.define('Comment', {
    // Define the 'comment_id' field
    comment_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    // Define the 'user_id' field
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: User,
            key: 'user_id',
        },
    },
    // Define the 'post_id' field
    post_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Post,
            key: 'post_id',
        },
    },
    // Define the 'comment_text' field
    comment_text: {
        type: DataTypes.TEXT,
        allowNull: false,
        validate: {
            notEmpty: true,
            len: {
                args: [1, 500],
                msg: "Comment must be between 1 and 500 characters."
            }
        }
    }
}, {
    timestamps: true,
    underscored: true,
    paranoid: true,
});

// Define associations
Comment.belongsTo(User, { foreignKey: 'user_id' });
Comment.belongsTo(Post, { foreignKey: 'post_id' });

// Export the Comment model for use in other parts of the application
module.exports = Comment;