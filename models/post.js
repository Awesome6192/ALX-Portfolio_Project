const { DataTypes } = require('sequelize'); // Import DataTypes from Sequelize to define the model attributes
const sequelize = require('../config/database'); // Import the configured Sequelize instance from the database configuration
const User = require('./user'); // Import the User model to set up the foreign key reference

// Define the Post model
const Post = sequelize.define('Post', {
    post_id: {
        type: DataTypes.INTEGER, // Define the type of the 'post_id' column as an integer
        primaryKey: true, // Set this column as the primary key for the model
        autoIncrement: true, // Automatically increment this column's value with each new record
        field: 'post_id' // Ensure the column name matches the database column name
    },
    user_id: {
        type: DataTypes.INTEGER, // Define the type of the 'user_id' column as an integer
        allowNull: false, // This column cannot be null
        references: {
            model: User, // Reference the User model to establish a foreign key relationship
            key: 'user_id' // Reference the 'user_id' column in the User model
        },
        onDelete: 'CASCADE', // Optional: Automatically delete posts if the associated user is deleted
        onUpdate: 'CASCADE'  // Optional: Automatically update the 'user_id' if the corresponding user ID changes
    },
    content: {
        type: DataTypes.TEXT, // Define the type of the 'content' column as text
        allowNull: false // This column cannot be null, meaning every post must have content
    },
    image_url: {
        type: DataTypes.STRING, // Define the type of the 'image_url' column as a string to store URLs or file paths
        allowNull: true // This column can be null, indicating that an image is optional for a post
    }
}, {
    timestamps: true, // Automatically handles 'createdAt' and 'updatedAt' timestamps
    underscored: true, // Uses snake_case for column names (e.g., 'post_id' instead of 'postId')
    tableName: 'post' // Specifies the table name in the database
});

module.exports = Post; // Export the Post model for use in other parts of the application