// routes/ventaRoutes.js

import express from 'express';
import {
  getAllVentas,
  createVenta,
  updateVenta,
  deleteVenta,
} from '../controllers/venta.controller.js';

const router = express.Router();

// Obtener todas las ventas
router.get('/', getAllVentas);

// Crear una nueva venta
router.post('/', createVenta);

// Actualizar una venta por ID
router.put('/:id', updateVenta);

// Eliminar una venta por ID
router.delete('/:id', deleteVenta);

export default router;
