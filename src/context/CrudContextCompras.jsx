import { createContext, useState, useEffect, useContext } from 'react';
import API from '../api/api'; // Importa la configuración de Axios

const CrudContextCompras = createContext();

export function CrudProviderCompras({ children }) {
  const [db, setDb] = useState([]);
  const [dataToEdit, setDataToEdit] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const url = '/compras'; 

  useEffect(() => {
    setLoading(true);
    API.get(url)
      .then((res) => {
        setDb(res.data); // Accedemos a la data directamente del response
        setError(null);
      })
      .catch((err) => {
        setError(err);
        setDb([]);
      })
      .finally(() => setLoading(false));
  }, [url]);

  const createData = (data) => {
    API.post(url, data)
      .then((res) => {
        setDb((prevDb) => [...prevDb, res.data]); // Se añade la nueva compra
      })
      .catch((err) => {
        setError(err);
      });
  };

  const updateData = (data) => {
    const endpoint = `${url}/${data._id}`;
    API.put(endpoint, data)
      .then((res) => {
        const updatedDb = db.map((el) => (el._id === data._id ? data : el));
        setDb(updatedDb);
      })
      .catch((err) => {
        setError(err);
      });
  };

  const deleteData = (id) => {
    const endpoint = `${url}/${id}`;
    API.delete(endpoint)
      .then(() => {
        const updatedDb = db.filter((el) => el._id !== id);
        setDb(updatedDb);
      })
      .catch((err) => {
        setError(err);
      });
  };

  return (
    <CrudContextCompras.Provider value={{ db, createData, updateData, deleteData, dataToEdit, setDataToEdit, error, loading }}>
      {children}
    </CrudContextCompras.Provider>
  );
}

export const useCrudContextCompras = () => useContext(CrudContextCompras);

export default CrudContextCompras;
