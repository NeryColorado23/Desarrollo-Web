// src/config/database.ts
import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const connectDB = async (): Promise<void> => {
  try {
    const uri = process.env.MONGODB_URI as string;

    if (!uri) {
      throw new Error('❌ La variable de entorno MONGODB_URI no está definida');
    }

    const conn = await mongoose.connect(uri);
    console.log(`✅ MongoDB conectado correctamente: ${conn.connection.host}`);
  } catch (error) {
    console.error('❌ Error al conectar MongoDB:', error);
    process.exit(1);
  }
};

export default connectDB;
