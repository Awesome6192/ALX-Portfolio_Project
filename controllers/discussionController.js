// Import the Express module and create a new router instance
const express = require('express');
const router = express.Router();

// Import the Discussion model from the associations models
const { Discussion } = require('../models/associations');

// Route to get all discussions
router.get('/', async (req, res) => {
    try {
        // Retrieve all discussions from the database
        const discussions = await Discussion.findAll();

        // Send the retrieved discussions as a JSON response
        res.json(discussions);
    } catch (error) {
        // Log the error and send a 500 status response with the error message
        console.error('Error fetching discussions:', error.message);
        res.status(500).json({ error: error.message });
    }
});

// Route to create a new discussion
router.post('/', async (req, res) => {
    try {
        // Create a new discussion using the data from the request body
        const newDiscussion = await Discussion.create(req.body);

        // Send a 201 status response with the newly created discussion as JSON
        res.status(201).json(newDiscussion);
    } catch (error) {
        // Log the error and send a 500 status response with the error message
        console.error('Error creating discussion:', error.message);
        res.status(500).json({ error: error.message });
    }
});

// Route to get a discussion by its ID
router.get('/:discussion_id', async (req, res) => {
    try {
        // Retrieve the discussion with the specified ID
        const discussion = await Discussion.findByPk(req.params.discussion_id);

        // If the discussion is not found, send a 404 status response
        if (!discussion) {
            return res.status(404).json({ error: 'Discussion not found' });
        }

        // Send the retrieved discussion as a JSON response
        res.json(discussion);
    } catch (error) {
        // Log the error and send a 500 status response with the error message
        console.error('Error fetching discussion:', error.message);
        res.status(500).json({ error: error.message });
    }
});

// Route to update a discussion by its ID
router.put('/:discussion_id', async (req, res) => {
    try {
        // Retrieve the discussion with the specified ID
        const discussion = await Discussion.findByPk(req.params.discussion_id);

        // If the discussion is not found, send a 404 status response
        if (!discussion) {
            return res.status(404).json({ error: 'Discussion not found' });
        }

        // Update the discussion with the new data from the request body
        await discussion.update(req.body);

        // Send the updated discussion as a JSON response
        res.json(discussion);
    } catch (error) {
        // Log the error and send a 500 status response with the error message
        console.error('Error updating discussion:', error.message);
        res.status(500).json({ error: error.message });
    }
});

// Route to delete a discussion by its ID
router.delete('/:discussion_id', async (req, res) => {
    try {
        // Retrieve the discussion with the specified ID
        const discussion = await Discussion.findByPk(req.params.discussion_id);

        // If the discussion is not found, send a 404 status response
        if (!discussion) {
            return res.status(404).json({ error: 'Discussion not found' });
        }

        // Delete the discussion from the database
        await discussion.destroy();

        // Send a 204 status response to indicate successful deletion
        res.status(204).send();
    } catch (error) {
        // Log the error and send a 500 status response with the error message
        console.error('Error deleting discussion:', error.message);
        res.status(500).json({ error: error.message });
    }
});

// Export the router to be used in other parts of the application
module.exports = router;