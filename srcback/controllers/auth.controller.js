// srcback/controllers/authController.js
import jwt from 'jsonwebtoken';
import User from '../models/user.models.js';
import { TOKEN_SECRET } from '../config.js'; // Asegúrate de exportar TOKEN_SECRET en tu config.js

// Función para generar el token JWT
const generateToken = (user) => {
  const payload = {
    userId: user._id,
    role: user.role
  };
  return jwt.sign(payload, TOKEN_SECRET, { expiresIn: '1h' });
};

// Registro de usuario
export const register = async (req, res) => {
  try {
    const { name, surname, email, password } = req.body;

    // Validaciones básicas
    if (!name || !surname || !email || !password) {
      return res.status(400).json({ message: 'Por favor, completa todos los campos requeridos.' });
    }

    // Verificar si el usuario ya existe
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'El usuario ya existe.' });
    }

    // Crear el nuevo usuario
    const newUser = new User({
      name,
      surname,
      email,
      password, // Asegúrate de que el password se hashea antes de guardarlo
      role: 'cliente' // Puedes ajustar esto según tus necesidades
    });

    await newUser.save();

    // Generar el token JWT
    const token = generateToken(newUser);

    res.status(201).json({ user: newUser, token });
  } catch (error) {
    console.error('Error en el registro:', error);
    res.status(500).json({ message: 'Error interno del servidor.' });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validaciones
    if (!email || !password) {
      return res.status(400).json({ message: 'Por favor, proporciona email y contraseña' });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Credenciales inválidas' });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Credenciales inválidas' });
    }

    const token = generateToken(user);

    res.status(200).json({ user, token });
  } catch (error) {
    console.error('Error en inicio de sesión:', error);
    res.status(500).json({ message: 'Error al iniciar sesión', error });
  }
};

export const getCurrentUser = async (req, res) => {
  try {
    const user = req.user; // Asumiendo que el middleware de autenticación adjunta el usuario a req.user
    res.status(200).json({ user });
  } catch (error) {
    console.error('Error al obtener el usuario actual:', error);
    res.status(500).json({ message: 'Error al obtener el usuario actual', error });
  }
};
