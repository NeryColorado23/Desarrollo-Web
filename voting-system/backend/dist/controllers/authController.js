"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getProfile = exports.loginUser = exports.registerUser = void 0;
const User_1 = __importDefault(require("../models/User"));
const generateToken_1 = require("../utils/generateToken");
// @desc    Registrar nuevo votante
// @route   POST /api/auth/register
// @access  Public
const registerUser = async (req, res) => {
    try {
        const { numeroColegiado, nombreCompleto, correoElectronico, dpi, fechaNacimiento, contraseña, } = req.body;
        if (!numeroColegiado ||
            !nombreCompleto ||
            !correoElectronico ||
            !dpi ||
            !fechaNacimiento ||
            !contraseña) {
            res.status(400).json({
                success: false,
                message: 'Todos los campos son requeridos',
            });
            return;
        }
        if (dpi.length !== 13 || !/^\d+$/.test(dpi)) {
            res.status(400).json({
                success: false,
                message: 'El DPI debe contener exactamente 13 dígitos numéricos',
            });
            return;
        }
        const birthDate = new Date(fechaNacimiento);
        const today = new Date();
        const age = today.getFullYear() - birthDate.getFullYear();
        if (age < 18) {
            res.status(400).json({
                success: false,
                message: 'Debe ser mayor de 18 años para registrarse',
            });
            return;
        }
        const userExists = await User_1.default.findOne({
            $or: [{ numeroColegiado }, { correoElectronico }, { dpi }],
        });
        if (userExists) {
            res.status(400).json({
                success: false,
                message: 'El número de colegiado, correo o DPI ya están registrados',
            });
            return;
        }
        const user = await User_1.default.create({
            numeroColegiado,
            nombreCompleto,
            correoElectronico,
            dpi,
            fechaNacimiento: birthDate,
            contraseña,
            rol: 'votante',
        });
        res.status(201).json({
            success: true,
            message: 'Usuario registrado exitosamente',
            user: {
                id: user._id.toString(),
                numeroColegiado: user.numeroColegiado,
                nombreCompleto: user.nombreCompleto,
                correoElectronico: user.correoElectronico,
                rol: user.rol,
            },
        });
    }
    catch (error) {
        const err = error;
        console.error('Error en registro:', err);
        res.status(500).json({
            success: false,
            message: 'Error al registrar usuario',
            error: err.message,
        });
    }
};
exports.registerUser = registerUser;
// @desc    Login de usuario
// @route   POST /api/auth/login
// @access  Public
const loginUser = async (req, res) => {
    try {
        const { numeroColegiado, dpi, fechaNacimiento, contraseña } = req.body;
        if (!numeroColegiado || !dpi || !fechaNacimiento || !contraseña) {
            res.status(400).json({
                success: false,
                message: 'Todos los campos son requeridos',
            });
            return;
        }
        const user = await User_1.default.findOne({ numeroColegiado }).select('+contraseña');
        if (!user) {
            res.status(401).json({
                success: false,
                message: 'Credenciales incorrectas',
            });
            return;
        }
        if (user.dpi !== dpi) {
            res.status(401).json({
                success: false,
                message: 'Credenciales incorrectas',
            });
            return;
        }
        const userBirthDate = new Date(user.fechaNacimiento).toISOString().split('T')[0];
        const providedBirthDate = new Date(fechaNacimiento).toISOString().split('T')[0];
        if (userBirthDate !== providedBirthDate) {
            res.status(401).json({
                success: false,
                message: 'Credenciales incorrectas',
            });
            return;
        }
        const isPasswordCorrect = await user.comparePassword(contraseña);
        if (!isPasswordCorrect) {
            res.status(401).json({
                success: false,
                message: 'Credenciales incorrectas',
            });
            return;
        }
        if (!user.activo) {
            res.status(401).json({
                success: false,
                message: 'Usuario inactivo',
            });
            return;
        }
        const token = (0, generateToken_1.generateToken)({
            id: user._id.toString(),
            rol: user.rol,
        });
        res.status(200).json({
            success: true,
            message: 'Login exitoso',
            token,
            user: {
                id: user._id.toString(),
                numeroColegiado: user.numeroColegiado,
                nombreCompleto: user.nombreCompleto,
                correoElectronico: user.correoElectronico,
                dpi: user.dpi,
                rol: user.rol,
            },
        });
    }
    catch (error) {
        const err = error;
        console.error('Error en login:', err);
        res.status(500).json({
            success: false,
            message: 'Error al iniciar sesión',
            error: err.message,
        });
    }
};
exports.loginUser = loginUser;
// @desc    Obtener perfil de usuario
// @route   GET /api/auth/profile
// @access  Private
const getProfile = async (req, res) => {
    try {
        const user = await User_1.default.findById(req.user._id);
        if (!user) {
            res.status(404).json({
                success: false,
                message: 'Usuario no encontrado',
            });
            return;
        }
        res.status(200).json({
            success: true,
            user: {
                id: user._id.toString(),
                numeroColegiado: user.numeroColegiado,
                nombreCompleto: user.nombreCompleto,
                correoElectronico: user.correoElectronico,
                dpi: user.dpi,
                fechaNacimiento: user.fechaNacimiento,
                rol: user.rol,
            },
        });
    }
    catch (error) {
        const err = error;
        console.error('Error al obtener perfil:', err);
        res.status(500).json({
            success: false,
            message: 'Error al obtener perfil',
            error: err.message,
        });
    }
};
exports.getProfile = getProfile;
