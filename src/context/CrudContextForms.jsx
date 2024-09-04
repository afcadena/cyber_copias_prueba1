import { createContext, useEffect, useState } from "react";
import { helpHttp } from "../helpers/helpHttp";

const CrudContextForm = createContext();

const CrudProvider = ({ children }) => {
  const [db, setDb] = useState([]);
  const [error, setError] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);

  const api = helpHttp();
  const url = "http://localhost:3000/users";

  useEffect(() => {
    api.get(url).then((res) => {
      if (!res.err) {
        setDb(res);
        setError(null);
      } else {
        setDb([]);
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
