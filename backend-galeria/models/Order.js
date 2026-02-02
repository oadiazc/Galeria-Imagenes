import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema({
    usuario: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    imagen: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Image',
        required: true
    },
    precio: {
        type: Number,
        required: true
    },
    estado: {
        type: String,
        enum: ['pendiente', 'completado', 'cancelado'],
        default: 'pendiente'
    },
    stripeSessionId: {
        type: String,
        required: true
    },
    stripePaymentIntentId: String,
    createdAt: {
        type: Date,
        default: Date.now
    }
});

export default mongoose.model('Order', orderSchema);
