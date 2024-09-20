// Import the Express module and create a new router instance
const express = require('express');
const router = express.Router();

// Import the Club model from the associations models
const { Club } = require('../models/associations');

// Route to get all clubs
router.get('/', async (req, res) => {
    try {
        // Retrieve all clubs from the database
        const clubs = await Club.findAll();

        // Send the retrieved clubs as a JSON response
        res.json(clubs);
    } catch (error) {
        // Log the error and send a 500 status response with the error message
        console.error('Error fetching clubs:', error.message);
        res.status(500).json({ error: error.message });
    }
});

// Route to create a new club
router.post('/', async (req, res) => {
    try {
        // Create a new club using the data from the request body
        const newClub = await Club.create(req.body);

        // Send a 201 status response with the newly created club as JSON
        res.status(201).json(newClub);
    } catch (error) {
        // Log the error and send a 500 status response with the error message
        console.error('Error creating club:', error.message);
        res.status(500).json({ error: error.message });
    }
});

// Route to get a club by its ID
router.get('/:club_id', async (req, res) => {
    try {
        // Retrieve the club with the specified ID
        const club = await Club.findByPk(req.params.club_id);

        // If the club is not found, send a 404 status response
        if (!club) {
            return res.status(404).json({ error: 'Club not found' });
        }

        // Send the retrieved club as a JSON response
        res.json(club);
    } catch (error) {
        // Log the error and send a 500 status response with the error message
        console.error('Error fetching club:', error.message);
        res.status(500).json({ error: error.message });
    }
});

// Route to update a club by its ID
router.put('/:club_id', async (req, res) => {
    try {
        // Retrieve the club with the specified ID
        const club = await Club.findByPk(req.params.club_id);

        // If the club is not found, send a 404 status response
        if (!club) {
            return res.status(404).json({ error: 'Club not found' });
        }

        // Update the club with the new data from the request body
        await club.update(req.body);

        // Send the updated club as a JSON response
        res.json(club);
    } catch (error) {
        // Log the error and send a 500 status response with the error message
        console.error('Error updating club:', error.message);
        res.status(500).json({ error: error.message });
    }
});

// Route to delete a club by its ID
router.delete('/:club_id', async (req, res) => {
    try {
        // Retrieve the club with the specified ID
        const club = await Club.findByPk(req.params.club_id);

        // If the club is not found, send a 404 status response
        if (!club) {
            return res.status(404).json({ error: 'Club not found' });
        }

        // Delete the club from the database
        await club.destroy();

        // Send a 204 status response to indicate successful deletion
        res.status(204).send();
    } catch (error) {
        // Log the error and send a 500 status response with the error message
        console.error('Error deleting club:', error.message);
        res.status(500).json({ error: error.message });
    }
});

// Export the router to be used in other parts of the application
module.exports = router;