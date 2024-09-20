// Import the necessary modules
const express = require('express'); // Import the Express library to create web applications
const router = express.Router(); // Creating a new router instance for handling routes
const Club = require('../models/club'); // Importing the Club model from the models directory

// Create a new club
router.post('/', async (req, res) => {
    try {
        // Destructuring request body to get club details
        const { name, founded, stadium, manager } = req.body; 
        
        // Creating a new club record in the database
        const newClub = await Club.create({ name, founded, stadium, manager }); 
        
        // Responding with the created club and a 201 status code
        res.status(201).json(newClub); 
    } catch (error) {
        console.error('Error creating club:', error); // Logging errors to the console
        res.status(500).json({ error: 'Error creating club' }); // Responding with an error status if creation fails
    }
});

// Get all clubs
router.get('/', async (req, res) => {
    try {
        // Fetching all club records from the database
        const clubs = await Club.findAll(); 
        
        // Responding with the list of clubs and a 200 status code
        res.status(200).json(clubs); 
    } catch (error) {
        console.error('Error fetching clubs:', error); // Logging errors to the console
        res.status(500).json({ error: 'Error fetching clubs' }); // Responding with an error status if fetching fails
    }
});

// Get a club by club_id
router.get('/:club_id', async (req, res) => {
    try {
        // Fetching a club by primary key (club_id) from the database
        const club = await Club.findByPk(req.params.club_id); 
        
        if (club) {
            // Responding with the club details and a 200 status code if found
            res.status(200).json(club); 
        } else {
            // Responding with a 404 status code if the club is not found
            res.status(404).json({ error: 'Club not found' }); 
        }
    } catch (error) {
        console.error('Error fetching club:', error); // Logging errors to the console
        res.status(500).json({ error: 'Error fetching club' }); // Responding with an error status if fetching fails
    }
});

// Update a club
router.put('/:club_id', async (req, res) => {
    try {
        // Destructuring request body to get updated club details
        const { name, founded, stadium, manager } = req.body; 
        
        // Updating the club record with the specified club_id
        const [updated] = await Club.update({ name, founded, stadium, manager }, {
            where: { club_id: req.params.club_id } 
        });
        
        if (updated) {
            // Fetching the updated club details
            const updatedClub = await Club.findByPk(req.params.club_id); 
            
            // Responding with the updated club details and a 200 status code
            res.status(200).json(updatedClub); 
        } else {
            // Responding with a 404 status code if the club is not found
            res.status(404).json({ error: 'Club not found' }); 
        }
    } catch (error) {
        console.error('Error updating club:', error); // Logging errors to the console
        res.status(500).json({ error: 'Error updating club' }); // Responding with an error status if updating fails
    }
});

// Delete a club
router.delete('/:club_id', async (req, res) => {
    try {
        // Deleting the club record with the specified club_id
        const deleted = await Club.destroy({
            where: { club_id: req.params.club_id } 
        });
        
        if (deleted) {
            // Responding with a 204 status code indicating successful deletion with no content
            res.status(204).json(); 
        } else {
            // Responding with a 404 status code if the club is not found
            res.status(404).json({ error: 'Club not found' }); 
        }
    } catch (error) {
        console.error('Error deleting club:', error); // Logging errors to the console
        res.status(500).json({ error: 'Error deleting club' }); // Responding with an error status if deletion fails
    }
});

// Exporting the router to be used in other parts of the application
module.exports = router;