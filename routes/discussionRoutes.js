// Import the necessary modules
const express = require('express'); // Import the Express library
const router = express.Router(); // Create a new router instance
const Discussion = require('../models/discussion'); // Import the Discussion model from the models directory

// Create a new discussion
router.post('/', async (req, res) => {
    try {
        // Destructuring the request body to get discussion details
        const { user_id, club_id, title, body } = req.body; 
        
        // Creating a new discussion record in the database
        const newDiscussion = await Discussion.create({ user_id, club_id, title, body });
        
        // Responding with the created discussion and a 201 status code
        res.status(201).json(newDiscussion); 
    } catch (error) {
        console.error('Error creating discussion:', error); // Logging errors to the console
        // Responding with a 500 status code if creation fails
        res.status(500).json({ error: 'Error creating discussion' }); 
    }
});

// Get all discussions
router.get('/', async (req, res) => {
    try {
        // Fetching all discussions from the database
        const discussions = await Discussion.findAll();
        
        // Responding with the list of discussions and a 200 status code
        res.status(200).json(discussions); 
    } catch (error) {
        console.error('Error fetching discussions:', error); // Logging errors to the console
        // Responding with a 500 status code if fetching fails
        res.status(500).json({ error: 'Error fetching discussions' }); 
    }
});

// Get a discussion by discussion_id
router.get('/:discussion_id', async (req, res) => {
    try {
        // Fetching a discussion by its primary key (discussion_id)
        const discussion = await Discussion.findByPk(req.params.discussion_id); 
        if (discussion) {
            // Responding with the discussion details and a 200 status code if found
            res.status(200).json(discussion); 
        } else {
            // Responding with a 404 status code if the discussion is not found
            res.status(404).json({ error: 'Discussion not found' }); 
        }
    } catch (error) {
        console.error('Error fetching discussion:', error); // Logging errors to the console
        // Responding with a 500 status code if fetching fails
        res.status(500).json({ error: 'Error fetching discussion' }); 
    }
});

// Update a discussion
router.put('/:discussion_id', async (req, res) => {
    try {
        // Destructuring the request body to get updated discussion details
        const { title, body } = req.body; 
        
        // Updating the discussion with the specified discussion_id
        const [updated] = await Discussion.update({ title, body }, {
            where: { discussion_id: req.params.discussion_id }
        });
        
        if (updated) {
            // Fetching the updated discussion details
            const updatedDiscussion = await Discussion.findByPk(req.params.discussion_id);
            
            // Responding with the updated discussion and a 200 status code
            res.status(200).json(updatedDiscussion); 
        } else {
            // Responding with a 404 status code if the discussion is not found
            res.status(404).json({ error: 'Discussion not found' }); 
        }
    } catch (error) {
        console.error('Error updating discussion:', error); // Logging errors to the console
        // Responding with a 500 status code if updating fails
        res.status(500).json({ error: 'Error updating discussion' }); 
    }
});

// Delete a discussion
router.delete('/:discussion_id', async (req, res) => {
    try {
        // Deleting the discussion with the specified discussion_id
        const deleted = await Discussion.destroy({
            where: { discussion_id: req.params.discussion_id }
        });
        
        if (deleted) {
            // Responding with a 204 status code indicating successful deletion with no content
            res.status(204).json(); 
        } else {
            // Responding with a 404 status code if the discussion is not found
            res.status(404).json({ error: 'Discussion not found' }); 
        }
    } catch (error) {
        console.error('Error deleting discussion:', error); // Logging errors to the console
        // Responding with a 500 status code if deletion fails
        res.status(500).json({ error: 'Error deleting discussion' }); 
    }
});

// Exporting the router to be used in other parts of the application
module.exports = router; 