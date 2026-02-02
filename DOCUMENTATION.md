# Documentación Técnica - Galería de Imágenes

Este proyecto consiste en una aplicación web completa (MEAN Stack: MongoDB, Express, Angular, Node.js) para la gestión y visualización de una galería de imágenes con autententicación y roles.

## 🛠 Tecnologías Utilizadas

### Backend (`backend-galeria`)
- **Runtime**: Node.js
- **Framework Web**: Express.js
- **Base de Datos**: MongoDB (usando Mongoose ODM)
- **Autenticación**: JSON Web Tokens (JWT)
- **Manejo de Archivos**: Multer (para subida de imágenes)
- **Seguridad**: `cors`, `dotenv`

### Frontend (`frontend-galeria`)
- **Framework**: Angular v21.1.0
- **Estilos**: Bootstrap 5.3.8
- **Cliente HTTP**: Angular HttpClient
- **Programación Reactiva**: RxJS, Angular Signals
- **Lenguaje**: TypeScript

---

## 🏗 Arquitectura del Proyecto

### Estructura de Carpetas

```
GaleriaDeImagenes/
├── backend-galeria/        # API RESTful
│   ├── config/             # Configuración de BD
│   ├── controllers/        # Lógica de negocio (CRUD)
│   ├── middlewares/        # Auth (verificarToken) y Upload
│   ├── models/             # Esquemas Mongoose (User, Image)
│   ├── routes/             # Definición de endpoints
│   └── server.js           # Punto de entrada
│
└── frontend-galeria/       # SPA Angular
    └── src/app/
        ├── autenticacion/  # Componentes de Login/Registro
        ├── guards/         # Protección de rutas (AuthGuard)
        ├── interceptor/    # Inyección de Token (AuthInterceptor)
        ├── interfaces/     # Modelos TypeScript (User, Image)
        ├── services/       # Comunicación con API (AuthService, ImageService)
        └── ...componentes  # Vistas (Inicio, Galeria, Admin)
```

## 🔐 Seguridad y Autenticación

El sistema implementa un flujo de autenticación seguro:

1.  **Registro/Login**: El usuario envía credenciales al backend.
2.  **JWT**: El backend valida y retorna un token JWT firmado.
3.  **Almacenamiento**: El frontend guarda el token en `localStorage`.
4.  **Interceptor**: `AuthInterceptor` intercepta **todas** las peticiones HTTP salientes y añade el header `Authorization: Bearer <token>`.
5.  **Guards**: `AuthGuard` verifica la existencia del token antes de permitir acceso a rutas protegidas (`/admin`, `/subir-imagen`).
6.  **Backend Verification**: El middleware `verificarToken` protege las rutas de escritura (POST, PUT, DELETE) en el servidor.

## 📡 API Endpoints

### Autenticación (`/api/auth`)
- `POST /register`: Crear nuevo usuario.
- `POST /login`: Iniciar sesión y obtener token.

### Imágenes (`/api/images`)
- `GET /`: Obtener todas las imágenes (Público).
- `GET /:id`: Obtener detalle de imagen (Público).
- `POST /`: Subir nueva imagen (**Privado** - Requiere Token + FormData).
- `PUT /:id`: Actualizar imagen existene (**Privado** - Requiere Token).
- `DELETE /:id`: Eliminar imagen (**Privado** - Requiere Token).

## 🚀 Instalación y Ejecución

### Requisitos Previos
- Node.js instalado.
- MongoDB Atlas URI configurado en `.env`.

### Pasos
1.  **Backend**:
    ```bash
    cd backend-galeria
    npm install
    npm start
    ```
    _Servidor corriendo en http://localhost:5000_

2.  **Frontend**:
    ```bash
    cd frontend-galeria
    npm install
    ng serve
    ```
    _Aplicación disponible en http://localhost:4200_
