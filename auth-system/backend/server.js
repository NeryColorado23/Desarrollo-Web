// server.js
const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Arreglo en memoria para almacenar usuarios
let usuarios = [];

// Ruta de registro
app.post('/register', (req, res) => {
  const { nombre, dpi, email, contraseña } = req.body;

  // Validar que todos los campos estén presentes
  if (!nombre || !dpi || !email || !contraseña) {
    return res.status(400).json({ 
      success: false, 
      message: 'Todos los campos son requeridos' 
    });
  }

  // Validar que el email no esté registrado
  const usuarioExistente = usuarios.find(user => user.email === email);
  
  if (usuarioExistente) {
    return res.status(400).json({ 
      success: false, 
      message: 'El email ya está registrado' 
    });
  }

  // Crear nuevo usuario
  const nuevoUsuario = {
    id: Date.now(),
    nombre,
    dpi,
    email,
    contraseña // En producción, esto debería estar encriptado
  };

  usuarios.push(nuevoUsuario);

  console.log('Usuario registrado:', nuevoUsuario);
  console.log('Total usuarios:', usuarios.length);

  res.status(201).json({ 
    success: true, 
    message: 'Usuario registrado exitosamente',
    usuario: {
      id: nuevoUsuario.id,
      nombre: nuevoUsuario.nombre,
      email: nuevoUsuario.email
    }
  });
});

// Ruta de login
app.post('/login', (req, res) => {
  const { email, contraseña } = req.body;

  // Validar que todos los campos estén presentes
  if (!email || !contraseña) {
    return res.status(400).json({ 
      success: false, 
      message: 'Email y contraseña son requeridos' 
    });
  }

  // Buscar usuario por email y contraseña
  const usuario = usuarios.find(
    user => user.email === email && user.contraseña === contraseña
  );

  if (!usuario) {
    return res.status(401).json({ 
      success: false, 
      message: 'Credenciales incorrectas' 
    });
  }

  console.log('Usuario logueado:', usuario.email);

  res.status(200).json({ 
    success: true, 
    message: 'Login exitoso',
    usuario: {
      id: usuario.id,
      nombre: usuario.nombre,
      dpi: usuario.dpi,
      email: usuario.email
    }
  });
});

// Ruta para obtener todos los usuarios (opcional, para debugging)
app.get('/usuarios', (req, res) => {
  res.json({ 
    success: true, 
    usuarios: usuarios.map(u => ({
      id: u.id,
      nombre: u.nombre,
      email: u.email
    }))
  });
});

app.listen(PORT, () => {
  console.log(`Servidor ejecutándose en http://localhost:${PORT}`);
});