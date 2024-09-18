const express = require('express');
const session = require('express-session');
const cors = require('cors');
const path = require('path');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');
const http = require('http');
const socketIo = require('socket.io');
const sequelize = require('./config/database');
const authMiddleware = require('./middleware/authMiddleware');
const errorHandler = require('./middleware/errorHandler');

// Load environment variables
dotenv.config();

// Import models
const User = require('./models/user');
const Club = require('./models/club');
const Discussion = require('./models/discussion');
const Like = require('./models/like');
const Comment = require('./models/comment');
const Notification = require('./models/notification');
const Post = require('./models/post');
const Message = require('./models/message');
const Settings = require('./models/settings');

// Import associations to define relationships between models
require('./models/associations'); // This module should define all necessary associations between the models

// Function to synchronize all models with the database
const syncDatabase = async () => {
    try {
        // Sync the models with the database
        await sequelize.sync({ alter: true }); // Be cautious with { force: true } as it drops existing tables
        console.log('Database synchronized');
    } catch (error) {
        console.error('Error synchronizing database:', error);
        process.exit(1); // Exit process if sync fails
    }
};

// Call the syncDatabase function to synchronize the models with the database
syncDatabase().then(() => {
    // Initiate app and server
    const app = express();
    const server = http.createServer(app);
    const io = socketIo(server);

    // Enable CORS
    app.use(cors({
        origin: 'http://localhost:3000',
        credentials: true
    }));

    // Session middleware
    app.use(session({
        secret: process.env.SESSION_SECRET || 'your-secret-key',
        resave: false,
        saveUninitialized: false,
        cookie: { secure: false, httpOnly: true, sameSite: 'lax' }
    }));

    // Middleware
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));
    app.use(cookieParser());

    // Serve static files
    app.use(express.static(path.join(__dirname, 'public')));

    // Import and use routes
    const discussionRoutes = require('./routes/discussionRoutes');
    const notificationRoutes = require('./routes/notificationRoutes');
    const clubRoutes = require('./routes/clubRoutes');
    const userRoutes = require('./routes/userRoutes');
    const likeRoutes = require('./routes/likeRoutes');
    const commentRoutes = require('./routes/commentRoutes');
    const postRoutes = require('./routes/postRoutes');
    const chatRoutes = require('./routes/chatRoutes');
    const settingsRoutes = require('./routes/settingsRoutes'); // Import settings routes

    app.use('/api/discussions', discussionRoutes);
    app.use('/api/notifications', notificationRoutes);
    app.use('/api/clubs', clubRoutes);
    app.use('/api/user', userRoutes);
    app.use('/api/likes', likeRoutes);
    app.use('/api/comments', commentRoutes);
    app.use('/api/posts', postRoutes);
    app.use('/api/messages', chatRoutes);
    app.use('/api/settings', settingsRoutes); // Use settings routes

    // Serve HTML files
    app.get('/profile', authMiddleware, (req, res) => {
        res.sendFile(path.join(__dirname, 'public', 'profile.html'));
    });

    app.get('/', (req, res) => {
        res.sendFile(path.join(__dirname, 'public', 'index.html'));
    });

    app.get('/chat', authMiddleware, (req, res) => {
        res.sendFile(path.join(__dirname, 'public', 'chat.html'));
    });

    // Handle errors
    app.use(errorHandler);

    // Socket.IO event handlers
    io.on('connection', (socket) => {
        console.log('New client connected');

        socket.on('joinChat', (chat_id) => {
            console.log(`User joined chat: ${chat_id}`);
            socket.join(chat_id); // Join the chat room
        });

        socket.on('sendMessage', async (data) => {
            console.log('Received message data:', data); // Debugging
        
            // Check if the content and chat_id are present
            if (data.content && data.chat_id) {
                // Convert user_id to integer if it is a string
                if (typeof data.user_id === 'string') {
                    data.user_id = parseInt(data.user_id, 10);
                }
        
                // Validate converted user_id
                if (typeof data.user_id === 'number' && !isNaN(data.user_id)) {
                    io.to(data.chat_id).emit('receiveMessage', data);
        
                    // Optionally save message to database
                    try {
                        const message = await sequelize.models.Message.create(data);
                        console.log('Message saved:', message); // Debugging
                    } catch (error) {
                        console.error('Error saving message:', error);
                    }
                } else {
                    console.error('Invalid user_id:', data.user_id);
                }
            } else {
                console.error('Message data is missing required fields:', data);
            }
        });            
        
        socket.on('disconnect', () => {
            console.log('Client disconnected');
        });
    });

    server.listen(3000, () => {
        console.log('Server is running on http://localhost:3000');
    });
});