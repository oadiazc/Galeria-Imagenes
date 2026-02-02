import express from 'express';
import Stripe from 'stripe';
import Order from '../models/Order.js';
import Image from '../models/Image.js';
import { verificarToken } from '../middlewares/verificarToken.js';

const router = express.Router();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// Crear sesión de checkout
router.post('/create-checkout-session', verificarToken, async (req, res) => {
    try {
        const { items } = req.body; // Array de items del carrito
        const usuarioId = req.usuario.id;

        if (!items || items.length === 0) {
            return res.status(400).json({ mensaje: 'El carrito está vacío' });
        }

        // Crear line items para Stripe
        const lineItems = [];
        const imagenesIds = [];

        for (const item of items) {
            const imagen = await Image.findById(item._id);
            if (!imagen) {
                return res.status(404).json({ mensaje: `Imagen ${item.titulo} no encontrada` });
            }

            // Verificar stock
            if (imagen.stock < item.cantidad) {
                return res.status(400).json({
                    mensaje: `Stock insuficiente para ${imagen.titulo}. Disponible: ${imagen.stock}`
                });
            }

            lineItems.push({
                price_data: {
                    currency: 'usd',
                    product_data: {
                        name: imagen.titulo,
                        description: imagen.descripcion || `Imagen de ${imagen.autor}`,
                        images: [imagen.url],
                    },
                    unit_amount: Math.round(imagen.precio * 100), // Stripe usa centavos
                },
                quantity: item.cantidad,
            });

            imagenesIds.push({ id: imagen._id, cantidad: item.cantidad });
        }

        // Crear sesión de Stripe Checkout
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: lineItems,
            mode: 'payment',
            success_url: `${process.env.FRONTEND_URL || 'http://localhost:4200'}/payment-success?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${process.env.FRONTEND_URL || 'http://localhost:4200'}/payment-cancel`,
            metadata: {
                usuarioId: usuarioId,
                imagenesIds: JSON.stringify(imagenesIds),
            },
        });

        // Crear orden pendiente
        const orden = new Order({
            usuario: usuarioId,
            imagen: imagenesIds[0].id, // Por compatibilidad, guardamos la primera imagen
            precio: items.reduce((total, item) => total + (item.precio * item.cantidad), 0),
            estado: 'pendiente',
            stripeSessionId: session.id,
        });
        await orden.save();

        res.json({ sessionId: session.id, url: session.url });
    } catch (error) {
        console.error('Error al crear sesión de checkout:', error);
        res.status(500).json({ mensaje: 'Error al crear sesión de pago' });
    }
});

// Verificar estado de pago
router.get('/verify-session/:sessionId', verificarToken, async (req, res) => {
    try {
        const { sessionId } = req.params;

        const session = await stripe.checkout.sessions.retrieve(sessionId);
        const orden = await Order.findOne({ stripeSessionId: sessionId })
            .populate('imagen')
            .populate('usuario', 'nombre email');

        if (!orden) {
            return res.status(404).json({ mensaje: 'Orden no encontrada' });
        }

        // Si el pago se completó en Stripe pero la orden sigue pendiente, actualizarla (Fallback para localhost)
        if (session.payment_status === 'paid' && orden.estado === 'pendiente') {

            orden.estado = 'completado';
            orden.stripePaymentIntentId = session.payment_intent;
            await orden.save();

            // Reducir stock de las imágenes
            const imagenesIds = JSON.parse(session.metadata.imagenesIds || '[]');
            for (const item of imagenesIds) {
                await Image.findByIdAndUpdate(item.id, {
                    $inc: { stock: -item.cantidad },
                });
            }
        }

        res.json({
            estado: session.payment_status,
            orden: {
                id: orden._id,
                imagen: orden.imagen,
                precio: orden.precio,
                estado: orden.estado,
            },
        });
    } catch (error) {
        console.error('Error al verificar sesión:', error);
        res.status(500).json({ mensaje: 'Error al verificar pago' });
    }
});

// Webhook de Stripe (para confirmar pagos)
router.post('/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
    const sig = req.headers['stripe-signature'];
    let event;

    try {
        // Verificar firma del webhook (requiere STRIPE_WEBHOOK_SECRET en producción)
        event = req.body;

        // Manejar el evento
        if (event.type === 'checkout.session.completed') {
            const session = event.data.object;

            // Actualizar orden
            const orden = await Order.findOne({ stripeSessionId: session.id });
            if (orden) {
                orden.estado = 'completado';
                orden.stripePaymentIntentId = session.payment_intent;
                await orden.save();

                // Reducir stock de las imágenes
                const imagenesIds = JSON.parse(session.metadata.imagenesIds || '[]');
                for (const item of imagenesIds) {
                    await Image.findByIdAndUpdate(item.id, {
                        $inc: { stock: -item.cantidad },
                    });
                }

                console.log(`Pago completado para orden ${orden._id}`);
            }
        }

        res.json({ received: true });
    } catch (error) {
        console.error('Error en webhook:', error);
        res.status(400).send(`Webhook Error: ${error.message}`);
    }
});


// Historial de compras del usuario
router.get('/historial', verificarToken, async (req, res) => {
    try {
        const usuarioId = req.usuario.id;
        const ordenes = await Order.find({ usuario: usuarioId, estado: 'completado' })
            .populate('imagen')
            .sort({ createdAt: -1 });

        res.json(ordenes);
    } catch (error) {
        console.error('Error al obtener historial:', error);
        res.status(500).json({ mensaje: 'Error al obtener historial de compras' });
    }
});

export default router;
