// Import necessary modules from Sequelize
const { DataTypes } = require('sequelize'); // Import DataTypes to define model attributes
const sequelize = require('../config/database'); // Import configured Sequelize instance

// Define the Club model
const Club = sequelize.define('Club', {
    // Define the 'club_id' field
    club_id: {
        type: DataTypes.INTEGER, // Specifies the data type as integer
        primaryKey: true, // Sets this field as the primary key of the table
        autoIncrement: true, // Automatically increments the value with each new entry
    },
    // Define the 'name' field
    name: {
        type: DataTypes.STRING(100), // Specifies the data type as string with a maximum length of 100 characters
        allowNull: false, // Indicates that this field cannot be null
        unique: true, // Ensures that each value in this field is unique across all records
    },
    // Define the 'founded' field
    founded: {
        type: DataTypes.DATEONLY, // Specifies the data type as a date without time component
        allowNull: false, // Indicates that this field cannot be null
    },
    // Define the 'stadium' field
    stadium: {
        type: DataTypes.STRING(100), // Specifies the data type as string with a maximum length of 100 characters
        allowNull: false, // Indicates that this field cannot be null
    },
    // Define the 'manager' field
    manager: {
        type: DataTypes.STRING(100), // Specifies the data type as string with a maximum length of 100 characters
        allowNull: false, // Indicates that this field cannot be null
    }
}, {
    // Model options
    timestamps: true, // Automatically adds 'createdAt' and 'updatedAt' fields to track record creation and updates
    underscored: true, // Uses snake_case for column names (e.g., 'club_id' instead of 'clubId')
});

// Export the Club model for use in other parts of the application
module.exports = Club;
