// Import necessary modules from Sequelize
const { DataTypes } = require('sequelize');

// Import the sequelize instance from the database configuration file
const sequelize = require('../config/database'); // Ensure this path is correct

// Define the Message model
const Message = sequelize.define('Message', {
  // Define the 'id' field
  id: {
    type: DataTypes.INTEGER, // Specifies the data type as integer
    primaryKey: true, // Marks this field as the primary key
    autoIncrement: true, // Automatically increments the value for each new record
  },
  // Define the 'chat_id' field
  chat_id: {
    type: DataTypes.STRING, // Specifies the data type as string
    allowNull: false, // This field is required (cannot be null)
  },
  // Define the 'user_id' field
  user_id: {
    type: DataTypes.INTEGER, // Specifies the data type as integer
    allowNull: false, // This field is required (cannot be null)
    references: {
      model: 'Users', // References the Users table (ensure the model/table name matches)
      key: 'user_id', // References the primary key in the Users table
    }
  },
  // Define the 'discussion_id' field
  discussion_id: {
    type: DataTypes.INTEGER, // Specifies the data type as integer
    allowNull: true, // This field is optional (can be null)
    references: {
      model: 'Discussions', // References the Discussions table (ensure the model/table name matches)
      key: 'discussion_id', // References the primary key in the Discussions table
    }
  },
  // Define the 'content' field
  content: {
    type: DataTypes.TEXT, // Specifies the data type as text
    allowNull: false, // This field is required (cannot be null)
  },
}, {
  // Model options
  timestamps: true, // Automatically adds 'createdAt' and 'updatedAt' fields to track record creation and updates
  underscored: true, // Uses snake_case for column names (e.g., 'message_id' instead of 'messageId')
});

// Export the Message model for use in other parts of the application
module.exports = Message;