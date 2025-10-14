// src/index.ts
import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/database';
import authRoutes from './routes/authRoutes';
import campaignRoutes from './routes/campaignRoutes';
import voteRoutes from './routes/voteRoutes';
import User from './models/User';


dotenv.config();

const app: Application = express();

// 🌐 Conexión a MongoDB Atlas (Render o local)
connectDB();

// ✅ Configuración de CORS (Render y local)
app.use(cors({
  origin: process.env.FRONTEND_URL || '*', // 🔹 Permite el dominio de tu frontend (puedes ajustar esto)
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 🧩 Middleware para depuración (opcional)
app.use((req: Request, res: Response, next) => {
  console.log(`📥 ${req.method} ${req.path}`);
  next();
});

// 🚀 Rutas principales
app.use('/api/auth', authRoutes);
app.use('/api/campaigns', campaignRoutes);
app.use('/api/votes', voteRoutes);

// 🏠 Ruta raíz
app.get('/', (req: Request, res: Response) => {
  res.json({
    success: true,
    message: 'API del Sistema de Votación - Colegio de Ingenieros',
    version: '1.0.0',
  });
});

// ❌ Ruta no encontrada
app.use((req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    message: 'Ruta no encontrada',
  });
});

// ⚙️ Puerto dinámico (Render usa process.env.PORT)
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Servidor ejecutándose en puerto ${PORT}`);
  console.log(`📍 Ambiente: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🌐 MongoDB conectado: ${process.env.MONGODB_URI ? 'Sí' : 'No'}`);
});
