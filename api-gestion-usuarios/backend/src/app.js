const express = require('express');
const cors = require('cors');
const usersRouter = require('./routes/users');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Ruta principal
app.get('/', (req, res) => {
  res.json({
    message: 'API de Gestión de Usuarios',
    version: '1.0.0',
    endpoints: {
      users: '/users',
      createUser: 'POST /users',
      listUsers: 'GET /users',
      updateUser: 'PUT /users/:dpi',
      deleteUser: 'DELETE /users/:dpi'
    }
  });
});

// Rutas
app.use('/users', usersRouter);

// Manejo de rutas no encontradas
app.use((req, res) => {
  res.status(404).json({
    error: 'Ruta no encontrada'
  });
});

// Manejo de errores
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    error: 'Error interno del servidor'
  });
});

module.exports = app;