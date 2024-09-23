// Import the necessary modules
const express = require('express'); // Import the Express library
const router = express.Router(); // Create a new router instance
const authMiddleware = require('../middleware/authMiddleware');
const Like = require('../models/like'); // Import the Like model from the models directory

// Create a new like
router.post('/:postId/like', async (req, res) => {
    try {
        const user_id = getUserIdFromCookies(); // Retrieve user_id from cookies
        const postId = req.params.postId;

        // Validate that user_id is found
        if (!user_id) {
            return res.status(400).json({ error: 'User ID not found' });
        }

        // Create a new like record in the database
        const newLike = await Like.create({
            user_id,
            post_id: postId // Store post_id instead of discussion_id
        });

        res.status(201).json(newLike);
    } catch (error) {
        console.error('Error creating like:', error);
        res.status(500).json({ error: 'Error creating like' });
    }
});


// Get all likes for a content type and ID
router.get('/', async (req, res) => {
    try {
        // Extract content_type and content_id from query parameters
        const { content_type, content_id } = req.query;

        // Validate that both parameters are provided
        if (!content_type || !content_id) {
            return res.status(400).json({ error: 'Content type and content ID are required' });
        }
        
        // Fetch all likes that match the provided content_type and content_id
        const likes = await Like.findAll({
            where: { content_type, content_id }
        });
        
        // Respond with the list of likes and a 200 status code
        res.status(200).json(likes); 
    } catch (error) {
        console.error('Error fetching likes:', error);
        res.status(500).json({ error: 'Error fetching likes' }); 
    }
});


// Get a like by like_id
router.get('/:like_id', async (req, res) => {
    try {
        // Fetch a like by its primary key (like_id)
        const like = await Like.findByPk(req.params.like_id);
        if (like) {
            // Respond with the like details and a 200 status code if found
            res.status(200).json(like); 
        } else {
            // Respond with a 404 status code if the like is not found
            res.status(404).json({ error: 'Like not found' }); 
        }
    } catch (error) {
        console.error('Error fetching like:', error); // Log any errors to the console
        // Respond with a 500 status code if an error occurs
        res.status(500).json({ error: 'Error fetching like' }); 
    }
});

// Update a like
router.put('/:like_id', async (req, res) => {
    try {
        // Destructure the request body to get updated like details
        const { user_id, content_type, content_id } = req.body;
        
        // Update the like with the specified like_id
        const [updated] = await Like.update({ user_id, content_type, content_id }, {
            where: { like_id: req.params.like_id }
        });
        
        if (updated) {
            // Fetch the updated like details
            const updatedLike = await Like.findByPk(req.params.like_id);
            // Respond with the updated like and a 200 status code
            res.status(200).json(updatedLike); 
        } else {
            // Respond with a 404 status code if the like is not found
            res.status(404).json({ error: 'Like not found' }); 
        }
    } catch (error) {
        console.error('Error updating like:', error); // Log any errors to the console
        // Respond with a 500 status code if an error occurs
        res.status(500).json({ error: 'Error updating like' }); 
    }
});

// Delete a like
router.delete('/:like_id', async (req, res) => {
    try {
        // Delete the like with the specified like_id
        const deleted = await Like.destroy({
            where: { like_id: req.params.like_id }
        });
        if (deleted) {
            // Respond with a 204 status code indicating successful deletion with no content
            res.status(204).json(); 
        } else {
            // Respond with a 404 status code if the like is not found
            res.status(404).json({ error: 'Like not found' }); 
        }
    } catch (error) {
        console.error('Error deleting like:', error); // Log any errors to the console
        // Respond with a 500 status code if an error occurs
        res.status(500).json({ error: 'Error deleting like' }); 
    }
});

// Export the router to be used in other parts of the application
module.exports = router; 