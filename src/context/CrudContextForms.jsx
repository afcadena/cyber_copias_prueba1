import { createContext, useEffect, useState } from "react";
import { helpHttp } from "../helpers/helpHttp";

const CrudContextForm = createContext();

const CrudProvider = ({ children }) => {
  const [db, setDb] = useState(null);
  const [dataToEdit, setDataToEdit] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [currentUser, setCurrentUser] = useState(null); // Estado para manejar el usuario actual

  const api = helpHttp();
  const url = "http://localhost:3000/users"; // Ajusta la URL según tu backend

  useEffect(() => {
    setLoading(true);
    api.get(url).then((res) => {
      if (!res.err) {
        setDb(res);
        setError(null);
      } else {
        setDb(null);
        setError(res);
      }
      setLoading(false);
    });
  }, [url]);

  const createData = (data) => {
    data.id = Date.now();
    const options = {
      body: data,
      headers: { "content-type": "application/json" },
    };

    api.post(url, options).then((res) => {
      if (!res.err) {
        setDb([...db, res]);
      } else {
        setError(res);
      }
    });
  };

  const updateData = (data) => {
    const endpoint = `${url}/${data.id}`;
    const options = {
      body: data,
      headers: { "content-type": "application/json" },
    };

    api.put(endpoint, options).then((res) => {
      if (!res.err) {
        const newData = db.map((el) => (el.id === data.id ? data : el));
        setDb(newData);
      } else {
        setError(res);
      }
    });
  };

  const deleteData = (id) => {
    const isDelete = window.confirm(
      `¿Estás seguro de eliminar el registro con el id '${id}'?`
    );

    if (isDelete) {
      const endpoint = `${url}/${id}`;
      const options = {
        headers: { "content-type": "application/json" },
      };

      api.del(endpoint, options).then((res) => {
        if (!res.err) {
          const newData = db.filter((el) => el.id !== id);
          setDb(newData);
        } else {
          setError(res);
        }
      });
    }
  };

  const registerUser = (userData) => {
    userData.id = Date.now();
    userData.role = "cliente"; // Establece el rol predeterminado como "cliente"

    const options = {
      body: userData,
      headers: { "content-type": "application/json" },
    };

    return api.post(url, options).then((res) => {
      if (!res.err) {
        setDb([...db, res]);
        return res;
      } else {
        setError(res);
        return null;
      }
    });
  };

  const loginUser = (email, password) => {
    const user = db?.find((user) => user.email === email && user.password === password);

    if (user) {
      setCurrentUser(user);
      return user;
    } else {
      setError({ err: true, status: 401, statusText: "Credenciales inválidas" });
      return null;
    }
  };

  const logoutUser = () => {
    setCurrentUser(null);
  };

  const data = {
    db,
    error,
    loading,
    createData,
    dataToEdit,
    setDataToEdit,
    updateData,
    deleteData,
    registerUser,
    loginUser,
    logoutUser,
    currentUser, // Usuario actualmente autenticado
  };

  return (
    <CrudContextForm.Provider value={data}>
      {children}
    </CrudContextForm.Provider>
  );
};

export { CrudProvider, CrudContextForm };
