const sequelize = require('./config/database'); // Import the Sequelize instance configured for the database
const User = require('./models/user'); // Import the User model
const Club = require('./models/club'); // Import the Club model
const Discussion = require('./models/discussion'); // Import the Discussion model
const Like = require('./models/like'); // Import the Like model
const Comment = require('./models/comment'); // Import the Comment model
const Notification = require('./models/notification'); // Import the Notification model
const Post = require('./models/post'); // Import the Post model
const Message = require('./models/message'); // Import the Message model
const Settings = require('./models/settings'); // Import the Settings model

// Import associations to define relationships between models
require('./models/associations'); // This module should define all necessary associations between the models

// Function to synchronize all models with the database
const syncDatabase = async () => {
    try {
        // Sync the models with the database
        // `alter: true` updates the schema without dropping existing tables (use migrations for production)
        await sequelize.sync({ alter: true });
        console.log('Database synchronized'); // Log a message indicating successful synchronization
    } catch (error) {
        console.error('Error synchronizing database:', error); // Log any errors encountered during synchronization
    }
};

// Call the syncDatabase function to synchronize the models with the database
syncDatabase();