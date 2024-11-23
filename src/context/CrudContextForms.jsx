import { createContext, useContext, useState, useEffect, useCallback } from "react";
import API from '../api/api';
import { useNavigate } from "react-router-dom";
import axios from 'axios';

export const CrudContextForms = createContext();

const CrudProvider = ({ children }) => {
  const [error, setError] = useState(null);
  const [currentUser, setCurrentUser] = useState(() => {
    const savedUser = localStorage.getItem("currentUser");
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  // Función para registrar un nuevo usuario
  const registerUser = async (userData) => {
    try {
      const res = await API.post('/auth/register', userData);
      if (res.data) {
        setCurrentUser(res.data.user);
        localStorage.setItem("currentUser", JSON.stringify(res.data.user));
        localStorage.setItem("token", res.data.token);
        return res.data;
      }
    } catch (err) {
      setError(err.response?.data || err);
      console.error("Error al registrar el usuario:", err);
      return null;
    }
  };

  // Función para iniciar sesión
  const loginUser = async (email, password) => {
    try {
      const res = await API.post('/auth/login', { email, password });
      if (res.data) {
        setCurrentUser(res.data.user);
        localStorage.setItem("currentUser", JSON.stringify(res.data.user));
        localStorage.setItem("token", res.data.token);
        return res.data.user;
      }
    } catch (err) {
      setError(err.response?.data || err);
      console.error("Error al iniciar sesión:", err);
      return null;
    }
  };

  // Función para cerrar sesión
  const logoutUser = () => {
    setCurrentUser(null);
    localStorage.removeItem("currentUser");
    localStorage.removeItem("token");
    navigate("/login");
  };

  // Función para actualizar la dirección del usuario
  const updateUserAddress = (newAddress) => {
    if (currentUser) {
      const updatedUser = { ...currentUser, direccion: newAddress };
      setCurrentUser(updatedUser);
      localStorage.setItem("currentUser", JSON.stringify(updatedUser));
    }
  };

  // Función para actualizar al usuario
  const updateUser = async (userId, userData) => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        throw new Error("No se encontró un token de autenticación. El usuario no está autenticado.");
      }

      const response = await axios.patch(
        `https://cyber-copias-prueba1.onrender.com//api/auth/users/${userId}`,
        userData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log('Usuario actualizado correctamente:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error actualizando usuario:', error);
    }
  };

  // Verificar si el usuario es administrador
  const isAdmin = () => currentUser?.role === 'admin';

  // Obtener todos los usuarios
  const getAllUsers = useCallback(async () => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No authentication token found");
      }
      const response = await API.get('/auth/users', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUsers(response.data);
      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching users:', error);
      setError(error.message);
      setIsLoading(false);
    }
  }, []);

  // Actualizar el estado del usuario
const toggleUserStatus = async (userId) => {
  try {
    const user = users.find((u) => u._id === userId); // Verifica el campo '_id'
    
    if (!user) {
      throw new Error(`Usuario con ID ${userId} no encontrado`);
    }

    const updatedStatus = user.status === 'Active' ? 'Blocked' : 'Active';
    
    // Actualiza el estado del usuario en la base de datos
    await API.patch(`/auth/users/${userId}/status`, { status: updatedStatus });
    
    // Actualiza el estado del usuario en el frontend
    setUsers(users.map(u => (u._id === userId ? { ...u, status: updatedStatus } : u)));
  } catch (err) {
    setError(err.message || err.response?.data);
    console.error("Error al actualizar el estado del usuario:", err);
  }
};


  useEffect(() => {
    if (currentUser && currentUser.role === 'admin') {
      getAllUsers();
    }
  }, [currentUser]);

  const data = {
    error,
    loginUser,
    registerUser,
    logoutUser,
    currentUser,
    updateUserAddress,
    updateUser,
    isAdmin,
    users,
    getAllUsers,
    toggleUserStatus,
    isLoading,
  };

  return (
    <CrudContextForms.Provider value={data}>
      {children}
    </CrudContextForms.Provider>
  );
};

const useCrudContextForms = () => {
  const context = useContext(CrudContextForms);
  if (!context) {
    throw new Error('useCrudContextForms must be used within a CrudProvider');
  }
  return context;
};

export { CrudProvider, useCrudContextForms };
