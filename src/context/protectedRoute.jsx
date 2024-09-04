import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { CrudContextForm } from './CrudContextForms'; // Asegúrate de importar correctamente el contexto

const ProtectedRoute = ({ children, role }) => {
  const { currentUser } = useContext(CrudContextForm);

  if (!currentUser) {
    return <Navigate to="/login" />;
  }

  if (currentUser.role !== role) {
    return <Navigate to="/" />;
  }

  return children;
};

export default ProtectedRoute;
