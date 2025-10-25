import express from "express";
import multer from "multer";
import path from "path";
import Image from "../models/Image.js";

const router = express.Router();

// Configurar almacenamiento de Multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage });

// 📤 Subir imagen
router.post("/", upload.single("imagen"), async (req, res) => {
  try {
    const nuevaImagen = new Image({
      titulo: req.body.titulo,
      autor: req.body.autor,
      descripcion: req.body.descripcion,
      categoria: req.body.categoria, // 🆕 se guarda
      url: `/uploads/${req.file.filename}`
    });

    await nuevaImagen.save();
    res.status(201).json(nuevaImagen);
  } catch (error) {
    console.error("Error al subir imagen:", error);
    res.status(500).json({ mensaje: "Error al subir imagen" });
  }
});


// 📥 Obtener todas las imágenes
router.get("/", async (req, res) => {
  try {
    const imagenes = await Image.find();
    res.json(imagenes);
  } catch (error) {
    res.status(500).json({ mensaje: "Error al obtener imágenes" });
  }
});

// 📄 Obtener una imagen por id (para el modal)
router.get("/:id", async (req, res) => {
  try {
    const imagen = await Image.findById(req.params.id);
    res.json(imagen);
  } catch (error) {
    res.status(404).json({ mensaje: "Imagen no encontrada" });
  }
});

export default router;
