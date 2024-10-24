import express from 'express';
import multer from 'multer';
import {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  addReview,
  uploadImage // Nueva función para manejar la carga de imágenes
} from '../controllers/product.controller.js';

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

// Rutas existentes
router.get('/', getProducts);
router.get('/:id', getProductById);
router.post('/', createProduct);
router.put('/:id', updateProduct);
router.delete('/:id', deleteProduct);
router.post('/:id/reviews', addReview);

// Nueva ruta para cargar imágenes
router.post('/upload', upload.single('image'), uploadImage);

export default router;