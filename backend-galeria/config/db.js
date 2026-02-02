import mongoose from 'mongoose';
import dns from 'dns';

// Fallback DNS para permitir resolveSrv cuando el resolver local rechaza consultas
const currentDns = dns.getServers();
if (currentDns && currentDns.length > 0 && currentDns.includes('127.0.0.1')) {
  dns.setServers(['8.8.8.8', '1.1.1.1']);
}

let isConnecting = false;

async function connectDB(uri) {
  if (isConnecting) return;
  isConnecting = true;

  try {
    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
      family: 4
    });
    console.log('Conectado a MongoDB Atlas');
  } catch (err) {
    console.error('Error conectando a MongoDB', err.message);
    console.warn('Reintentando conexión en 5 segundos...');
    isConnecting = false;
    setTimeout(() => connectDB(uri), 5000);
    return;
  }

  isConnecting = false;

  mongoose.connection.on('error', (err) => {
    console.error('MongoDB connection error:', err.message);
  });

  mongoose.connection.on('disconnected', () => {
    console.warn('MongoDB desconectado — intentando reconectar en 5s');
    setTimeout(() => connectDB(uri), 5000);
  });

  mongoose.connection.on('reconnected', () => {
    console.log('MongoDB reconectado');
  });
}

export { connectDB, mongoose };
