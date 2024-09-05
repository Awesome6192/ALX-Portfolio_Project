const express = require('express');
const router = express.Router();
const Club = require('../models/club');

// Create a new club
router.post('/', async (req, res) => {
    try {
        const { name, founded, stadium, manager } = req.body;
        const newClub = await Club.create({ name, founded, stadium, manager });
        res.status(201).json(newClub);
    } catch (error) {
        console.error('Error creating club:', error);
        res.status(500).json({ error: 'Error creating club' });
    }
});

// Get all clubs
router.get('/', async (req, res) => {
    try {
        const clubs = await Club.findAll();
        res.status(200).json(clubs);
    } catch (error) {
        console.error('Error fetching clubs:', error);
        res.status(500).json({ error: 'Error fetching clubs' });
    }
});

// Get a club by ID
router.get('/:id', async (req, res) => {
    try {
        const club = await Club.findByPk(req.params.id);
        if (club) {
            res.status(200).json(club);
        } else {
            res.status(404).json({ error: 'Club not found' });
        }
    } catch (error) {
        console.error('Error fetching club:', error);
        res.status(500).json({ error: 'Error fetching club' });
    }
});

// Update a club
router.put('/:id', async (req, res) => {
    try {
        const { name, founded, stadium, manager } = req.body;
        const [updated] = await Club.update({ name, founded, stadium, manager }, {
            where: { club_id: req.params.id }
        });
        if (updated) {
            const updatedClub = await Club.findByPk(req.params.id);
            res.status(200).json(updatedClub);
        } else {
            res.status(404).json({ error: 'Club not found' });
        }
    } catch (error) {
        console.error('Error updating club:', error);
        res.status(500).json({ error: 'Error updating club' });
    }
});

// Delete a club
router.delete('/:id', async (req, res) => {
    try {
        const deleted = await Club.destroy({
            where: { club_id: req.params.id }
        });
        if (deleted) {
            res.status(204).json();
        } else {
            res.status(404).json({ error: 'Club not found' });
        }
    } catch (error) {
        console.error('Error deleting club:', error);
        res.status(500).json({ error: 'Error deleting club' });
    }
});

module.exports = router;