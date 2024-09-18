// models/settings.js
const { DataTypes } = require('sequelize'); // Import DataTypes from Sequelize to define model attributes
const sequelize = require('../config/database'); // Import the configured Sequelize instance from the database configuration

// Define the Settings model
const Settings = sequelize.define('Settings', {
    user_id: {
        type: DataTypes.INTEGER, // Define the type of the 'user_id' column as an integer
        allowNull: false, // This column cannot be null, meaning each setting must be associated with a user
        references: {
            model: 'Users', // Reference the 'Users' model for the foreign key relationship
            key: 'user_id' // Reference the 'user_id' column in the Users model
        }
    },
    username: {
        type: DataTypes.STRING, // Define the type of the 'username' column as a string
        allowNull: true, // This column can be null, meaning the username is optional
    },
    email: {
        type: DataTypes.STRING, // Define the type of the 'email' column as a string
        allowNull: true, // This column can be null, meaning the email is optional
        validate: {
            isEmail: true // Validate that the email follows the correct format
        }
    },
    previousPassword: {
        type: DataTypes.STRING, // Define the type of the 'previousPassword' column as a string
        allowNull: true, // This column can be null, meaning the previous password is optional
    },
    newPassword: {
        type: DataTypes.STRING, // Define the type of the 'newPassword' column as a string
        allowNull: true, // This column can be null, meaning the new password is optional
    },
    confirmPassword: {
        type: DataTypes.STRING, // Define the type of the 'confirmPassword' column as a string
        allowNull: true, // This column can be null, meaning the confirm password is optional
    },
    language: {
        type: DataTypes.STRING, // Define the type of the 'language' column as a string
        allowNull: true, // This column can be null, meaning the language setting is optional
        defaultValue: 'en', // Set the default value for the language column to 'en' (English)
    }
}, {
    timestamps: true, // Automatically adds 'createdAt' and 'updatedAt' fields
    underscored: true, // Uses snake_case for column names in the database
});

// Define associations
Settings.associate = (models) => {
    Settings.belongsTo(models.User, { foreignKey: 'user_id' }); // Establish a belongsTo association with the User model
};

module.exports = Settings; // Export the Settings model for use in other parts of the application