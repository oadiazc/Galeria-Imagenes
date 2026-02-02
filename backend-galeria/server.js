import 'dotenv/config.js';
import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import { connectDB } from './config/db.js';
import Image from './models/Image.js';
import imagesRouter from './routes/imageRoutes.js';
import authRouter from './routes/authRoutes.js';
const app = express();
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));
app.use('/uploads', express.static('uploads'));

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;
if (!MONGO_URI) {
  console.error('MONGO_URI no definido en .env');
  process.exit(1);
}

connectDB(MONGO_URI);

app.get('/', (req, res) => res.send('API Galería funcionando'));

app.use('/api/images', imagesRouter);
app.use('/api/auth', authRouter);

// Rutas de pago con Stripe
import paymentRouter from './routes/paymentRoutes.js';
app.use('/api/payments', paymentRouter);

// Rutas de usuario (Favoritos)
import userRouter from './routes/userRoutes.js';
app.use('/api/usuarios', userRouter);

app.listen(PORT, () => console.log(`Servidor escuchando en puerto ${PORT}`));
