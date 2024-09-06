import React from 'react';
import { Outlet } from 'react-router-dom';
import AdminHeader from '../vistas/homeA';  // Verifica que la ruta sea correcta

const AdminLayout = () => {
  return (
    <div className="min-h-screen bg-gray-100">
      <AdminHeader />  {/* Solo debe renderizarse una vez */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Outlet />  {/* Aquí se renderiza el contenido de las rutas anidadas */}
      </main>
    </div>
  );
};

export default AdminLayout;
