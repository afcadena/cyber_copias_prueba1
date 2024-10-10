import { createContext, useContext, useEffect, useState } from "react";
import { helpHttp } from "../helpers/helpHttp";

const CrudContext = createContext();

// Proveedor del contexto
const CrudProvider = ({ children }) => {
  const [db, setDb] = useState(null);
  const [dataToEdit, setDataToEdit] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const api = helpHttp();
  const url = "http://localhost:3000/products";

  // Función para obtener todos los productos
  const getData = async () => {
    setLoading(true);
    try {
      const res = await api.get(url);
      if (!res.err) {
        setDb(res);
        setError(null);
      } else {
        setDb(null);
        setError(res);
      }
    } catch (error) {
      setError(error);
      setDb(null);
    }
    setLoading(false);
  };

  // Obtener los datos al montar el componente
  useEffect(() => {
    getData();
  }, [url]);

  // Función para crear un nuevo producto
  const createData = async (data) => {
    data.id = Date.now().toString(); // Asegurar que el ID es una cadena
    // Asegurarnos de que imageUrl es un arreglo
    if (typeof data.imageUrl === "string") {
      data.imageUrl = [data.imageUrl];
    }

    let options = {
      body: data,
      headers: { "content-type": "application/json" },
    };

    const res = await api.post(url, options);
    if (!res.err) {
      setDb((prevDb) => [...prevDb, res]); // Utiliza el estado anterior
    } else {
      setError(res);
    }
  };

  // Función para actualizar un producto
  const updateData = async (data) => {
    const endpoint = `${url}/${data.id}`;
    // Asegurarnos de que imageUrl es un arreglo
    if (typeof data.imageUrl === "string") {
      data.imageUrl = [data.imageUrl];
    }

    let options = {
      body: data,
      headers: { "content-type": "application/json" },
    };

    const res = await api.put(endpoint, options);
    if (!res.err) {
      const newData = db.map((el) => (el.id === data.id ? res : el));
      setDb(newData);
    } else {
      setError(res);
    }
  };

  // Función para eliminar un producto
  const deleteData = async (id) => {
    const isDelete = window.confirm(
      `¿Estás seguro de eliminar el registro con el id '${id}'?`
    );

    if (isDelete) {
      const endpoint = `${url}/${id}`;
      const options = {
        headers: { "content-type": "application/json" },
      };

      const res = await api.del(endpoint, options);
      if (!res.err) {
        const newData = db.filter((el) => el.id !== id);
        setDb(newData);
      } else {
        setError(res);
      }
    }
  };

  // Exposición del contexto
  const data = {
    db,
    error,
    loading,
    createData,
    dataToEdit,
    setDataToEdit,
    updateData,
    deleteData,
    getData, // Exponer getData
  };

  return <CrudContext.Provider value={data}>{children}</CrudContext.Provider>;
};

// Hook para usar el contexto
export const useProducts = () => {
  const context = useContext(CrudContext);
  if (!context) {
    throw new Error("useProducts debe ser utilizado dentro de un CrudProvider");
  }
  return context;
};

export { CrudProvider };
export default CrudContext;
