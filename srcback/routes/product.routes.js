import express from 'express';
import {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  addReview // Importar la nueva función
} from '../controllers/product.controller.js';

const router = express.Router();

// Obtener todos los productos
router.get('/', getProducts);

// Obtener un producto por ID
router.get('/:id', getProductById);

// Crear un nuevo producto
router.post('/', createProduct);

// Actualizar un producto por ID
router.put('/:id', updateProduct);

// Eliminar un producto por ID
router.delete('/:id', deleteProduct);

// Nueva ruta para agregar reseñas
router.post('/:id/reviews', addReview); // Ruta para agregar reseñas

export default router;
