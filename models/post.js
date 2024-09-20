// Import necessary modules from Sequelize
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

// Import the User model to define foreign key relationships
const User = require('./user');

// Define the Post model
const Post = sequelize.define('Post', {
    // Define the 'post_id' field
    post_id: {
        type: DataTypes.INTEGER, // Define the type of the 'post_id' column as an integer
        primaryKey: true, // Set this column as the primary key for the model
        autoIncrement: true, // Automatically increment this column's value with each new record
        field: 'post_id' // Ensure the column name matches the database column name
    },
    // Define the 'user_id' field
    user_id: {
        type: DataTypes.INTEGER, // Define the 'user_id' column as an integer
        allowNull: false, // Indicates that this field cannot be null
        references: {
            model: User, // Specifies the User model for the foreign key relationship
            key: 'user_id' // The key in the User model that this foreign key references
        },
        onDelete: 'CASCADE', // Optional: Automatically delete posts if the associated user is deleted
        onUpdate: 'CASCADE'  // Optional: Automatically update the 'user_id' if the corresponding user ID changes
    },
    // Define the 'content' field
    content: {
        type: DataTypes.TEXT, // Define the type of the 'content' column as text
        allowNull: false // This column cannot be null, meaning every post must have content
    },
    // Define the 'image_url' field
    image_url: {
        type: DataTypes.STRING, // Define the type of the 'image_url' column as a string to store URLs or file paths
        allowNull: true // This column can be null, indicating that an image is optional for a post
    },
    // Define the 'video_url' field
    video_url: {
        type: DataTypes.STRING,
        allowNull: true // Optional: Only include if videos are not required
    }
}, {
    // Model options
    timestamps: true, // Automatically adds 'createdAt' and 'updatedAt' fields to track record creation and updates
    underscored: true, // Uses snake_case for column names (e.g., 'post_id' instead of 'postId')
    tableName: 'post' // Specifies the table name in the database
});

// Export the Post model for use in other parts of the application
module.exports = Post;