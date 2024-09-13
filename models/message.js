// models/message.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database'); // Ensure this path is correct

const Message = sequelize.define('Message', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  chatId: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  content: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  // other fields...
}, {
  timestamps: true,
  underscored: true,
});

module.exports = Message;