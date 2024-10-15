// srcback/routes/auth.routes.js
import express from 'express';
import { register, login, getCurrentUser } from '../controllers/auth.controller.js';
import authMiddleware from '../middlewares/auth.middlewares.js'; // Middleware para verificar JWT

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/me', authMiddleware, getCurrentUser); // Ejemplo para obtener el usuario actual

export default router;
