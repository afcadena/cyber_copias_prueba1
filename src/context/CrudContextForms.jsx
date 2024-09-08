import { createContext, useEffect, useState } from "react";
import { helpHttp } from "../helpers/helpHttp";
import { useNavigate } from "react-router-dom";

const CrudContextForm = createContext();

const CrudProvider = ({ children }) => {
  const [db, setDb] = useState([]);
  const [error, setError] = useState(null);
  const [currentUser, setCurrentUser] = useState(() => {
    const savedUser = localStorage.getItem("currentUser");
    return savedUser ? JSON.parse(savedUser) : null;
  });
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
      userData.id = Date.now();
      userData.role = "cliente";
      
      const res = await api.post(url, { body: userData, headers: { "content-type": "application/json" } });
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
