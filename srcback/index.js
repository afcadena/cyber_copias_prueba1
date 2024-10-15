// srcback/index.js
import app from './app.js';
import mongoose from 'mongoose';
import { PORT, MONGODB_URI } from './config.js';

mongoose.connect(MONGODB_URI)
  .then(() => {
    console.log('MongoDB is connected');

    // Iniciar el servidor solo después de conectarse a la base de datos
    const server = app.listen(PORT, () => {
      console.log(`Servidor corriendo en http://localhost:${PORT}`);
    });

    // Manejo de errores del servidor
    server.on('error', (err) => {
      if (err.code === 'EADDRINUSE') {
        console.error(`El puerto ${PORT} ya está en uso. Intenta usar otro puerto.`);
        process.exit(1);
      } else {
        console.error('Error del servidor:', err);
      }
    });
  })
  .catch(err => {
    console.error('Error al conectar a MongoDB', err);
    process.exit(1); // Salir con error
  });
