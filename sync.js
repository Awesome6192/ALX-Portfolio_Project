const sequelize = require('./config/database');
const User = require('./models/user');
const Club = require('./models/club');
const Discussion = require('./models/discussion');
const Like = require('./models/like');
const Comment = require('./models/comment');
const Notification = require('./models/notification');
const Post = require('./models/post');
const Message = require('./models/message');
const Settings = require('./models/settings'); // Include Settings model

// Import associations
require('./models/associations'); // This should define all necessary associations

// Sync all models with the database
const syncDatabase = async () => {
    try {
        // Sync models without dropping existing tables (use migrations in production)
        await sequelize.sync({ alter: true });
        console.log('Database synchronized');
    } catch (error) {
        console.error('Error synchronizing database:', error);
    }
};

syncDatabase();