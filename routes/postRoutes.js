const express = require('express'); // Import the Express library
const router = express.Router(); // Create a new router instance
const postController = require('../controllers/postController'); // Import the postController to handle post-related actions
const authMiddleware = require('../middleware/authMiddleware'); // Import middleware for authentication

// Fetch all posts with pagination (supports ?page=1&limit=10)
router.get('/', postController.getAllPosts);

// Create a new post (only authenticated users)
router.post('/', authMiddleware, postController.createPost);

// Edit a post (only the author of the post can edit it)
router.put('/:id', authMiddleware, postController.editPost);

// Delete a post (only the author of the post can delete it)
router.delete('/:id', authMiddleware, postController.deletePost);

module.exports = router;