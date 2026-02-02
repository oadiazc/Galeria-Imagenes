import jwt from 'jsonwebtoken';

const SECRET_KEY = process.env.SECRET_KEY || 'tu_clave_secreta_aqui';

export const verificarToken = (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({ mensaje: 'Token no proporcionado' });
    }

    const decoded = jwt.verify(token, SECRET_KEY);
    req.usuario = decoded;
    next();
  } catch (error) {
    res.status(401).json({ mensaje: 'Token inválido' });
  }
};
