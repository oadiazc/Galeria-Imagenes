import Image from "../models/Image.js";

const subirImagen = async (req, res) => {
  try {
    const BASE_URL = process.env.BASE_URL || 'http://localhost:5000';
    const nuevaImagen = new Image({
      titulo: req.body.titulo,
      autor: req.body.autor,
      descripcion: req.body.descripcion,
      categoria: req.body.categoria,
      url: `${BASE_URL}/uploads/${req.file.filename}`,
      precio: req.body.precio ? Number(req.body.precio) : 10,
      stock: req.body.stock ? Number(req.body.stock) : 100
    });

    await nuevaImagen.save();
    res.status(201).json(nuevaImagen);
  } catch (error) {
    console.error("Error al subir imagen:", error);
    res.status(500).json({ mensaje: "Error al subir imagen" });
  }
};

const obtenerImagenes = async (req, res) => {
  try {
    const imagenes = await Image.find();
    res.json(imagenes);
  } catch (error) {
    res.status(500).json({ mensaje: "Error al obtener imágenes" });
  }
};

const obtenerImagenPorId = async (req, res) => {
  try {
    const imagen = await Image.findById(req.params.id);
    res.json(imagen);
  } catch (error) {
    res.status(404).json({ mensaje: "Imagen no encontrada" });
  }
};

const actualizarImagen = async (req, res) => {
  try {
    const { id } = req.params;
    const datos = req.body;

    console.log("=== UPDATE REQUEST ===");
    console.log("params.id:", id);
    console.log("body:", req.body);
    console.log("file:", req.file); // undefined si no envían archivo

    // Solo actualizar la URL si hay un archivo nuevo
    if (req.file) {
      const BASE_URL = process.env.BASE_URL || 'http://localhost:5000';
      datos.url = `${BASE_URL}/uploads/${req.file.filename}`;
    }

    const imagenActualizada = await Image.findByIdAndUpdate(id, datos, { new: true });

    if (!imagenActualizada) {
      return res.status(404).json({ msg: "Imagen no encontrada" });
    }

    res.json(imagenActualizada);
  } catch (error) {
    console.error("Error actualizando imagen:", error);
    res.status(500).json({ msg: "Error del servidor" });
  }
};

const eliminarImagen = async (req, res) => {
  try {
    const { id } = req.params;
    const imagen = await Image.findByIdAndDelete(id);
    
    if (!imagen) {
      return res.status(404).json({ msg: "Imagen no encontrada" });
    }

    res.json({ msg: "Imagen eliminada exitosamente", imagen });
  } catch (error) {
    console.error("Error eliminando imagen:", error);
    res.status(500).json({ msg: "Error del servidor" });
  }
};

export {
  subirImagen,
  obtenerImagenes,
  obtenerImagenPorId,
  actualizarImagen,
  eliminarImagen
};