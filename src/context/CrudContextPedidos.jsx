import { createContext, useState, useEffect, useContext } from 'react';
import API from '../api/api'; // Usamos la instancia de Axios

// Crear el contexto
const CrudContextPedidos = createContext();

// Proveedor del contexto
export function CrudProviderPedidos({ children }) {
  const [db, setDb] = useState([]);
  const [dataToEdit, setDataToEdit] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const url = '/pedidos'; // URL base de la API de pedidos

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const res = await API.get(url);
        setDb(res.data); // Axios almacena los datos en res.data
        setError(null);
      } catch (error) {
        setDb([]); // Limpiar db en caso de error
        setError(error.response ? error.response.data : error.message);
      }
      setLoading(false);
    };

    fetchData(); // Llamar a la función para obtener los datos
  }, [url]);

  const createData = async (data) => {
    try {
      const pedidoData = {
        userId: data.userId, // ID del usuario
        email: data.email, // Email del cliente
        total: data.total, // Total del pedido
        products: data.products, // Array de productos
        direccion: data.direccion, // Dirección de envío
        casa: data.casa, // Casa de envío
        telefono: data.telefono, // Teléfono de contacto
        state: data.state, // Estado de envío
      };
  
      const res = await API.post(url, pedidoData); // Crear nuevo pedido
      setDb((prevDb) => [...prevDb, res.data]); // Actualizar db con el nuevo pedido
    } catch (error) {
      console.error('Error al crear el pedido:', error.response ? error.response.data : error.message); // Log del error detallado
      setError(error.response ? error.response.data : error.message);
    }
  };
  

  const updateData = async (data) => {
    const endpoint = `${url}/${data._id}`; // MongoDB usa _id en lugar de id
    try {
      const res = await API.put(endpoint, data); // Actualizar el pedido
      setDb((prevDb) => prevDb.map((el) => (el._id === data._id ? res.data : el)));
    } catch (error) {
      setError(error.response ? error.response.data : error.message);
    }
  };

  const deleteData = async (id) => {
    const endpoint = `${url}/${id}`;
    try {
      await API.delete(endpoint); // Eliminar pedido
      setDb((prevDb) => prevDb.filter((el) => el._id !== id)); // Actualizar db después de eliminar
    } catch (error) {
      setError(error.response ? error.response.data : error.message);
    }
  };

  return (
    <CrudContextPedidos.Provider value={{ db, createData, updateData, deleteData, dataToEdit, setDataToEdit, error, loading }}>
      {children}
    </CrudContextPedidos.Provider>
  );
}

// Hook personalizado para usar el contexto
export const useCrudContextPedidos = () => useContext(CrudContextPedidos);

export default CrudContextPedidos;
