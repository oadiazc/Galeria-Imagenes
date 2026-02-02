import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  nombre: String,
  rol: {
    type: String,
    enum: ['admin', 'comprador'],
    default: 'comprador'
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  favoritos: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Image'
  }]
});

export default mongoose.model('User', userSchema, 'usuarios');
