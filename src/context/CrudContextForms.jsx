import { createContext, useEffect, useState } from "react";
import { helpHttp } from "../helpers/helpHttp";
import { useNavigate } from "react-router-dom"; // Importa useNavigate

const CrudContextForm = createContext();

const CrudProvider = ({ children }) => {
  const [db, setDb] = useState([]);  // Aseguramos que db sea siempre un array inicialmente
  const [error, setError] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const navigate = useNavigate(); // Inicializa useNavigate

  const api = helpHttp();
  const url = "http://localhost:3000/users";

  useEffect(() => {
    api.get(url).then((res) => {
      if (!res.err) {
        setDb(Array.isArray(res) ? res : []);  // Aseguramos que 'res' sea un array
        setError(null);
      } else {
        setDb([]);  // En caso de error, db es un array vacío
        setError(res);
      }
    });
  }, [url]);

  const registerUser = async (userData) => {
    try {
      userData.id = Date.now(); // Generar un ID único basado en la marca de tiempo
      userData.role = "cliente"; // Establecer el rol predeterminado como "cliente"
      
      const res = await api.post(url, { body: userData, headers: { "content-type": "application/json" } });
      if (!res.err) {
        setDb([...db, res]);
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

  const loginUser = async (email, password) => {
    if (!Array.isArray(db)) {
      setError({ err: true, status: 500, statusText: "Error en la base de datos de usuarios" });
      return null;
    }

    const user = db.find((user) => user.email === email && user.password === password);

    if (user) {
      setCurrentUser(user); // Establecer el usuario autenticado
      return user;
    } else {
      setError({ err: true, status: 401, statusText: "Credenciales inválidas" });
      return null;
    }
  };

  const logoutUser = () => {
    setCurrentUser(null); // Limpiar el usuario autenticado
    navigate("/login"); // Redirigir a la página de inicio de sesión
  };

  const data = {
    db,
    error,
    loginUser,
    registerUser,
    logoutUser,
    currentUser,
  };

  return (
    <CrudContextForm.Provider value={data}>
      {children}
    </CrudContextForm.Provider>
  );
};

export { CrudProvider, CrudContextForm };
