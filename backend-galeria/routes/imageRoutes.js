import express from "express";
import upload from "../middlewares/upload.js";
import { verificarToken } from "../middlewares/verificarToken.js";
import {
  subirImagen,
  obtenerImagenes,
  obtenerImagenPorId,
  actualizarImagen,
  eliminarImagen
} from "../controllers/image.controller.js";

const router = express.Router();

// Rutas dentro de /api/images (asegúrate que en server.js haces app.use('/api/images', router))
router.post("/", verificarToken, upload.single("imagen"), subirImagen);
router.get("/", obtenerImagenes);
router.get("/:id", obtenerImagenPorId);
router.put("/:id", verificarToken, upload.single("imagen"), actualizarImagen);
router.delete("/:id", verificarToken, eliminarImagen);

export default router;
