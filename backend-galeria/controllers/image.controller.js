import Image from "../models/Image.js";

export const subirImagen = async (req, res) => {
  try {
    const nuevaImagen = new Image({
      titulo: req.body.titulo,
      autor: req.body.autor,
      descripcion: req.body.descripcion,
      categoria: req.body.categoria,
      url: `/uploads/${req.file.filename}`
    });

    await nuevaImagen.save();
    res.status(201).json(nuevaImagen);
  } catch (error) {
    console.error("Error al subir imagen:", error);
    res.status(500).json({ mensaje: "Error al subir imagen" });
  }
};

export const obtenerImagenes = async (req, res) => {
  try {
    const imagenes = await Image.find();
    res.json(imagenes);
  } catch (error) {
    res.status(500).json({ mensaje: "Error al obtener imágenes" });
  }
};

export const obtenerImagenPorId = async (req, res) => {
  try {
    const imagen = await Image.findById(req.params.id);
    res.json(imagen);
  } catch (error) {
    res.status(404).json({ mensaje: "Imagen no encontrada" });
  }
};

