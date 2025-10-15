const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authMiddleware = require('../middleware/authMiddleware');

// Todas las rutas requieren autenticación
router.use(authMiddleware);

// @route   GET /api/users
// @desc    Obtener todos los usuarios
// @access  Private
router.get('/', userController.getAllUsers);

// @route   PUT /api/users/:id
// @desc    Actualizar usuario por ID
// @access  Private
router.put('/:id', userController.updateUser);

// @route   DELETE /api/users/:id
// @desc    Eliminar usuario por ID
// @access  Private
router.delete('/:id', userController.deleteUser);

module.exports = router;