const { Post } = require('../models/associations'); // Adjust the path to your models

// Fetch all posts with pagination
exports.getAllPosts = async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    try {
        const posts = await Post.findAndCountAll({
            limit,
            offset,
            order: [['created_at', 'DESC']], // Adjust ordering as needed
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

// Create a new post
exports.createPost = async (req, res) => {
    const { title, body } = req.body;

    try {
        const newPost = await Post.create({
            title,
            body,
            user_id: req.user.id, // Assuming the user ID is attached from the authMiddleware
        });

        res.status(201).json(newPost);
    } catch (error) {
        console.error('Error creating post:', error.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

// Edit a post
exports.editPost = async (req, res) => {
    const { id } = req.params;
    const { title, body } = req.body;

    try {
        const post = await Post.findByPk(id);

        if (!post) {
            return res.status(404).json({ error: 'Post not found' });
        }

        // Check if the logged-in user is the author of the post
        if (post.user_id !== req.user.id) {
            return res.status(403).json({ error: 'You do not have permission to edit this post' });
        }

        post.title = title || post.title;
        post.body = body || post.body;
        await post.save();

        res.json(post);
    } catch (error) {
        console.error('Error updating post:', error.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

// Delete a post
exports.deletePost = async (req, res) => {
    const { id } = req.params;

    try {
        const post = await Post.findByPk(id);

        if (!post) {
            return res.status(404).json({ error: 'Post not found' });
        }

        // Check if the logged-in user is the author of the post
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