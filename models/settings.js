// models/settings.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Settings = sequelize.define('Settings', {
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'Users', // Ensure this matches the model name used in User model
            key: 'user_id' // Ensure this matches the primary key column name in User model
        }
    },
    username: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    email: {
        type: DataTypes.STRING,
        allowNull: true,
        validate: {
            isEmail: true // Validate email format
        }
    },
    previousPassword: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    newPassword: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    confirmPassword: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    language: {
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue: 'en', // Default language
    }
}, {
    timestamps: true,
    underscored: true, // Ensures snake_case column names
});

// Define associations
Settings.associate = (models) => {
    Settings.belongsTo(models.User, { foreignKey: 'user_id' });
};

module.exports = Settings;