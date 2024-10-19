// src/routes/cart.routes.js
import express from 'express';
import {
  getCart,
  addItemToCart,
  updateItemQuantity,
  removeItemFromCart,
  clearCart
} from '../controllers/cart.controller.js';
import authMiddleware from '../middlewares/auth.middlewares.js'; // Middleware de autenticación

const router = express.Router();

// Rutas protegidas por el middleware de autenticación
router.get('/', authMiddleware, getCart);
router.post('/add', authMiddleware, addItemToCart);
router.put('/update', authMiddleware, updateItemQuantity);
router.delete('/remove', authMiddleware, removeItemFromCart);
router.delete('/clear', authMiddleware, clearCart);

export default router;
