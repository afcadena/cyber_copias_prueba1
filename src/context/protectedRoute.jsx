import React from 'react';
import { Navigate } from 'react-router-dom';
import { useCrudContextForms } from "../context/CrudContextForms"; // Importar el hook correctamente

const ProtectedRoute = ({ children, role }) => {
  const { currentUser } = useCrudContextForms(); // Usar el hook para obtener el contexto

  if (!currentUser) {
    return <Navigate to="/login" />;
  }

  if (currentUser.role !== role) {
    return <Navigate to="/" />;
  }

  return children;
};

export default ProtectedRoute;
