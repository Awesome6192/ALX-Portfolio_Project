const express = require('express');
const router = express.Router();
const postController = require('../controllers/postController');
const authMiddleware = require('../middleware/authMiddleware');

// Fetch all posts with pagination (supports ?page=1&limit=10)
router.get('/', postController.getAllPosts);

// Create a new post (only authenticated users)
router.post('/', authMiddleware, postController.createPost);

// Edit a post (only the author of the post can edit it)
router.put('/:id', authMiddleware, postController.editPost);

// Delete a post (only the author of the post can delete it)
router.delete('/:id', authMiddleware, postController.deletePost);

module.exports = router;