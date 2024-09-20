// Existing imports and setup code remain the same
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
require('./models/associations');

// Function to synchronize all models with the database
const syncDatabase = async () => {
    try {
        await sequelize.sync({ alter: true });
        console.log('Database synchronized');
    } catch (error) {
        console.error('Error synchronizing database:', error);
        process.exit(1);
    }
};

// Call the syncDatabase function to synchronize the models with the database
syncDatabase().then(() => {
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
        saveUninitialized: true,
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
    const settingsRoutes = require('./routes/settingsRoutes');

    app.use('/api/discussions', discussionRoutes);
    app.use('/api/notifications', notificationRoutes);
    app.use('/api/clubs', clubRoutes);
    app.use('/api/user', userRoutes);
    app.use('/api/likes', likeRoutes);
    app.use('/api/comments', commentRoutes);
    app.use('/api/posts', postRoutes);
    app.use('/api/messages', chatRoutes);
    app.use('/api/settings', settingsRoutes);

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

    // Socket.IO middleware to authenticate users
    io.use((socket, next) => {
        const req = socket.request;
        session({
            secret: process.env.SESSION_SECRET || 'your-secret-key',
            resave: false,
            saveUninitialized: false,
            cookie: { secure: false, httpOnly: true, sameSite: 'lax' }
        })(socket.request, {}, (err) => {
            if (err) return next(err);
            next();
        });
    });

    // Socket.IO event handlers
    io.on('connection', (socket) => {
        console.log('New client connected');

        // Check the session data
        console.log('Session data:', socket.request.session);
    
        // Verify the user ID from the session
        const currentUser_id = socket.request.session.user_id; // Fetch user_id from session
        console.log('User connected with user_id:', currentUser_id);
    
        // Listen for the user_connected event
        socket.on('user_connected', (data) => {
            const { user_id } = data; // Extract user_id
            if (user_id) {
                console.log(`User connected with user_id: ${user_id}`);
                // Store the user ID on the socket for future reference
                socket.user_id = user_id; // Or store it in a way that suits your application
            } else {
                console.log('User not found');
            }
        });        
    
        // Event handler for joining a chat room
        socket.on('joinChat', (chat_id) => {
            if (currentUser_id) {
                console.log(`User connected with user_id: ${currentUser_id}`);
                // Add user to the chat room
                socket.join(chat_id);
                // Notify others in the chat
                socket.to(chat_id).emit('userJoined', { user_id: currentUser_id });
            } else {
                console.error('User not found');
            }
        });

        // Event handler for sending a message
        socket.on('sendMessage', async (data) => {
            console.log('Received message data:', data); // General logging

            // Log user_id for debugging
            console.log('Received user ID (on server):', data.user_id);

            // Validate and process the message data
            if (data.content && data.chat_id) {
                // Convert user_id to integer if it is a string
                if (typeof data.user_id === 'string') {
                    data.user_id = parseInt(data.user_id, 10);
                }

                // Validate the user_id
                if (typeof data.user_id === 'number' && !isNaN(data.user_id)) {
                    // Emit the message to the specified chat room
                    io.to(data.chat_id).emit('receiveMessage', data);

                    // Optionally save the message to the database
                    try {
                        const messageData = {
                            chat_id: data.chat_id,
                            user_id: data.user_id,
                            content: data.content,
                            discussion_id: data.discussion_id || null,
                        };

                        const message = await sequelize.models.Message.create(messageData);
                        console.log('Message saved:', message); // Debugging
                    } catch (error) {
                        console.error('Error saving message:', error);
                    }
                } else {
                    console.error('Invalid user_id:', data.user_id);
                }
            } else {
                console.error('Message data is missing required fields:', {
                    content: data.content,
                    chat_id: data.chat_id,
                    user_id: data.user_id,
                    discussion_id: data.discussion_id, // Optional
                });
            }
        });

        // Handle disconnection
        socket.on('disconnect', () => {
            console.log('Client disconnected');
        });
    });

    server.listen(3000, () => {
        console.log('Server is running on http://localhost:3000');
    });
});