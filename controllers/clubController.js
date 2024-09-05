// routes/clubRoutes.js
const express = require('express');
const router = express.Router();
const { Club } = require('../models/associations');

// Get all clubs
router.get('/', async (req, res) => {
    try {
        const clubs = await Club.findAll();
        res.json(clubs);
    } catch (error) {
        console.error('Error fetching clubs:', error.message);
        res.status(500).json({ error: error.message });
    }
});

// Create a new club
router.post('/', async (req, res) => {
    try {
        const newClub = await Club.create(req.body);
        res.status(201).json(newClub);
    } catch (error) {
        console.error('Error creating club:', error.message);
        res.status(500).json({ error: error.message });
    }
});

// Get a club by ID
router.get('/:id', async (req, res) => {
    try {
        const club = await Club.findByPk(req.params.id);
        if (!club) {
            return res.status(404).json({ error: 'Club not found' });
        }
        res.json(club);
    } catch (error) {
        console.error('Error fetching club:', error.message);
        res.status(500).json({ error: error.message });
    }
});

// Update a club by ID
router.put('/:id', async (req, res) => {
    try {
        const club = await Club.findByPk(req.params.id);
        if (!club) {
            return res.status(404).json({ error: 'Club not found' });
        }
        await club.update(req.body);
        res.json(club);
    } catch (error) {
        console.error('Error updating club:', error.message);
        res.status(500).json({ error: error.message });
    }
});

// Delete a club by ID
router.delete('/:id', async (req, res) => {
    try {
        const club = await Club.findByPk(req.params.id);
        if (!club) {
            return res.status(404).json({ error: 'Club not found' });
        }
        await club.destroy();
        res.status(204).send();
    } catch (error) {
        console.error('Error deleting club:', error.message);
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;