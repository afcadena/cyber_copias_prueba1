import { v2 as cloudinary } from 'cloudinary';
import { CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET, CLOUDINARY_UPLOAD_PRESET } from './config.js';

// Configurar Cloudinary con las credenciales
cloudinary.config({
  cloud_name: CLOUDINARY_CLOUD_NAME,
  api_key: CLOUDINARY_API_KEY,
  api_secret: CLOUDINARY_API_SECRET,
  upload: CLOUDINARY_UPLOAD_PRESET,
  secure: true, // Asegura que la conexión sea segura (HTTPS)
});

// Verificar que la configuración fue correcta
console.log("Cloudinary configurado:", cloudinary.config());

export default cloudinary;
