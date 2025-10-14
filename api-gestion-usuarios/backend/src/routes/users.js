const express = require('express');
const router = express.Router();
const { validateUserData, validateDPI, validateEmail, validatePassword } = require('../utils/validators');

// Base de datos en memoria (arreglo de usuarios)
let users = [];

/**
 * POST /users - Crear un nuevo usuario
 */
router.post('/', (req, res) => {
  const { name, dpi, email, password } = req.body;
  
  // Validar datos del usuario
  const validation = validateUserData(req.body);
  if (!validation.isValid) {
    return res.status(400).json({
      error: 'Datos inválidos',
      details: validation.errors
    });
  }
  
  // Verificar si el DPI ya existe
  const existingDPI = users.find(user => user.dpi === dpi);
  if (existingDPI) {
    return res.status(409).json({
      error: 'El DPI ya está registrado'
    });
  }
  
  // Verificar si el email ya existe
  const existingEmail = users.find(user => user.email === email);
  if (existingEmail) {
    return res.status(409).json({
      error: 'El email ya está registrado'
    });
  }
  
  // Crear nuevo usuario
  const newUser = {
    id: users.length + 1,
    name: name.trim(),
    dpi,
    email: email.toLowerCase(),
    password, // En producción, esto debería estar hasheado
    createdAt: new Date().toISOString()
  };
  
  users.push(newUser);
  
  // Retornar usuario sin password
  const { password: _, ...userWithoutPassword } = newUser;
  
  res.status(201).json({
    message: 'Usuario creado exitosamente',
    user: userWithoutPassword
  });
});

/**
 * GET /users - Listar todos los usuarios con filtros y paginación
 */
router.get('/', (req, res) => {
  const { name, email, limit, offset } = req.query;
  
  let filteredUsers = [...users];
  
  // Filtrar por nombre (búsqueda parcial, insensible a mayúsculas)
  if (name) {
    filteredUsers = filteredUsers.filter(user => 
      user.name.toLowerCase().includes(name.toLowerCase())
    );
  }
  
  // Filtrar por email (búsqueda exacta)
  if (email) {
    filteredUsers = filteredUsers.filter(user => 
      user.email.toLowerCase() === email.toLowerCase()
    );
  }
  
  // Aplicar paginación
  const limitNum = parseInt(limit) || filteredUsers.length;
  const offsetNum = parseInt(offset) || 0;
  
  const paginatedUsers = filteredUsers.slice(offsetNum, offsetNum + limitNum);
  
  // Remover passwords de todos los usuarios
  const usersWithoutPasswords = paginatedUsers.map(user => {
    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  });
  
  res.json({
    total: filteredUsers.length,
    limit: limitNum,
    offset: offsetNum,
    users: usersWithoutPasswords
  });
});

/**
 * PUT /users/:dpi - Actualizar un usuario existente
 */
router.put('/:dpi', (req, res) => {
  const { dpi } = req.params;
  const { name, email, password, dpi: newDPI } = req.body;
  
  // Validar que el DPI del parámetro sea válido
  if (!validateDPI(dpi)) {
    return res.status(400).json({
      error: 'El DPI proporcionado no es válido'
    });
  }
  
  // Buscar el usuario
  const userIndex = users.findIndex(user => user.dpi === dpi);
  
  if (userIndex === -1) {
    return res.status(404).json({
      error: 'Usuario no encontrado'
    });
  }
  
  const user = users[userIndex];
  const errors = [];
  
  // Si se intenta cambiar el DPI
  if (newDPI && newDPI !== dpi) {
    if (!validateDPI(newDPI)) {
      errors.push('El nuevo DPI debe tener exactamente 13 dígitos numéricos');
    } else {
      const existingDPI = users.find(u => u.dpi === newDPI);
      if (existingDPI) {
        return res.status(409).json({
          error: 'El nuevo DPI ya está registrado en otro usuario'
        });
      }
    }
  }
  
  // Validar email si se proporciona
  if (email) {
    if (!validateEmail(email)) {
      errors.push('El email no tiene un formato válido');
    } else {
      const existingEmail = users.find(u => u.email === email && u.dpi !== dpi);
      if (existingEmail) {
        return res.status(409).json({
          error: 'El email ya está registrado en otro usuario'
        });
      }
    }
  }
  
  // Validar password si se proporciona
  if (password && !validatePassword(password)) {
    errors.push('El password debe tener al menos 8 caracteres, incluir una mayúscula, un número y un símbolo');
  }
  
  if (errors.length > 0) {
    return res.status(400).json({
      error: 'Datos inválidos',
      details: errors
    });
  }
  
  // Actualizar usuario
  if (name) user.name = name.trim();
  if (email) user.email = email.toLowerCase();
  if (password) user.password = password;
  if (newDPI) user.dpi = newDPI;
  user.updatedAt = new Date().toISOString();
  
  users[userIndex] = user;
  
  // Retornar usuario sin password
  const { password: _, ...userWithoutPassword } = user;
  
  res.json({
    message: 'Usuario actualizado exitosamente',
    user: userWithoutPassword
  });
});

/**
 * DELETE /users/:dpi - Eliminar un usuario
 */
router.delete('/:dpi', (req, res) => {
  const { dpi } = req.params;
  
  // Validar que el DPI sea válido
  if (!validateDPI(dpi)) {
    return res.status(400).json({
      error: 'El DPI proporcionado no es válido'
    });
  }
  
  // Buscar el usuario
  const userIndex = users.findIndex(user => user.dpi === dpi);
  
  if (userIndex === -1) {
    return res.status(404).json({
      error: 'Usuario no encontrado'
    });
  }
  
  // Eliminar usuario
  const deletedUser = users.splice(userIndex, 1)[0];
  
  // Retornar usuario eliminado sin password
  const { password: _, ...userWithoutPassword } = deletedUser;
  
  res.json({
    message: 'Usuario eliminado exitosamente',
    user: userWithoutPassword
  });
});

module.exports = router;