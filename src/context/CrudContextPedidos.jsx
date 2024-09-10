import { createContext, useState, useEffect, useContext } from 'react';
import { helpHttp } from '../helpers/helpHttp';

// Crear el contexto
const CrudContextPedidos = createContext();

// Proveedor del contexto
export function CrudProviderPedidos({ children }) {
  const [db, setDb] = useState([]);
  const [dataToEdit, setDataToEdit] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const api = helpHttp();
  const url = 'http://localhost:3000/pedidos'; // URL del endpoint de pedidos

  useEffect(() => {
    setLoading(true);
    api.get(url).then((res) => {
      if (!res.err) {
        setDb(res);
        setError(null);
      } else {
        setDb([]);
        setError(res);
      }
      setLoading(false);
    });
  }, [api, url]); // Solo dependencias necesarias

  const createData = (data) => {
    const options = {
      body: data, // No es necesario usar JSON.stringify aquí, helpHttp lo maneja
      headers: { 'Content-Type': 'application/json' },
    };

    api.post(url, options).then((res) => {
      if (!res.err) {
        setDb((prevDb) => [...prevDb, res]);
      } else {
        setError(res);
      }
    });
  };

  const updateData = (data) => {
    const endpoint = `${url}/${data.id}`;
    const options = {
      body: data, // No es necesario usar JSON.stringify aquí, helpHttp lo maneja
      headers: { 'Content-Type': 'application/json' },
    };

    api.put(endpoint, options).then((res) => {
      if (!res.err) {
        const updatedDb = db.map((el) => (el.id === data.id ? res : el));
        setDb(updatedDb);
      } else {
        setError(res);
      }
    });
  };

  const deleteData = (id) => {
    const endpoint = `${url}/${id}`;
    const options = {
      headers: { 'Content-Type': 'application/json' },
    };

    api.del(endpoint, options).then((res) => {
      if (!res.err) {
        const updatedDb = db.filter((el) => el.id !== id);
        setDb(updatedDb);
      } else {
        setError(res);
      }
    });
  };

  // Proveer el contexto a los componentes hijos
  return (
    <CrudContextPedidos.Provider value={{ db, createData, updateData, deleteData, dataToEdit, setDataToEdit, error, loading }}>
      {children}
    </CrudContextPedidos.Provider>
  );
}

// Hook personalizado para usar el contexto
export const useCrudContextPedidos = () => useContext(CrudContextPedidos);

// Exportar el contexto para su uso en otros archivos
export default CrudContextPedidos;
