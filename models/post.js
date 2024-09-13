const { DataTypes } = require('sequelize');
const sequelize = require('../config/database'); // Ensure the path to your database config is correct
const User = require('./user'); // Ensure the User model is imported correctly

// Define the Post model
const Post = sequelize.define('Post', {
    post_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        field: 'post_id' // Matches the database column name
    },
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: User, // Reference the User model
            key: 'user_id' // Ensure this matches the primary key of the User model
        },
        onDelete: 'CASCADE',  // Optional: Set behavior when the associated user is deleted
        onUpdate: 'CASCADE'   // Optional: Handle updates in the foreign key
    },
    content: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    image_url: {
        type: DataTypes.STRING, // Use STRING to store the URL or file path
        allowNull: true        // Set to true if the image is optional
    }
}, {
    timestamps: true,        // Automatically adds createdAt and updatedAt
    underscored: true,       // Uses snake_case column names in the database
    tableName: 'post'        // Ensure the table name matches the database table
});

module.exports = Post;