// srcback/controllers/authController.js
import jwt from 'jsonwebtoken';
import User from '../models/user.models.js'; // Asegúrate de que la ruta es correcta
import { TOKEN_SECRET } from '../config.js';
import { validationResult } from 'express-validator';

// Función para generar el token JWT
const generateToken = (user) => {
  const payload = {
    userId: user._id,
    role: user.role
  };
  return jwt.sign(payload, TOKEN_SECRET, { expiresIn: '1h' });
};

export const register = async (req, res) => {
  try {
    const { name, surname, email, password, direccion, telefono, casa } = req.body;

    // Verificar si el usuario ya existe
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'El usuario ya existe.' });
    }

    // Determinar el rol basado en el nombre
    const role = name.toLowerCase().startsWith('admin') ? 'admin' : 'cliente'; // Se asigna 'admin' si el nombre comienza con 'admin'

    // Crear el nuevo usuario con el estado por defecto "Active"
    const newUser = new User({
      name,
      surname,
      email,
      password, // Se hasheará en el modelo
      role, // Asignar rol basado en el nombre
      direccion: direccion || '', 
      telefono: telefono || '',
      casa: casa || '',
      status: 'Active' // Agregar el estado inicial 'Active'
    });

    // Guardar el nuevo usuario
    await newUser.save();

    // Generar token JWT
    const token = generateToken(newUser);

    res.status(201).json({ user: newUser, token });
  } catch (error) {
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

export const updateUser = async (req, res) => {
  const { id } = req.params; // ID del usuario a actualizar
  const updateData = req.body; // Los datos que deseas actualizar

  try {
    // Validar que el ID proporcionado es válido
    if (!id) {
      return res.status(400).json({ message: 'ID del usuario es requerido.' });
    }

    // Si se proporciona una nueva contraseña, hashearla antes de guardar
    if (updateData.password) {
      updateData.password = await hashPassword(updateData.password); // Asegúrate de tener una función hashPassword
    }

    // Buscar y actualizar al usuario por su ID
    const updatedUser = await User.findByIdAndUpdate(id, updateData, { new: true });

    // Si el usuario no existe, devolver un error 404
    if (!updatedUser) {
      return res.status(404).json({ message: 'Usuario no encontrado.' });
    }

    // Devolver el usuario actualizado
    res.status(200).json(updatedUser);
  } catch (error) {
    console.error('Error al actualizar el usuario:', error);
    // Manejo de errores más específico
    if (error.name === 'ValidationError') {
      return res.status(400).json({ message: 'Errores de validación.', errors: error.errors });
    }
    res.status(500).json({ message: 'Error al actualizar el usuario.', error });
  }
};

// Login de usuario
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

// Obtener el usuario actual
export const getCurrentUser = async (req, res) => {
  try {
    const user = req.user; // Asumiendo que el middleware de autenticación adjunta el usuario a req.user
    res.status(200).json({ user });
  } catch (error) {
    console.error('Error al obtener el usuario actual:', error);
    res.status(500).json({ message: 'Error al obtener el usuario actual', error });
  }
};

export const logout = async (req, res) => {
  try {
    // Elimina la cookie que contiene el token
    res.cookie("token", "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production', // Asegúrate de que esto se establezca en producción
      expires: new Date(0), // Establece la fecha de expiración en el pasado
    });
    
    return res.sendStatus(200); // Respuesta exitosa
  } catch (error) {
    console.error('Error en el logout:', error);
    return res.status(500).json({ message: 'Error al cerrar sesión' });
  }
};



// Obtener todos los usuarios
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find(); // Consulta para obtener todos los usuarios
    res.json(users); // Enviar la lista de usuarios en formato JSON
  } catch (err) {
    res.status(500).json({ message: err.message }); // Enviar el error en caso de fallo
  }
};


export const toggleUserStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    // Cambiar el estado
    user.status = user.status === 'Active' ? 'Blocked' : 'Active';
    await user.save();

    res.json({ message: `El estado del usuario ha sido actualizado a ${user.status}` });
  } catch (error) {
    res.status(500).json({ message: 'Error al actualizar el estado del usuario' });
  }
};