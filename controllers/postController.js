// Import the Post model from the associations models
const { Post } = require('../models/associations');

// Middleware for authentication (ensure you define this)
const authMiddleware = require('../middleware/authMiddleware');

// Function to fetch all posts with pagination
const getAllPosts = async (req, res) => {
    // Parse the page and limit from query parameters, defaulting to 1 and 10 respectively
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit; // Calculate the offset for pagination

    try {
        // Fetch posts from the database with pagination and order by creation date
        const posts = await Post.findAndCountAll({
            limit, // Maximum number of posts to return
            offset, // Number of posts to skip based on the page
            order: [['created_at', 'DESC']], // Order posts by creation date in descending order
        });

        // Respond with the total number of posts, total pages, current page, and the fetched posts
        res.json({
            totalPosts: posts.count,
            totalPages: Math.ceil(posts.count / limit),
            currentPage: page,
            posts: posts.rows,
        });
    } catch (error) {
        // Log the error and respond with a 500 status code for internal server errors
        console.error('Error fetching posts:', error.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

// Function to create a new post
const createPost = async (req, res) => {
    // Destructure content, image_url, and video_url from the request body
    const { content, image_url, video_url } = req.body;

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
            user_id: req.user.id, // Get the user ID from the authenticated user
        });

        // Respond with a 201 status code and the newly created post
        res.status(201).json(newPost);
    } catch (error) {
        // Log the error and respond with a 500 status code for internal server errors
        console.error('Error creating post:', error.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

// Function to edit an existing post
const editPost = async (req, res) => {
    // Extract post_id from the request parameters
    const { post_id } = req.params;
    // Destructure content, image_url, and video_url from the request body
    const { content, image_url, video_url } = req.body;

    try {
        // Find the post by its ID
        const post = await Post.findByPk(post_id);

        // If the post is not found, respond with a 404 status code
        if (!post) {
            return res.status(404).json({ error: 'Post not found' });
        }

        // Check if the authenticated user is the owner of the post
        if (post.user_id !== req.user.id) {
            return res.status(403).json({ error: 'You do not have permission to edit this post' });
        }

        // Update the post's fields if new values are provided
        post.content = content || post.content;
        post.image_url = image_url || post.image_url;
        post.video_url = video_url || post.video_url;

        // Save the updated post to the database
        await post.save();

        // Respond with the updated post
        res.json(post);
    } catch (error) {
        // Log the error and respond with a 500 status code for internal server errors
        console.error('Error updating post:', error.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

// Function to delete a post
const deletePost = async (req, res) => {
    // Extract post_id from the request parameters
    const { post_id } = req.params;

    try {
        // Find the post by its ID
        const post = await Post.findByPk(post_id);

        // If the post is not found, respond with a 404 status code
        if (!post) {
            return res.status(404).json({ error: 'Post not found' });
        }

        // Check if the authenticated user is the owner of the post
        if (post.user_id !== req.user.id) {
            return res.status(403).json({ error: 'You do not have permission to delete this post' });
        }

        // Delete the post from the database
        await post.destroy();
        // Respond with a success message
        res.json({ message: 'Post deleted successfully' });
    } catch (error) {
        // Log the error and respond with a 500 status code for internal server errors
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