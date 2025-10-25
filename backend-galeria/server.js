import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import connectDB from "./config/db.js";
import imageRoutes from "./routes/imageRoutes.js";

dotenv.config();

const app = express();
connectDB();

// Para poder usar __dirname con ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middleware
app.use(cors());
app.use(express.json());

// Servir carpeta uploads
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Rutas
app.use("/api/images", imageRoutes);

// Servidor
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Servidor corriendo en puerto ${PORT}`));
