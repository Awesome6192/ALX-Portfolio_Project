const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const User = require('./user');
const Discussion = require('./discussion');
const Comment = require('./comment');

const Like = sequelize.define('Like', {
    like_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: User,
            key: 'user_id',
        },
    },
    discussion_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: Discussion,
            key: 'discussion_id',
        },
    },
    comment_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: Comment,
            key: 'comment_id',
        },
    },
    created_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
    },
}, {
    timestamps: false,
    underscored: true,
});

module.exports = Like;