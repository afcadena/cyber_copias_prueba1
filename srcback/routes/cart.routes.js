// srcback/routes/cart.routes.js
import express from 'express';
import {
  getCart,
  addItemToCart,
  updateItemQuantity,
  removeItemFromCart,
  clearCart
} from '../controllers/cart.controller.js';
import authMiddleware from '../middlewares/auth.middlewares.js'; // Asegúrate de que la ruta es correcta

const router = express.Router();

// Obtener el carrito del usuario autenticado
router.get('/', authMiddleware, getCart);

// Agregar producto al carrito
router.post('/add', authMiddleware, addItemToCart);

// Actualizar cantidad de un producto en el carrito
router.put('/update', authMiddleware, updateItemQuantity);

// Eliminar producto del carrito
router.delete('/remove', authMiddleware, removeItemFromCart);

// Vaciar el carrito
router.delete('/clear', authMiddleware, clearCart);

export default router;
