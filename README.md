# Galería de Imágenes - E-commerce de Arte Digital

## Descripción
Esta aplicación es una plataforma de comercio electrónico diseñada para vender arte digital. Los usuarios pueden explorar una galería de imágenes, ver detalles, agregar productos al carrito y realizar pagos seguros a través de Stripe.

## Características Principales
*   **Gestión de Usuarios:** Registro e inicio de sesión con roles (Administrador y Comprador).
*   **Galería Dinámica:** Visualización de imágenes con filtros y modal de detalles.
*   **Carrito de Compras:** Gestión de items, cálculo de totales y persistencia.
*   **Pagos con Stripe:** Integración completa con Stripe Checkout para pagos seguros.
*   **Control de Stock:** Actualización automática del inventario tras la compra.
*   **Panel de Administración:** Subida y gestión de imágenes para administradores.
*   **Diseño Moderno:** Interfaz con efectos Glassmorphism, animaciones y diseño responsivo.

## Tecnologías Utilizadas
*   **Frontend:** Angular 17+ (Signals, Standalone Components), Bootstrap 5.
*   **Backend:** Node.js, Express.js.
*   **Base de Datos:** MongoDB.
*   **Pagos:** Stripe API.
*   **Autenticación:** JWT (JSON Web Tokens).

## Instalación y Ejecución

### Requisitos Previos
*   Node.js (v18 o superior)
*   MongoDB (local o Atlas)
*   Cuenta de Stripe (para claves de prueba)

### Configuración del Backend
1.  Navegar a la carpeta `backend-galeria`.
2.  Instalar dependencias: `npm install`
3.  Crear archivo `.env` con:
    ```env
    PORT=5000
    MONGO_URI=tu_mongodb_uri
    JWT_SECRET=tu_secreto_jwt
    STRIPE_SECRET_KEY=tu_clave_secreta_stripe
    FRONTEND_URL=http://localhost:4200
    ```
4.  Iniciar servidor: `npm run dev`

### Configuración del Frontend
1.  Navegar a la carpeta `frontend-galeria`.
2.  Instalar dependencias: `npm install`
3.  Configurar claves en `src/environments/environment.ts`:
    ```typescript
    export const environment = {
      production: false,
      apiUrl: 'http://localhost:5000/api',
      stripePublishableKey: 'tu_clave_publica_stripe'
    };
    ```
4.  Iniciar aplicación: `npm start`

## Uso
1.  Registrarse como usuario nuevo.
2.  Explorar la galería y agregar imágenes al carrito.
3.  Proceder al pago (usar tarjeta de prueba Stripe `4242 4242 4242 4242`).
4.  Verificar que el stock se actualice y el carrito se vacíe tras el éxito.
