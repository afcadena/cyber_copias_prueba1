import express from 'express';
import { getAllCompras, createCompra, updateCompra, deleteCompra } from '../controllers/compra.controller.js';

const router = express.Router();

// Rutas CRUD de compras
router.get('/', getAllCompras);         // Obtener todas las compras
router.post('/', createCompra);         // Crear una nueva compra
router.put('/:id', updateCompra);       // Actualizar una compra
router.delete('/:id', deleteCompra);    // Eliminar una compra

export default router;
