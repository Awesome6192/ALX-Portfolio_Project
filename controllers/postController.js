// Import the Post model from the associations models
const { Post, User } = require('../models/associations');

// Import multer for handling file uploads
const multer = require('multer');

// Import path to handle file paths
const path = require('path');

// Set up storage for images and videos
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

// Specify which fields to accept for uploading
const upload = multer({
    storage: storage,
    limits: { fileSize: 1024 * 1024 * 10 },
}).fields([{ name: 'image' }, { name: 'video' }]);

// Middleware for authentication (ensure you define this)
const authMiddleware = require('../middleware/authMiddleware');

// Function to fetch all posts with pagination
const getAllPosts = async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    try {
        const posts = await Post.findAndCountAll({
            limit,
            offset,
            order: [['created_at', 'DESC']],
            include: [{
                model: User,
                attributes: ['username'],
            }],
        });

        res.json({
            totalPosts: posts.count,
            totalPages: Math.ceil(posts.count / limit),
            currentPage: page,
            posts: posts.rows,
        });
    } catch (error) {
        console.error('Error fetching posts:', error.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

// Function to create a new post
const createPost = async (req, res) => {
    const { content } = req.body;
    const image_url = req.files['image'] ? req.files['image'][0].path : null; 
    const video_url = req.files['video'] ? req.files['video'][0].path : null;

    console.log('Authenticated user:', req.user);

    // Check if content is provided; if not, respond with a 400 status code
    if (!content) {
        return res.status(400).json({ error: 'Content is required' });
    }

    try {
        // Create a new post in the database with the provided details and user ID
        const newPost = await Post.create({
            content,
            image_url,
            video_url,
            user_id: req.user.user_id,
        });

        res.status(201).json(newPost);
    } catch (error) {
        console.error('Error creating post:', error.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

// Function to edit an existing post
const editPost = async (req, res) => {
    const { post_id } = req.params;
    const { content } = req.body;
    const post = await Post.findByPk(post_id);

    if (!post) {
        return res.status(404).json({ error: 'Post not found' });
    }

    if (post.user_id !== req.user.id) {
        return res.status(403).json({ error: 'You do not have permission to edit this post' });
    }

    // Update fields based on provided content
    post.content = content || post.content;
    // Optionally handle image/video updates here

    await post.save();
    res.json(post);
};

// Function to delete a post
const deletePost = async (req, res) => {
    const { post_id } = req.params;

    try {
        const post = await Post.findByPk(post_id);
        if (!post) {
            return res.status(404).json({ error: 'Post not found' });
        }

        if (post.user_id !== req.user.id) {
            return res.status(403).json({ error: 'You do not have permission to delete this post' });
        }

        await post.destroy();
        res.json({ message: 'Post deleted successfully' });
    } catch (error) {
        console.error('Error deleting post:', error.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

// Export the controller functions
module.exports = {
    getAllPosts,
    createPost,
    editPost,
    deletePost,
};