// src/index.ts
import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/database';
import authRoutes from './routes/authRoutes';
import campaignRoutes from './routes/campaignRoutes';
import voteRoutes from './routes/voteRoutes';
import User from './models/User';
import mongoose from 'mongoose'; // 👈 Agrega esta importación

dotenv.config();

const app: Application = express();

// 🌐 Conexión a MongoDB Atlas (Render o local)
connectDB();

// 🔐 FUNCIÓN PARA CREAR ADMIN AUTOMÁTICAMENTE
const createAdminIfNotExists = async () => {
  try {
    console.log('🔍 Verificando usuario administrador...');
    
    const adminExists = await User.findOne({ rol: 'admin' });
    
    if (!adminExists) {
      console.log('👤 Creando usuario administrador...');
      
      await User.create({
        numeroColegiado: 'ADMIN001',
        nombreCompleto: 'Administrador Principal',
        correoElectronico: 'admin@cig.gt',
        dpi: '1234567890101',
        fechaNacimiento: new Date('1990-01-01'),
        contraseña: 'Admin123!',
        rol: 'admin',
        activo: true,
      });
      
      console.log('✅ Usuario administrador creado exitosamente');
      console.log('📧 Email: admin@cig.gt');
      console.log('🔑 Contraseña: Admin123!');
      console.log('👤 Número de Colegiado: ADMIN001');
    } else {
      console.log('✅ Usuario administrador ya existe');
    }
  } catch (error) {
    console.error('❌ Error al verificar/crear administrador:', error);
  }
};

// ✅ Configuración de CORS (Render y local)
app.use(cors({
  origin: process.env.FRONTEND_URL || '*',
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

// 🔧 Ruta temporal para crear admin manualmente (OPCIONAL)
app.post('/api/create-admin-now', async (req: Request, res: Response) => {
  try {
    const adminExists = await User.findOne({ rol: 'admin' });

    if (adminExists) {
      return res.json({ 
        success: true,
        message: '⚠️ Ya existe un usuario administrador',
        admin: {
          email: adminExists.correoElectronico,
          numeroColegiado: adminExists.numeroColegiado
        }
      });
    }

    const admin = await User.create({
      numeroColegiado: 'ADMIN001',
      nombreCompleto: 'Administrador Principal',
      correoElectronico: 'admin@cig.gt',
      dpi: '1234567890101',
      fechaNacimiento: new Date('1990-01-01'),
      contraseña: 'Admin123!',
      rol: 'admin',
      activo: true,
    });

    res.json({ 
      success: true,
      message: '✅ Usuario administrador creado exitosamente',
      credentials: {
        email: 'admin@cig.gt',
        password: 'Admin123!',
        numeroColegiado: 'ADMIN001'
      }
    });
  } catch (error) {
    console.error('❌ Error al crear administrador:', error);
    res.status(500).json({ 
      success: false,
      error: 'Error al crear administrador' 
    });
  }
});

// ❌ Ruta no encontrada
app.use((req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    message: 'Ruta no encontrada',
  });
});

// ⚙️ Puerto dinámico (Render usa process.env.PORT)
const PORT = process.env.PORT || 5001;

// 🎯 Iniciar servidor después de conectar a la BD
mongoose.connection.once('open', () => {
  console.log('✅ Conectado a MongoDB');
  
  // Crear admin automáticamente
  createAdminIfNotExists();
  
  // Iniciar servidor
  app.listen(PORT, () => {
    console.log(`🚀 Servidor ejecutándose en puerto ${PORT}`);
    console.log(`📍 Ambiente: ${process.env.NODE_ENV || 'development'}`);
    console.log(`🌐 Frontend URL: ${process.env.FRONTEND_URL || 'No configurado'}`);
  });
});