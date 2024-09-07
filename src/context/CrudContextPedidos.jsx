import { createContext, useEffect, useState } from "react";
import { helpHttp } from "../helpers/helpHttp";

const CrudContextPedidos = createContext();

const CrudProviderPedidos = ({ children }) => {
  const [db, setDb] = useState([]); // Base de datos inicial
  const [dataToEdit, setDataToEdit] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  let api = helpHttp();
  let url = "http://localhost:3000/pedidos"; // URL de la API de pedidos

  useEffect(() => {
    setLoading(true);
    api.get(url).then((res) => {
      if (!res.err) {
        // Asegúrate de que los IDs estén en formato de cadena
        const updatedData = res.map((item) => ({
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
    });
  }, [url]);

  const createData = (data) => {
    // Asegúrate de que el ID sea una cadena al crear el nuevo registro
    const newData = {
      ...data,
      id: Date.now().toString(), // Convertir el ID a cadena
    };

    let options = {
      body: newData,
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
    let endpoint = `${url}/${data.id}`;
  
    let options = {
      body: data,
      headers: { "content-type": "application/json" },
    };

    api.put(endpoint, options).then((res) => {
      if (!res.err) {
        let newData = db.map((el) => (el.id === data.id ? res : el));
        setDb(newData);
      } else {
        setError(res);
      }
    });
  };

  const deleteData = (id) => {
    let endpoint = `${url}/${id}`;
    let options = {
      headers: { "content-type": "application/json" },
    };

    api.del(endpoint, options).then((res) => {
      if (!res.err) {
        let newData = db.filter((el) => el.id !== id);
        setDb(newData);
      } else {
        setError(res);
      }
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
    <CrudContextPedidos.Provider value={data}>
      {children}
    </CrudContextPedidos.Provider>
  );
};

export { CrudProviderPedidos };
export default CrudContextPedidos;
