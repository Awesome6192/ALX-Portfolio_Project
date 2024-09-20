// Import the Express module and create a new router instance
const express = require('express');
const router = express.Router();

// Import the Like model from the associations models
const { Like } = require('../models/associations');

// Route to get all likes
router.get('/', async (req, res) => {
    try {
        // Retrieve all likes from the database
        const likes = await Like.findAll();

        // Send the retrieved likes as a JSON response
        res.json(likes);
    } catch (error) {
        // Log the error and send a 500 status response with the error message
        console.error('Error fetching likes:', error.message);
        res.status(500).json({ error: error.message });
    }
});

// Route to create a new like
router.post('/', async (req, res) => {
    try {
        // Create a new like using the data from the request body
        const newLike = await Like.create(req.body);

        // Send a 201 status response with the newly created like as JSON
        res.status(201).json(newLike);
    } catch (error) {
        // Log the error and send a 500 status response with the error message
        console.error('Error creating like:', error.message);
        res.status(500).json({ error: error.message });
    }
});

// Route to get a like by its ID
router.get('/:like_id', async (req, res) => {
    try {
        // Retrieve the like with the specified ID
        const like = await Like.findByPk(req.params.like_id);

        // If the like is not found, send a 404 status response
        if (!like) {
            return res.status(404).json({ error: 'Like not found' });
        }

        // Send the retrieved like as a JSON response
        res.json(like);
    } catch (error) {
        // Log the error and send a 500 status response with the error message
        console.error('Error fetching like:', error.message);
        res.status(500).json({ error: error.message });
    }
});

// Route to update a like by its ID
router.put('/:like_id', async (req, res) => {
    try {
        // Retrieve the like with the specified ID
        const like = await Like.findByPk(req.params.like_id);

        // If the like is not found, send a 404 status response
        if (!like) {
            return res.status(404).json({ error: 'Like not found' });
        }

        // Update the like with the new data from the request body
        await like.update(req.body);

        // Send the updated like as a JSON response
        res.json(like);
    } catch (error) {
        // Log the error and send a 500 status response with the error message
        console.error('Error updating like:', error.message);
        res.status(500).json({ error: error.message });
    }
});

// Route to delete a like by its ID
router.delete('/:like_id', async (req, res) => {
    try {
        // Retrieve the like with the specified ID
        const like = await Like.findByPk(req.params.like_id);

        // If the like is not found, send a 404 status response
        if (!like) {
            return res.status(404).json({ error: 'Like not found' });
        }

        // Delete the like from the database
        await like.destroy();

        // Send a 204 status response to indicate successful deletion
        res.status(204).send();
    } catch (error) {
        // Log the error and send a 500 status response with the error message
        console.error('Error deleting like:', error.message);
        res.status(500).json({ error: error.message });
    }
});

// Export the router to be used in other parts of the application
module.exports = router;