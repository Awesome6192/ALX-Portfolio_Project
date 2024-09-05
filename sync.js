const sequelize = require('./config/database');
const User = require('./models/user');
const Club = require('./models/club');
const Discussion = require('./models/discussion');
const Like = require('./models/like');
const Comment = require('./models/comment');
const Notification = require('./models/notification');

// Define associations
// (Assuming that associations are defined in a separate file or here)

// Example associations (adapt according to your actual model relationships)
User.hasMany(Like, { foreignKey: 'user_id' });
Like.belongsTo(User, { foreignKey: 'user_id' });

User.hasMany(Comment, { foreignKey: 'user_id' });
Comment.belongsTo(User, { foreignKey: 'user_id' });

User.hasMany(Notification, { foreignKey: 'user_id' });
Notification.belongsTo(User, { foreignKey: 'user_id' });

// Sync all models with the database
const syncDatabase = async () => {
    try {
        // Sync models without dropping existing tables
        await sequelize.sync({ alter: true });
        console.log('Database synchronized');
    } catch (error) {
        console.error('Error synchronizing database:', error);
    }
};

syncDatabase();