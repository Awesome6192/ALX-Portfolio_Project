const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const User = require('./user');
const Club = require('./club');

const Discussion = sequelize.define('Discussion', {
    discussion_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: User,
            key: 'user_id'
        },
    },
    club_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Club,
            key: 'club_id'
        },
    },
    title: {
        type: DataTypes.STRING(255),
        allowNull: false,
    },
    body: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    created_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
    },
    updated_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
    },
}, {
    timestamps: true,
    underscored: true,
});

module.exports = Discussion;