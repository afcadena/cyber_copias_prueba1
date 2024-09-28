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
    const fetchData = async () => {
      setLoading(true);
      const res = await api.get(url);
      if (!res.err) {
        setDb(res);
        setError(null);
      } else {
        setDb([]); // Limpiar la base de datos en caso de error
        setError(res);
      }
      setLoading(false);
    };

    fetchData(); // Llamar a la función para obtener datos

  }, [url]); // Solo la URL como dependencia necesaria

  const createData = (data) => {
    const options = {
      body: data,
      headers: { 'Content-Type': 'application/json' },
    };

    api.post(url, options).then((res) => {
      if (!res.err) {
        setDb((prevDb) => [...prevDb, res]); // Actualizar el estado de manera segura
      } else {
        setError(res);
      }
    });
  };

  const updateData = (data) => {
    const endpoint = `${url}/${data.id}`;
    const options = {
      body: data,
      headers: { 'Content-Type': 'application/json' },
    };

    api.put(endpoint, options).then((res) => {
      if (!res.err) {
        setDb((prevDb) => prevDb.map((el) => (el.id === data.id ? res : el))); // Actualizar el estado de manera segura
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
        setDb((prevDb) => prevDb.filter((el) => el.id !== id)); // Actualizar el estado de manera segura
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
