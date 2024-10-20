import { createContext, useEffect, useState } from "react";
import API from "../api/api"; // Asegúrate de que la ruta sea correcta

const CrudContextProveedores = createContext();

const CrudProviderProveedores = ({ children }) => {
  const [db, setDb] = useState([]); // Base de datos inicial
  const [dataToEdit, setDataToEdit] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  let url = "/providers"; // URL de la API Express/MongoDB

  useEffect(() => {
    setLoading(true);
    API.get(url)
      .then((res) => {
        setDb(res.data.map(item => ({ ...item, id: item._id }))); // Asegúrate de convertir el _id a id
        setError(null);
      })
      .catch((err) => {
        setDb([]);
        setError(err.response.data); // Maneja el error adecuadamente
      })
      .finally(() => {
        setLoading(false);
      });
  }, [url]);

  const createData = (data) => {
    API.post(url, data)
      .then((res) => {
        setDb([...db, { ...res.data, id: res.data._id }]); // Asegúrate de agregar el _id
      })
      .catch((err) => {
        setError(err.response.data); // Maneja el error
      });
  };

  const updateData = (data) => {
    let endpoint = `${url}/${data.id}`;

    API.put(endpoint, data)
      .then((res) => {
        let newData = db.map((el) => (el.id === data.id ? { ...res.data, id: res.data._id } : el));
        setDb(newData);
      })
      .catch((err) => {
        setError(err.response.data); // Maneja el error
      });
  };

  const deleteData = (id) => {
    let endpoint = `${url}/${id}`;

    API.delete(endpoint)
      .then(() => {
        let newData = db.filter((el) => el.id !== id);
        setDb(newData);
      })
      .catch((err) => {
        setError(err.response.data); // Maneja el error
      });
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
  };

  return (
    <CrudContextProveedores.Provider value={data}>
      {children}
    </CrudContextProveedores.Provider>
  );
};

export { CrudProviderProveedores };
export default CrudContextProveedores;
