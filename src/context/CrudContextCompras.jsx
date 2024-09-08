import { createContext, useContext, useEffect, useState } from "react";
import { helpHttp } from "../helpers/helpHttp";

const CrudContextCompras = createContext();

export function CrudProviderCompras({ children }) {
  const [db, setDb] = useState([]);
  const [dataToEdit, setDataToEdit] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const api = helpHttp();
  const url = "http://localhost:3000/compras"; // Verifica que esta URL sea correcta

  useEffect(() => {
    setLoading(true);
    api.get(url)
      .then(res => {
        if (!res.err) {
          const updatedData = res.map(item => ({
            ...item,
            id: item.id.toString(), // Convertir el ID a cadena
          }));
          setDb(updatedData);
          setError(null);
        } else {
          setDb([]);
          setError(res);
        }
        setLoading(false);
      })
      .catch(err => {
        console.error("Error fetching data:", err);
        setError(err);
        setDb([]);
        setLoading(false);
      });
  }, [url]);

  const createData = (data) => {
    const newData = {
      ...data,
      id: Date.now().toString(), // Convertir el ID a cadena
    };

    const options = {
      body: JSON.stringify(newData),
      headers: { "content-type": "application/json" },
    };

    setLoading(true);
    setError(null);

    api.post(url, options)
      .then(res => {
        if (!res.err) {
          setDb(prevDb => [...prevDb, res]);
        } else {
          setError(res);
        }
        setLoading(false);
      })
      .catch(err => {
        console.error("Error creating data:", err);
        setError(err);
        setLoading(false);
      });
  };

  const updateData = (data) => {
    const endpoint = `${url}/${data.id}`;
    const options = {
      body: JSON.stringify(data),
      headers: { "content-type": "application/json" },
    };

    setLoading(true);
    setError(null);

    api.put(endpoint, options)
      .then(res => {
        if (!res.err) {
          setDb(prevDb => prevDb.map(el => (el.id === data.id ? res : el)));
        } else {
          setError(res);
        }
        setLoading(false);
      })
      .catch(err => {
        console.error("Error updating data:", err);
        setError(err);
        setLoading(false);
      });
  };

  const deleteData = (id) => {
    const endpoint = `${url}/${id}`;
    const options = {
      headers: { "content-type": "application/json" },
    };

    setLoading(true);
    setError(null);

    api.del(endpoint, options)
      .then(res => {
        if (!res.err) {
          setDb(prevDb => prevDb.filter(el => el.id !== id));
        } else {
          setError(res);
        }
        setLoading(false);
      })
      .catch(err => {
        console.error("Error deleting data:", err);
        setError(err);
        setLoading(false);
      });
  };

  const data = {
    db,
    error,
    loading,
    createData,
    updateData,
    deleteData,
    dataToEdit,
    setDataToEdit,
  };

  return (
    <CrudContextCompras.Provider value={data}>
      {children}
    </CrudContextCompras.Provider>
  );
}

export default function useCrudContextCompras() {
  const context = useContext(CrudContextCompras);
  if (context === undefined) {
    throw new Error("useCrudContextCompras must be used within a CrudProviderCompras");
  }
  return context;
}
