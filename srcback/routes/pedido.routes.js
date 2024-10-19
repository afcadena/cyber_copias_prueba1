// src/routes/pedido.routes.js
import express from 'express';
import { getPedidos, createPedido, updatePedido, deletePedido } from '../controllers/pedido.controller.js';

const router = express.Router();

// Rutas CRUD para pedidos
router.get('/', getPedidos); // Obtener todos los pedidos
router.post('/', createPedido); // Crear un pedido nuevo
router.put('/:id', updatePedido); // Actualizar un pedido
router.delete('/:id', deletePedido); // Eliminar un pedido

export default router;
