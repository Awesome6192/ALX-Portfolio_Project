// Import the Express module and create a new router instance
const express = require('express');
const router = express.Router();

// Import the User model from the associations models
const { User } = require('../models/associations');

// Route handler to get all users (excluding soft-deleted ones)
router.get('/', async (req, res) => {
    try {
        // Fetch all users where 'is_deleted' is false (not soft-deleted)
        const users = await User.findAll({ where: { is_deleted: false } });
        // Send the list of users as a JSON response
        res.json(users);
    } catch (error) {
        // Log the error and send a 500 status response if an error occurs
        console.error('Error fetching users:', error.message);
        res.status(500).json({ error: error.message });
    }
});

// Route handler to create a new user
router.post('/', async (req, res) => {
    try {
        // Create a new user using the data from the request body
        const newUser = await User.create(req.body);
        // Send the created user as a JSON response with a 201 status code
        res.status(201).json(newUser);
    } catch (error) {
        // Log the error and send a 500 status response if an error occurs
        console.error('Error creating user:', error.message);
        res.status(500).json({ error: error.message });
    }
});

// Route handler to get a user by user_id (excluding soft-deleted users)
router.get('/:user_id', async (req, res) => {
    try {
        // Find the user by their primary key (user_id) and ensure they are not soft-deleted
        const user = await User.findOne({
            where: {
                user_id: req.params.user_id,
                is_deleted: false
            }
        });
        // If the user is not found, send a 404 status response
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        // Send the user data as a JSON response
        res.json(user);
    } catch (error) {
        // Log the error and send a 500 status response if an error occurs
        console.error('Error fetching user:', error.message);
        res.status(500).json({ error: error.message });
    }
});

// Route handler to update a user by user_id (excluding soft-deleted users)
router.put('/:user_id', async (req, res) => {
    try {
        // Find the user by their primary key (user_id) and ensure they are not soft-deleted
        const user = await User.findOne({
            where: {
                user_id: req.params.user_id,
                is_deleted: false
            }
        });
        // If the user is not found, send a 404 status response
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        // Update the user's details using the data from the request body
        await user.update(req.body);
        // Send the updated user data as a JSON response
        res.json(user);
    } catch (error) {
        // Log the error and send a 500 status response if an error occurs
        console.error('Error updating user:', error.message);
        res.status(500).json({ error: error.message });
    }
});

// Route handler to soft delete a user by user_id
router.delete('/:user_id', async (req, res) => {
    try {
        // Find the user by their primary key (user_id) and ensure they are not already soft-deleted
        const user = await User.findOne({
            where: {
                user_id: req.params.user_id,
                is_deleted: false
            }
        });
        // If the user is not found, send a 404 status response
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        // Soft delete: update 'is_deleted' to true
        await user.update({ is_deleted: true });
        // Send a 204 status response indicating successful deletion with no content
        res.status(204).send();
    } catch (error) {
        // Log the error and send a 500 status response if an error occurs
        console.error('Error soft deleting user:', error.message);
        res.status(500).json({ error: error.message });
    }
});

// Export the router to use in other parts of the application
module.exports = router;