// srcback/app.js
import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import { MONGODB_URI } from './config.js'; // Importa MONGODB_URI desde config.js
import authRoutes from './routes/auth.routes.js';
import cartRoutes from './routes/cart.routes.js';
import productRoutes from './routes/product.routes.js';
import pedidoRoutes from './routes/pedido.routes.js'


const app = express();

// Middleware para parsear el cuerpo de las solicitudes
app.use(express.json());

// Configurar CORS
app.use(cors({
  origin: 'http://localhost:5173', // Asegúrate de que este sea el origen de tu frontend
  credentials: true, // Si necesitas enviar cookies o credenciales
}));

app.use('/api/auth', authRoutes);
app.use('/api/cart', cartRoutes); // Ruta para carritox
app.use('/api/products', productRoutes); // Ruta para productos
app.use('/api/pedidos', pedidoRoutes); // Asignar las rutas de pedidos a /api/pedidos

// Ruta de prueba
app.get('/', (req, res) => {
  res.send('¡API funcionando correctamente!');
});

// Manejo de rutas no encontradas
app.use((req, res, next) => {
  res.status(404).json({ message: 'Ruta no encontrada' });
});

// Manejo de errores
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Error interno del servidor' });
});

export default app;