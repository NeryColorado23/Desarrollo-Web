// createAdmin.ts - Crear en la raíz de backend/
// Ejecutar con: npx ts-node createAdmin.ts
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './src/models/User';

dotenv.config();

const createAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI as string);
    console.log('✅ Conectado a MongoDB');

    // Verificar si ya existe un admin
    const adminExists = await User.findOne({ rol: 'admin' });

    if (adminExists) {
      console.log('⚠️  Ya existe un usuario administrador');
      process.exit(0);
    }

    // Crear usuario admin
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

    console.log('✅ Usuario administrador creado exitosamente');
    console.log('📧 Email: admin@cig.gt');
    console.log('🔑 Contraseña: Admin123!');
    console.log('👤 Número de Colegiado: ADMIN001');
    console.log('🆔 DPI: 1234567890101');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error al crear administrador:', error);
    process.exit(1);
  }
};

createAdmin();