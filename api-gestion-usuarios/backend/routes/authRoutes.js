const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// @route   POST /api/auth/login
// @desc    Login de usuario
// @access  Public
router.post('/login', authController.login);

// @route   POST /api/auth/register
// @desc    Registrar nuevo usuario
// @access  Public
router.post('/register', authController.register);

module.exports = router;