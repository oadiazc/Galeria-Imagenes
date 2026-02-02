import express from 'express';
import User from '../models/User.js';
import jwt from 'jsonwebtoken';

const router = express.Router();
const SECRET_KEY = process.env.SECRET_KEY || 'tu_clave_secreta_aqui';

// Registro
router.post('/register', async (req, res) => {
  try {
    // Permitimos pasar el rol en el body (para crear admins), si no viene será 'comprador' por defecto
    const { email, password, nombre, rol } = req.body;

    const usuarioExistente = await User.findOne({ email });
    if (usuarioExistente) {
      return res.status(400).json({ mensaje: 'El usuario ya existe' });
    }

    const nuevoUsuario = new User({ email, password, nombre, rol });
    await nuevoUsuario.save();

    const token = jwt.sign(
      { id: nuevoUsuario._id, email, rol: nuevoUsuario.rol },
      SECRET_KEY,
      { expiresIn: '24h' }
    );

    res.status(201).json({
      mensaje: 'Usuario registrado exitosamente',
      token,
      usuario: {
        id: nuevoUsuario._id,
        email,
        nombre,
        rol: nuevoUsuario.rol
      }
    });
  } catch (error) {
    console.error('Error en registro:', error);
    res.status(500).json({ mensaje: 'Error al registrar usuario' });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const usuario = await User.findOne({ email });
    if (!usuario || usuario.password !== password) {
      return res.status(401).json({ mensaje: 'Credenciales incorrectas' });
    }

    const token = jwt.sign(
      { id: usuario._id, email, rol: usuario.rol },
      SECRET_KEY,
      { expiresIn: '24h' }
    );

    res.json({
      mensaje: 'Inicio de sesión exitoso',
      token,
      usuario: {
        id: usuario._id,
        email,
        nombre: usuario.nombre,
        rol: usuario.rol  // AGREGADO: Incluir el rol en la respuesta
      }
    });
  } catch (error) {
    console.error('Error en login:', error);
    res.status(500).json({ mensaje: 'Error al iniciar sesión' });
  }
});

// Verificar token
router.get('/verify', (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ mensaje: 'Token no proporcionado' });
    }

    const decoded = jwt.verify(token, SECRET_KEY);
    res.json({ valido: true, usuario: decoded });
  } catch (error) {
    res.status(401).json({ valido: false, mensaje: 'Token inválido' });
  }
});

export default router;
