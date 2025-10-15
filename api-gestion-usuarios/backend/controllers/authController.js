const jwt = require('jsonwebtoken');
const User = require('../models/User');

const authController = {
    // Login de usuario
    login: async (req, res) => {
        try {
            const { email, password } = req.body;

            // Validar campos requeridos
            if (!email || !password) {
                return res.status(400).json({
                    success: false,
                    message: 'Email y password son requeridos.'
                });
            }

            // Buscar usuario
            const user = await User.findOne({ email });
            if (!user) {
                return res.status(401).json({
                    success: false,
                    message: 'Credenciales inválidas.'
                });
            }

            // Verificar password
            const isPasswordValid = await user.comparePassword(password);
            if (!isPasswordValid) {
                return res.status(401).json({
                    success: false,
                    message: 'Credenciales inválidas.'
                });
            }

            // Generar token JWT
            const token = jwt.sign(
                { id: user._id, email: user.email },
                process.env.JWT_SECRET,
                { expiresIn: process.env.JWT_EXPIRES_IN }
            );

            res.json({
                success: true,
                message: 'Login exitoso.',
                data: {
                    token,
                    user: {
                        id: user._id,
                        name: user.name,
                        email: user.email
                    }
                }
            });

        } catch (error) {
            console.error('Error en login:', error);
            res.status(500).json({
                success: false,
                message: 'Error del servidor en el login.'
            });
        }
    },

    // Registrar nuevo usuario
    register: async (req, res) => {
        try {
            const { name, email, password } = req.body;

            // Validar campos requeridos
            if (!name || !email || !password) {
                return res.status(400).json({
                    success: false,
                    message: 'Nombre, email y password son requeridos.'
                });
            }

            // Verificar si el usuario ya existe
            const existingUser = await User.findOne({ email });
            if (existingUser) {
                return res.status(400).json({
                    success: false,
                    message: 'El usuario ya existe.'
                });
            }

            // Crear nuevo usuario
            const user = new User({
                name,
                email,
                password
            });

            await user.save();

            // Generar token JWT
            const token = jwt.sign(
                { id: user._id, email: user.email },
                process.env.JWT_SECRET,
                { expiresIn: process.env.JWT_EXPIRES_IN }
            );

            res.status(201).json({
                success: true,
                message: 'Usuario registrado exitosamente.',
                data: {
                    token,
                    user: {
                        id: user._id,
                        name: user.name,
                        email: user.email
                    }
                }
            });

        } catch (error) {
            console.error('Error en registro:', error);
            res.status(500).json({
                success: false,
                message: 'Error del servidor en el registro.'
            });
        }
    }
};

module.exports = authController;