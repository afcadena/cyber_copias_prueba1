import { createContext, useContext, useEffect, useState } from "react";
import { helpHttp } from "../helpers/helpHttp";
import { useNavigate } from "react-router-dom";
import axios from 'axios';

export const CrudContextForms = createContext();

const CrudProvider = ({ children }) => {
  const [db, setDb] = useState([]);
  const [error, setError] = useState(null);
  const [currentUser, setCurrentUser] = useState(() => {
    const savedUser = localStorage.getItem("currentUser");
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [currentUserAddress, setCurrentUserAddress] = useState(currentUser ? currentUser.direccion : null);
  const navigate = useNavigate();

  const api = helpHttp();
  const url = "http://localhost:3000/users";

  useEffect(() => {
    api.get(url).then((res) => {
      if (!res.err) {
        setDb(Array.isArray(res) ? res : []);
        setError(null);
      } else {
        setDb([]);
        setError(res);
      }
    });
  }, [url]);

  const registerUser = async (userData) => {
    try {
      const newUserData = {
        ...userData,
        id: String(Date.now()),  // Generar id como cadena
        role: "cliente",
        direccion: "",  // Agregar campo vacio
        telefono: "", 
        casa: ""  // Agregar campo vacio
      };

      const res = await api.post(url, { body: newUserData, headers: { "content-type": "application/json" } });
      if (!res.err) {
        setDb([...db, res]);
        setCurrentUser(res);
        localStorage.setItem("currentUser", JSON.stringify(res));
        return res;
      } else {
        setError(res);
        console.error("Error al registrar el usuario:", res);
        return null;
      }
    } catch (error) {
      setError(error);
      console.error("Error de red al registrar usuario:", error);
      return null;
    }
  };

  const loginUser = async (email, password) => {
    if (!Array.isArray(db)) {
      setError({ err: true, status: 500, statusText: "Error en la base de datos de usuarios" });
      return null;
    }

    if (!email || !password) {
      setError({ err: true, status: 400, statusText: "Faltan credenciales" });
      return null;
    }

    const user = db.find((user) => user.email === email && user.password === password);

    if (user) {
      setCurrentUser(user);
      localStorage.setItem("currentUser", JSON.stringify(user));
      return user;
    } else {
      setError({ err: true, status: 401, statusText: "Credenciales inválidas" });
      return null;
    }
  };

  const logoutUser = () => {
    setCurrentUser(null);
    localStorage.removeItem("currentUser");
    navigate("/login");
  };

  const updateUserAddress = (newAddress) => {
    const updatedUser = { ...currentUser, direccion: newAddress };
    setCurrentUser(updatedUser);
    setCurrentUserAddress(newAddress);
    localStorage.setItem("currentUser", JSON.stringify(updatedUser));
  };

  const updateUser = async (updatedData) => {
    try {
      const response = await axios.patch(`http://localhost:3000/users/${currentUser.id}`, updatedData, {
        headers: { "Content-Type": "application/json" }
      });
  
      if (response.data) {
        const updatedUser = { ...currentUser, ...response.data };
        setCurrentUser(updatedUser);
        localStorage.setItem("currentUser", JSON.stringify(updatedUser));
        console.log("Usuario actualizado:", updatedUser);
      }
    } catch (error) {
      console.error("Error actualizando usuario:", error);
      setError(error);
    }
  };
  
  

  const data = {
    db,
    error,
    loginUser,
    registerUser,
    logoutUser,
    currentUser,
    currentUserAddress,
    updateUserAddress,
    updateUser,
  };

  return (
    <CrudContextForms.Provider value={data}>
      {children}
    </CrudContextForms.Provider>
  );
};

// Renombrar el hook a `useCrudContextForms`
const useCrudContextForms = () => {
  const context = useContext(CrudContextForms);
  if (!context) {
    throw new Error('useCrudContextForms must be used within a CrudProvider');
  }
  return context;
};

export { CrudProvider, useCrudContextForms };
