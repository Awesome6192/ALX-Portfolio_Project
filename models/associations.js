const User = require('./user');
const Discussion = require('./discussion');
const Comment = require('./comment');
const Notification = require('./notification');
const Club = require('./club');
const Like = require('./like');
const Post = require('./post');
const Message = require('./message');
const Settings = require('./settings');

// User Associations
User.hasMany(Discussion, { foreignKey: 'user_id' });
Discussion.belongsTo(User, { foreignKey: 'user_id' });

User.hasMany(Comment, { foreignKey: 'user_id' });
Comment.belongsTo(User, { foreignKey: 'user_id' });

User.hasMany(Notification, { foreignKey: 'user_id' });
Notification.belongsTo(User, { foreignKey: 'user_id' });

User.hasMany(Like, { foreignKey: 'user_id' });
Like.belongsTo(User, { foreignKey: 'user_id' });

User.hasMany(Post, { foreignKey: 'user_id' });
Post.belongsTo(User, { foreignKey: 'user_id' });

User.hasMany(Message, { foreignKey: 'user_id' });
Message.belongsTo(User, { foreignKey: 'user_id' });

User.hasOne(Settings, { foreignKey: 'user_id' });
Settings.belongsTo(User, { foreignKey: 'user_id' });

// Discussion Associations
Discussion.hasMany(Comment, { foreignKey: 'discussion_id' });
Comment.belongsTo(Discussion, { foreignKey: 'discussion_id' });

Discussion.hasMany(Like, { foreignKey: 'discussion_id' });
Like.belongsTo(Discussion, { foreignKey: 'discussion_id' });

Discussion.hasMany(Message, { foreignKey: 'discussion_id' });
Message.belongsTo(Discussion, { foreignKey: 'discussion_id' });

// Comment Associations
Comment.hasMany(Like, { foreignKey: 'comment_id' });
Like.belongsTo(Comment, { foreignKey: 'comment_id' });

// Post Associations
Post.hasMany(Comment, { foreignKey: 'post_id' });
Comment.belongsTo(Post, { foreignKey: 'post_id' });

Post.hasMany(Like, { foreignKey: 'post_id' });
Like.belongsTo(Post, { foreignKey: 'post_id' });

// Club Associations
Club.hasMany(Discussion, { foreignKey: 'club_id' });
Discussion.belongsTo(Club, { foreignKey: 'club_id' });

module.exports = { User, Discussion, Comment, Notification, Club, Like, Post, Message, Settings };