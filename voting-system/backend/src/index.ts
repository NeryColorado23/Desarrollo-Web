// src/index.ts
import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/database';
import authRoutes from './routes/authRoutes';
import campaignRoutes from './routes/campaignRoutes';
import voteRoutes from './routes/voteRoutes';

dotenv.config();

const app: Application = express();

connectDB();

// ✅ CAMBIO IMPORTANTE: Configuración específica de CORS
app.use(cors({
  origin: 'http://localhost:3000',  // ← Frontend
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 🔍 Middleware para debug (opcional, puedes comentarlo después)
app.use((req: Request, res: Response, next) => {
  console.log(`📥 ${req.method} ${req.path}`);
  next();
});

app.use('/api/auth', authRoutes);
app.use('/api/campaigns', campaignRoutes);
app.use('/api/votes', voteRoutes);

app.get('/', (req: Request, res: Response) => {
  res.json({
    success: true,
    message: 'API de Sistema de Votación - Colegio de Ingenieros',
    version: '1.0.0',
  });
});

app.use((req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    message: 'Ruta no encontrada',
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Servidor ejecutándose en puerto ${PORT}`);
  console.log(`📍 Ambiente: ${process.env.NODE_ENV}`);
  console.log(`🌐 MongoDB conectado: ${process.env.MONGODB_URI ? 'Sí' : 'No'}`);
});