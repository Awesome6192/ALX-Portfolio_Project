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

    socket.on('joinChat', (chatId) => {
        console.log(`User joined chat: ${chatId}`);
        socket.join(chatId); // Join the chat room
    });

    socket.on('sendMessage', async (data) => {
        console.log(`Received message: ${data.content} in chat ${data.chatId}`);

        // Check if the content is present and not null
        if (data.content) {
            io.to(data.chatId).emit('receiveMessage', data);

            // Optionally save message to database
            try {
                await sequelize.models.Message.create(data);
            } catch (error) {
                console.error('Error saving message:', error);
            }
        } else {
            console.error('Message content is missing');
        }
    });

    socket.on('disconnect', () => {
        console.log('Client disconnected');
    });
});

server.listen(3000, () => {
    console.log('Server is running on http://localhost:3000');
});