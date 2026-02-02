import express from 'express';
import User from '../models/User.js';
import { verificarToken } from '../middlewares/verificarToken.js';

const router = express.Router();

// Obtener favoritos del usuario
router.get('/favoritos', verificarToken, async (req, res) => {
    try {
        const usuario = await User.findById(req.usuario.id).populate('favoritos');
        if (!usuario) {
            return res.status(404).json({ mensaje: 'Usuario no encontrado' });
        }
        res.json(usuario.favoritos);
    } catch (error) {
        console.error('Error al obtener favoritos:', error);
        res.status(500).json({ mensaje: 'Error al obtener favoritos' });
    }
});

// Agregar o quitar favorito (Toggle)
router.post('/favoritos/:imagenId', verificarToken, async (req, res) => {
    try {
        const { imagenId } = req.params;
        const usuarioId = req.usuario.id;

        const usuario = await User.findById(usuarioId);
        if (!usuario) {
            return res.status(404).json({ mensaje: 'Usuario no encontrado' });
        }

        const index = usuario.favoritos.indexOf(imagenId);
        let esFavorito;

        if (index === -1) {
            // No está en favoritos, agregar
            usuario.favoritos.push(imagenId);
            esFavorito = true;
        } else {
            // Ya está en favoritos, quitar
            usuario.favoritos.splice(index, 1);
            esFavorito = false;
        }

        await usuario.save();
        res.json({ mensaje: esFavorito ? 'Agregado a favoritos' : 'Eliminado de favoritos', esFavorito });

    } catch (error) {
        console.error('Error al actualizar favoritos:', error);
        res.status(500).json({ mensaje: 'Error al actualizar favoritos' });
    }
});

export default router;
