const express = require('express'); // Importing the Express library
const router = express.Router(); // Creating a new router object
const Club = require('../models/club'); // Importing the Club model from the models directory

// Create a new club
router.post('/', async (req, res) => {
    try {
        const { name, founded, stadium, manager } = req.body; // Destructuring request body to get club details
        const newClub = await Club.create({ name, founded, stadium, manager }); // Creating a new club record in the database
        res.status(201).json(newClub); // Responding with the created club and a 201 status code
    } catch (error) {
        console.error('Error creating club:', error); // Logging errors to the console
        res.status(500).json({ error: 'Error creating club' }); // Responding with an error status if creation fails
    }
});

// Get all clubs
router.get('/', async (req, res) => {
    try {
        const clubs = await Club.findAll(); // Fetching all club records from the database
        res.status(200).json(clubs); // Responding with the list of clubs and a 200 status code
    } catch (error) {
        console.error('Error fetching clubs:', error); // Logging errors to the console
        res.status(500).json({ error: 'Error fetching clubs' }); // Responding with an error status if fetching fails
    }
});

// Get a club by ID
router.get('/:id', async (req, res) => {
    try {
        const club = await Club.findByPk(req.params.id); // Fetching a club by primary key (ID) from the database
        if (club) {
            res.status(200).json(club); // Responding with the club details and a 200 status code if found
        } else {
            res.status(404).json({ error: 'Club not found' }); // Responding with a 404 status code if the club is not found
        }
    } catch (error) {
        console.error('Error fetching club:', error); // Logging errors to the console
        res.status(500).json({ error: 'Error fetching club' }); // Responding with an error status if fetching fails
    }
});

// Update a club
router.put('/:id', async (req, res) => {
    try {
        const { name, founded, stadium, manager } = req.body; // Destructuring request body to get updated club details
        const [updated] = await Club.update({ name, founded, stadium, manager }, {
            where: { club_id: req.params.id } // Updating the club record with the specified ID
        });
        if (updated) {
            const updatedClub = await Club.findByPk(req.params.id); // Fetching the updated club details
            res.status(200).json(updatedClub); // Responding with the updated club details and a 200 status code
        } else {
            res.status(404).json({ error: 'Club not found' }); // Responding with a 404 status code if the club is not found
        }
    } catch (error) {
        console.error('Error updating club:', error); // Logging errors to the console
        res.status(500).json({ error: 'Error updating club' }); // Responding with an error status if updating fails
    }
});

// Delete a club
router.delete('/:id', async (req, res) => {
    try {
        const deleted = await Club.destroy({
            where: { club_id: req.params.id } // Deleting the club record with the specified ID
        });
        if (deleted) {
            res.status(204).json(); // Responding with a 204 status code indicating successful deletion with no content
        } else {
            res.status(404).json({ error: 'Club not found' }); // Responding with a 404 status code if the club is not found
        }
    } catch (error) {
        console.error('Error deleting club:', error); // Logging errors to the console
        res.status(500).json({ error: 'Error deleting club' }); // Responding with an error status if deletion fails
    }
});

module.exports = router; // Exporting the router to be used in other parts of the application