require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/database');

// Conectar a la base de datos
connectDB();

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/users', require('./routes/userRoutes'));

// Ruta de prueba
app.get('/', (req, res) => {
    res.json({
        success: true,
        message: 'API REST con JWT funcionando correctamente.',
        endpoints: {
            auth: {
                login: 'POST /api/auth/login',
                register: 'POST /api/auth/register'
            },
            users: {
                getAll: 'GET /api/users',
                update: 'PUT /api/users/:id',
                delete: 'DELETE /api/users/:id'
            }
        },
        note: 'Las rutas de users requieren autenticación JWT'
    });
});

// Manejar rutas no encontradas - FORMA CORRECTA
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: 'Ruta no encontrada.',
        path: req.path,
        method: req.method
    });
});

// Manejo de errores global
app.use((error, req, res, next) => {
    console.error('Error global:', error);
    res.status(500).json({
        success: false,
        message: 'Error interno del servidor.'
    });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`✅ Servidor ejecutándose en puerto ${PORT}`);
    console.log(`🔗 URL: http://localhost:${PORT}`);
    console.log(`🗄️  Base de datos: ${process.env.MONGODB_URI}`);
    console.log(`🔐 JWT Expira en: ${process.env.JWT_EXPIRES_IN}`);
});