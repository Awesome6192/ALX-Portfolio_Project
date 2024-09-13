const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const User = require('./user');
const Discussion = require('./discussion');

const Comment = sequelize.define('Comment', {
    comment_id: {
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
    discussion_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Discussion,
            key: 'discussion_id'
        },
    },
    comment_text: {
        type: DataTypes.TEXT,
        allowNull: false,
    }
}, {
    timestamps: true,
    underscored: true,
});

module.exports = Comment;