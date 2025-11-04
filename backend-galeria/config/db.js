import mongoose from "mongoose";
import dotenv from "dotenv"; // carga de variables de entorno en .env para ser vistas en todo el proyecto

dotenv.config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ Conectado a MongoDB");
  } catch (error) {
    console.error("❌ Error al conectar a MongoDB:", error);
    process.exit(1);
  }
};

export default connectDB;

//intenta conectarse a mongodb por medio de la url que esta en .env