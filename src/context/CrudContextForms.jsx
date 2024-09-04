import { createContext, useEffect, useState } from "react";
import { helpHttp } from "../helpers/helpHttp";

const CrudContextForm = createContext();

const CrudProvider = ({ children }) => {
  const [db, setDb] = useState(null);
  const [error, setError] = useState(null);
  const [currentUser, setCurrentUser] = useState(null); // Estado para manejar el usuario actual

  const api = helpHttp();
  const url = "http://localhost:3000/users"; // Ajusta la URL según tu backend

  useEffect(() => {
    api.get(url).then((res) => {
      if (!res.err) {
        setDb(res);
        setError(null);
      } else {
        setDb(null);
        setError(res);
      }
    });
  }, [url]);

  // Función para iniciar sesión
  const loginUser = async (email, password) => {
    const user = db?.find((user) => user.email === email && user.password === password);

    if (user) {
      setCurrentUser(user);  // Establecer el usuario autenticado
      return user;
    } else {
      setError({ err: true, status: 401, statusText: "Credenciales inválidas" });
      return null;
    }
  };

  // Función para registrar un nuevo usuario
  const registerUser = async (userData) => {
    try {
      const res = await api.post(url, { body: userData });
      if (!res.err) {
        setCurrentUser(res); // Establecer el nuevo usuario como el usuario autenticado
        return res;
      } else {
        setError(res);
        return null;
      }
    } catch (error) {
      setError(error);
      return null;
    }
  };

  // Función para cerrar sesión
  const logoutUser = () => {
    setCurrentUser(null); // Limpiar el usuario autenticado
  };

  const data = {
    db,
    error,
    loginUser,
    registerUser,  // Proporcionar la función de registro
    logoutUser,    // Proporcionar la función de cerrar sesión
    currentUser,   // Usuario actualmente autenticado
  };

  return (
    <CrudContextForm.Provider value={data}>
      {children}
    </CrudContextForm.Provider>
  );
};

export { CrudProvider, CrudContextForm };
