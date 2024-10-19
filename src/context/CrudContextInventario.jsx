import { createContext, useContext, useEffect, useState } from "react";
import API from '../api/api'; // Importar la instancia de Axios

const CrudContext = createContext();

const CrudProvider = ({ children }) => {
  const [db, setDb] = useState(null);
  const [dataToEdit, setDataToEdit] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const url = "/products"; // Nueva URL base de la API de productos

  // Función para obtener todos los productos
  const getData = async () => {
    setLoading(true);
    try {
      const res = await API.get(url); // Usamos API de axios
      setDb(res.data); // El resultado de axios está en res.data
      setError(null);
    } catch (error) {
      setError(error.response ? error.response.data : error.message);
      setDb(null);
    }
    setLoading(false);
  };

  useEffect(() => {
    getData();
  }, []);

  // Función para crear un nuevo producto
  const createData = async (data) => {
    // En MongoDB, el id se genera automáticamente
    try {
      const res = await API.post(url, data); // Creando producto en MongoDB
      setDb((prevDb) => [...prevDb, res.data]); // Actualizar db con el nuevo producto
    } catch (error) {
      setError(error.response ? error.response.data : error.message);
    }
  };

  // Función para actualizar un producto
  const updateData = async (data) => {
    const endpoint = `${url}/${data._id}`;
    try {
      const res = await API.put(endpoint, data);
      const newData = db.map((el) => (el._id === data._id ? res.data : el));
      setDb(newData);
    } catch (error) {
      console.error('Error al actualizar producto:', error); // Agrega esta línea para depurar
      setError(error.response ? error.response.data : error.message);
    }
  };

  // Función para eliminar un producto
  const deleteData = async (id) => {
    const isDelete = window.confirm(
      `¿Estás seguro de eliminar el registro con el id '${id}'?`
    );

    if (isDelete) {
      const endpoint = `${url}/${id}`;
      try {
        await API.delete(endpoint); // Eliminamos el producto
        const newData = db.filter((el) => el._id !== id);
        setDb(newData);
      } catch (error) {
        setError(error.response ? error.response.data : error.message);
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
    getData,
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
