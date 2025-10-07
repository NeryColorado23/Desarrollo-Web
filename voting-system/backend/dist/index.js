"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// src/index.ts
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const database_1 = __importDefault(require("./config/database"));
const authRoutes_1 = __importDefault(require("./routes/authRoutes"));
const campaignRoutes_1 = __importDefault(require("./routes/campaignRoutes"));
const voteRoutes_1 = __importDefault(require("./routes/voteRoutes"));
dotenv_1.default.config();
const app = (0, express_1.default)();
(0, database_1.default)();
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use('/api/auth', authRoutes_1.default);
app.use('/api/campaigns', campaignRoutes_1.default);
app.use('/api/votes', voteRoutes_1.default);
app.get('/', (req, res) => {
    res.json({
        success: true,
        message: 'API de Sistema de Votación - Colegio de Ingenieros',
        version: '1.0.0',
    });
});
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: 'Ruta no encontrada',
    });
});
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🚀 Servidor ejecutándose en puerto ${PORT}`);
    console.log(`📍 Ambiente: ${process.env.NODE_ENV}`);
});
