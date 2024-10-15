// src/context/CrudContextForms.js
import { createContext, useContext, useState } from "react";
import API from '../api/api'; // Importar la instancia de Axios
import { useNavigate } from "react-router-dom";

export const CrudContextForms = createContext();

const CrudProvider = ({ children }) => {
  const [error, setError] = useState(null);
  const [currentUser, setCurrentUser] = useState(() => {
    const savedUser = localStorage.getItem("currentUser");
    return savedUser ? JSON.parse(savedUser) : null;
  });
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

  // Función para actualizar otros datos del usuario
  const updateUser = async (updatedData) => {
    try {
      const res = await API.patch(`/auth/users/${currentUser.id}`, updatedData);
      if (res.data) {
        const updatedUser = { ...currentUser, ...res.data.user };
        setCurrentUser(updatedUser);
        localStorage.setItem("currentUser", JSON.stringify(updatedUser));
        console.log("Usuario actualizado:", updatedUser);
      }
    } catch (err) {
      setError(err.response?.data || err);
      console.error("Error actualizando usuario:", err);
    }
  };

  const data = {
    error,
    loginUser,
    registerUser,
    logoutUser,
    currentUser,
    updateUserAddress,
    updateUser,
  };

  return (
    <CrudContextForms.Provider value={data}>
      {children}
    </CrudContextForms.Provider>
  );
};

// Hook personalizado para usar el contexto
const useCrudContextForms = () => {
  const context = useContext(CrudContextForms);
  if (!context) {
    throw new Error('useCrudContextForms must be used within a CrudProvider');
  }
  return context;
};

export { CrudProvider, useCrudContextForms };
