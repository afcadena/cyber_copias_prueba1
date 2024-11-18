// src/context/CrudContextVentas.js

import { createContext, useState, useEffect, useContext } from 'react';
import API from '../api/api'; // Importar la instancia de API

// Crear el contexto
const CrudContextVentas = createContext();

// Proveedor del contexto
export function CrudProviderVentas({ children }) {
  const [db, setDb] = useState([]);
  const [dataToEdit, setDataToEdit] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await API.get('/ventas');
        setDb(response.data);
      } catch (error) {
        setError(error);
        setDb([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const createData = async (data) => {
    try {
      const response = await API.post('/ventas', data);
      setDb((prevDb) => [...prevDb, response.data]);
    } catch (error) {
      setError(error);
    }
  };

  const updateData = async (data) => {
    const endpoint = `/ventas/${data.id}`;
    try {
      const response = await API.put(endpoint, data);
      const updatedDb = db.map((el) => (el.id === data.id ? response.data : el));
      setDb(updatedDb);
    } catch (error) {
      setError(error);
    }
  };

  const deleteData = async (id) => {
    try {
      const response = await fetch(`https://cyber-copias-final.onrender.com/api/ventas/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error('Error al eliminar la venta');
      }
      // Actualiza el estado para eliminar la venta de la lista localmente si es necesario
      console.log(`Venta con ID ${id} eliminada con éxito.`);
    } catch (error) {
      console.error('Error al eliminar la venta:', error);
    }
  };
  
  // Proveer el contexto a los componentes hijos
  return (
    <CrudContextVentas.Provider value={{ db, createData, updateData, deleteData, dataToEdit, setDataToEdit, error, loading }}>
      {children}
    </CrudContextVentas.Provider>
  );
}

// Hook personalizado para usar el contexto
export const useCrudContextVentas = () => useContext(CrudContextVentas);

// Exportar el contexto para su uso en otros archivos
export default CrudContextVentas;
