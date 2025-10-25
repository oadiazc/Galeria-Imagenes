import mongoose from 'mongoose';

const imageSchema = new mongoose.Schema({
  titulo: String,
  autor: String,
  descripcion: String,
  categoria: String, // 🆕 nuevo campo
  url: String
});

// 👇 aquí es donde puede estar el error
export default mongoose.model('Image', imageSchema, 'imagenes');

