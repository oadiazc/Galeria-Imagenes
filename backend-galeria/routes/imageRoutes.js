import express from "express";
import upload from "../middlewares/upload.js";
import verificarToken from "../middlewares/authMiddleware.js";
import {
  subirImagen,
  obtenerImagenes,
  obtenerImagenPorId
} from "../controllers/image.controller.js";

const router = express.Router();

router.get("/", obtenerImagenes);
router.get("/:id", obtenerImagenPorId);

router.post("/", verificarToken, upload.single("imagen"), subirImagen);

export default router;
