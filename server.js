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
const { TwitterApi } = require('twitter-api-v2');

// Load environment variables
dotenv.config();

// Twitter API credentials
const twitterClient = new TwitterApi({
    appKey: process.env.TWITTER_API_KEY,
    appSecret: process.env.TWITTER_API_SECRET_KEY,
    accessToken: process.env.TWITTER_ACCESS_TOKEN,
    accessSecret: process.env.TWITTER_ACCESS_TOKEN_SECRET,
});

// Initiate our app
const app = express();
const server = http.createServer(app);
const io = socketIo(server);

// Access the JWT secret from environment variables
const jwtSecret = process.env.JWT_SECRET;

// Enable CORS for all origins with credentials
app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true // Allow cookies to be sent with requests
}));

// Session middleware
app.use(session({
    secret: process.env.SESSION_SECRET || 'your-secret-key',
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: false,
        httpOnly: true,
        sameSite: 'lax'
    }
}));

// Middleware to handle incoming data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Log cookies for debugging
app.use((req, res, next) => {
    console.log('Request Cookies:', req.cookies);
    next();
});

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));

// Import routes
const discussionRoutes = require('./routes/discussionRoutes');
const notificationRoutes = require('./routes/notificationRoutes');
const clubRoutes = require('./routes/clubRoutes');
const userRoutes = require('./routes/userRoutes');
const likeRoutes = require('./routes/likeRoutes');
const commentRoutes = require('./routes/commentRoutes');

// Twitter API route
app.get('/api/tweet/:id', async (req, res) => {
    const tweetId = req.params.id;
    try {
        const tweet = await twitterClient.v2.singleTweet(tweetId);
        res.json(tweet);
    } catch (error) {
        console.error('Error fetching tweet:', error);
        res.status(500).json({ error: 'Error fetching tweet' });
    }
});

// Mock data for posts (in-memory array)
let posts = [
    { id: 1, content: 'Hello World!' },
    { id: 2, content: 'Another post!' }
];

// Route to fetch all posts
app.get('/api/posts', (req, res) => {
    res.json({ posts });
});

// Route to create a new post
app.post('/api/posts', (req, res) => {
    const { content } = req.body;
    if (!content) {
        return res.status(400).json({ error: 'Content is required' });
    }
    const newPost = { id: posts.length + 1, content };
    posts.push(newPost);
    res.json({ success: true, post: newPost });
});

// Socket.IO handling
io.on('connection', (socket) => {
    console.log('New client connected');

    // Join a specific chat room (if needed)
    socket.on('joinChat', (chatId) => {
        socket.join(chatId);
        console.log(`User joined chat ${chatId}`);
    });

    // Handle sending messages (if applicable)
    socket.on('sendMessage', (data) => {
        io.to(data.chatId).emit('receiveMessage', data);
        // Save message to database
        // Add your database saving logic here
    });

    // Handle new notifications
    socket.on('newNotification', (notification) => {
        // Broadcast the new notification to all clients
        io.emit('receiveNotification', notification);
    });

    socket.on('disconnect', () => {
        console.log('Client disconnected');
    });
});

// Sync models with the database
sequelize.sync({ alter: true })
    .then(() => {
        console.log('Database synced.');
    })
    .catch(error => {
        console.error('Error syncing database:', error);
    });

// Use routes with logging for debugging
app.use('/api/discussions', (req, res, next) => {
    console.log('Discussions route hit');
    next();
}, discussionRoutes);

app.use('/api/notifications', (req, res, next) => {
    console.log('Notifications route hit');
    next();
}, notificationRoutes);

app.use('/api/clubs', (req, res, next) => {
    console.log('Clubs route hit');
    next();
}, clubRoutes);

app.use('/api/user', (req, res, next) => {
    console.log('Users route hit');
    next();
}, userRoutes);

app.use('/api/likes', (req, res, next) => {
    console.log('Likes route hit');
    next();
}, likeRoutes);

app.use('/api/comments', (req, res, next) => {
    console.log('Comments route hit');
    next();
}, commentRoutes);

// Serve profile.html
app.get('/profile', authMiddleware, (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'profile.html'));
});

// Serve static files
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Serve chat.html
app.get('/chat', authMiddleware, (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'chat.html'));
});

// Handle errors
app.use((err, req, res, next) => {
    console.error('Error:', err.stack);
    res.status(500).send('Something broke!');
});

server.listen(3000, () => {
    console.log('Server is running on http://localhost:3000');
});