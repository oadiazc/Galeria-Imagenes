import mongoose from 'mongoose';

const imageSchema = new mongoose.Schema({
  titulo: String,
  autor: String,
  descripcion: String,
  categoria: String,
  url: String,
  precio: {
    type: Number,
    default: 10
  },
  stock: {
    type: Number,
    default: 100
  }
});

export default mongoose.model('Image', imageSchema, 'imagenes');
