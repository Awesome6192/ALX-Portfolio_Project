const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Club = sequelize.define('Club', {
    club_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    name: {
        type: DataTypes.STRING(100),
        allowNull: false,
        unique: true,
    },
    founded: {
        type: DataTypes.DATEONLY,
        allowNull: false,
    },
    stadium: {
        type: DataTypes.STRING(100),
        allowNull: false,
    },
    manager: {
        type: DataTypes.STRING(100),
        allowNull: false,
    }
}, {
    timestamps: true, // Automatically handles createdAt and updatedAt
    underscored: true, // Uses snake_case for column names
});

module.exports = Club;