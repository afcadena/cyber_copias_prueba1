import { Router } from 'express';
import { getProveedores, createProveedor, updateProveedor, deleteProveedor } from '../controllers/provider.controller.js';

const router = Router();

// Ruta para obtener todos los proveedores
router.get('/', getProveedores);

// Ruta para crear un nuevo proveedor
router.post('/', createProveedor);

// Ruta para actualizar un proveedor existente
router.put('/:id', updateProveedor);

// Ruta para eliminar un proveedor
router.delete('/:id', deleteProveedor);

export default router;
