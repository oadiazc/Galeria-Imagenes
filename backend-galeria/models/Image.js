import mongoose from 'mongoose';

const imageSchema = new mongoose.Schema({
  titulo: String,
  autor: String,
  descripcion: String,
  categoria: String,
  url: String
});

export default mongoose.model('Image', imageSchema, 'imagenes');

