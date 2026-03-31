const express = require('express');
const router = express.Router();
const UserController = require('../controllers/user.controller');

// Public routes
router.post('/register', (req, res) => UserController.register(req, res));
router.post('/login', (req, res) => UserController.login(req, res));

// Protected routes (in real app, add auth middleware)
router.get('/profile/:id', (req, res) => UserController.getProfile(req, res));
router.put('/profile/:id', (req, res) => UserController.updateProfile(req, res));
router.put('/preferences/:id', (req, res) => UserController.updatePreferences(req, res));

module.exports = router;
