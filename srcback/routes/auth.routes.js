import express from 'express';
import { register, login, getCurrentUser,logout } from '../controllers/auth.controller.js';
import { body, validationResult } from 'express-validator';
import authMiddleware from '../middlewares/auth.middlewares.js';

const router = express.Router();

router.post(
  '/register',
  [
    body('name').notEmpty().withMessage('El nombre es requerido.'),
    body('surname').notEmpty().withMessage('El apellido es requerido.'),
    body('email').isEmail().withMessage('Email inválido.'),
    body('password').isLength({ min: 8 }).withMessage('La contraseña debe tener al menos 8 caracteres.'),
    body('telefono')
      .optional()
      .matches(/^\d{10,15}$/)
      .withMessage('El teléfono debe contener entre 10 y 15 dígitos.'),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log("Errores de validación:", errors.array()); // Para depuración
      return res.status(400).json({ errors: errors.array() });
    }
    
    // Llama a la función register aquí
    await register(req, res);
  }
);

router.post('/login', login);
router.get('/me', authMiddleware, getCurrentUser); // Ejemplo para obtener el usuario actual
router.post('/logout', logout); 

export default router;
