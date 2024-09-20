const { DataTypes } = require('sequelize'); // Import DataTypes from Sequelize to define the model's data types
const sequelize = require('../config/database'); // Import the configured Sequelize instance from the database configuration

// Define the User model
const User = sequelize.define('User', {
    // Define the 'user_id' field
    user_id: {
        type: DataTypes.INTEGER, // Define the 'user_id' column as an integer
        primaryKey: true, // Set this column as the primary key for the table
        autoIncrement: true, // Automatically increment this value for new records
    },
    // Define the 'username' field
    username: {
        type: DataTypes.STRING(50), // Define the 'username' column as a string with a maximum length of 50 characters
        allowNull: false, // Ensure that the 'username' field cannot be null
        unique: true, // Ensure that each username value is unique across the table
    },
    // Define the 'email' field
    email: {
        type: DataTypes.STRING(100), // Define the 'email' column as a string with a maximum length of 100 characters
        allowNull: false, // Ensure that the 'email' field cannot be null
        unique: true, // Ensure that each email address is unique across the table
        validate: {
            isEmail: true, // Validate that the email follows a proper email format
        },
    },
    // Define the 'password' field
    password: {
        type: DataTypes.STRING, // Define the 'password' column as a string
        allowNull: false, // Ensure that the 'password' field cannot be null
    },
    // Define the 'is_deleted' field
    is_deleted: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false, // Default to 'false' (i.e., not deleted)
    }
}, {
    // Model options
    timestamps: true, // Automatically adds 'createdAt' and 'updatedAt' fields to track record creation and updates
    underscored: true, // Use snake_case for column names in the database (e.g., 'user_id' instead of 'userId')
});

// Export the User model for use in other parts of the application
module.exports = User;