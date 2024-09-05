const express = require('express');
const router = express.Router();
const Post = require('../models/Post');

// Fetch all posts
router.get('/', async (req, res) => {
    try {
        const posts = await Post.findAll();
        res.json({ posts });
    } catch (error) {
        console.error('Error fetching posts:', error);
        res.status(500).json({ message: 'Error fetching posts' });
    }
});

// Create a new post
router.post('/', async (req, res) => {
    try {
        const { content } = req.body;
        if (!content) return res.status(400).json({ message: 'Content is required' });

        const post = await Post.create({ content });
        res.status(201).json({ post });
    } catch (error) {
        console.error('Error creating post:', error);
        res.status(500).json({ message: 'Error creating post' });
    }
});

module.exports = router;