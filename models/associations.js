// models/associations.js
const User = require('./user');
const Discussion = require('./discussion');
const Comment = require('./comment');
const Notification = require('./notification');
const Club = require('./club');
const Like = require('./like');

// Define associations

// User to Discussions
User.hasMany(Discussion, { foreignKey: 'user_id' });
Discussion.belongsTo(User, { foreignKey: 'user_id' });

// Discussion to Comments
Discussion.hasMany(Comment, { foreignKey: 'discussion_id' });
Comment.belongsTo(Discussion, { foreignKey: 'discussion_id' });

// User to Comments
User.hasMany(Comment, { foreignKey: 'user_id' });
Comment.belongsTo(User, { foreignKey: 'user_id' });

// User to Notifications
User.hasMany(Notification, { foreignKey: 'user_id' });
Notification.belongsTo(User, { foreignKey: 'user_id' });

// Club to Discussions
Club.hasMany(Discussion, { foreignKey: 'club_id' });
Discussion.belongsTo(Club, { foreignKey: 'club_id' });

// Like to User
User.hasMany(Like, { foreignKey: 'user_id' });
Like.belongsTo(User, { foreignKey: 'user_id' });

// Like to Discussion
Discussion.hasMany(Like, { foreignKey: 'discussion_id' });
Like.belongsTo(Discussion, { foreignKey: 'discussion_id' });

// Like to Comment
Comment.hasMany(Like, { foreignKey: 'comment_id' });
Like.belongsTo(Comment, { foreignKey: 'comment_id' });


module.exports = { User, Discussion, Comment, Notification, Club, Like };