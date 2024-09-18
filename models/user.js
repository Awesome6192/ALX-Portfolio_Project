const { DataTypes } = require('sequelize'); // Import DataTypes from Sequelize to define the model's data types
const sequelize = require('../config/database'); // Import the configured Sequelize instance from the database configuration

// Define the User model
const User = sequelize.define('User', {
    user_id: {
        type: DataTypes.INTEGER, // Define the 'user_id' column as an integer
        primaryKey: true, // Set this column as the primary key for the table
        autoIncrement: true, // Automatically increment this value for new records
    },
    username: {
        type: DataTypes.STRING(50), // Define the 'username' column as a string with a maximum length of 50 characters
        allowNull: false, // Ensure that the 'username' field cannot be null
        unique: true, // Ensure that each username value is unique across the table
    },
    email: {
        type: DataTypes.STRING(100), // Define the 'email' column as a string with a maximum length of 100 characters
        allowNull: false, // Ensure that the 'email' field cannot be null
        unique: true, // Ensure that each email address is unique across the table
        validate: {
            isEmail: true, // Validate that the email follows a proper email format
        },
    },
    password: {
        type: DataTypes.STRING, // Define the 'password' column as a string
        allowNull: false, // Ensure that the 'password' field cannot be null
    }
}, {
    timestamps: true, // Automatically add 'createdAt' and 'updatedAt' columns for tracking creation and modification times
    underscored: true, // Use snake_case for column names in the database (e.g., 'user_id' instead of 'userId')
});

module.exports = User; // Export the User model for use in other parts of the application