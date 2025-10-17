const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        // Para desarrollo local usa .env, para producción usa variables de Render
        const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/jwt_auth_db';
        
        if (!mongoURI) {
            throw new Error('MONGODB_URI no está definida en las variables de entorno');
        }

        const conn = await mongoose.connect(mongoURI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        
        console.log(`✅ MongoDB conectado: ${conn.connection.host}`);
        console.log(`📊 Base de datos: ${conn.connection.name}`);
    } catch (error) {
        console.error('❌ Error conectando a MongoDB:', error.message);
        process.exit(1);
    }
};

module.exports = connectDB;