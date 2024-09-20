// Import necessary modules from Sequelize
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

// Define the Settings model
const Settings = sequelize.define('Settings', {
    // Define the 'user_id' field
    user_id: {
        type: DataTypes.INTEGER, // Define the 'user_id' column as an integer
        allowNull: false, // Indicates that this field cannot be null
        references: {
            model: 'Users', // Specifies the User model for the foreign key relationship
            key: 'user_id' // The key in the User model that this foreign key references
        }
    },
    // Define the 'username' field
    username: {
        type: DataTypes.STRING, // Define the type of the 'username' column as a string
        allowNull: true, // This column can be null, meaning the username is optional
    },
    // Define the 'email' field
    email: {
        type: DataTypes.STRING, // Define the type of the 'email' column as a string
        allowNull: true, // This column can be null, meaning the email is optional
        validate: {
            isEmail: true // Validate that the email follows the correct format
        }
    },
    // Define the 'previousPassword' field
    previousPassword: {
        type: DataTypes.STRING, // Define the type of the 'previousPassword' column as a string
        allowNull: true, // This column can be null, meaning the previous password is optional
    },
    // Define the 'newPassword' field
    newPassword: {
        type: DataTypes.STRING, // Define the type of the 'newPassword' column as a string
        allowNull: true, // This column can be null, meaning the new password is optional
    },
    // Define the 'confirmPassword' field
    confirmPassword: {
        type: DataTypes.STRING, // Define the type of the 'confirmPassword' column as a string
        allowNull: true, // This column can be null, meaning the confirm password is optional
    },
    // Define the 'language' field
    language: {
        type: DataTypes.STRING, // Define the type of the 'language' column as a string
        allowNull: true, // This column can be null, meaning the language setting is optional
        defaultValue: 'en', // Set the default value for the language column to 'en' (English)
    }
}, {
    // Model options
    timestamps: true, // Automatically adds 'createdAt' and 'updatedAt' fields to track record creation and updates
    underscored: true, // Uses snake_case for column names (e.g., 'settings_id' instead of 'settingsId')
});

// Define associations
Settings.associate = (models) => {
    Settings.belongsTo(models.User, { foreignKey: 'user_id' }); // Establish a belongsTo association with the User model
};

// Export the Settings model for use in other parts of the application
module.exports = Settings;