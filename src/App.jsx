import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import InventoryManagement from './vistas/Inventario';
import Catalog from './vistas/catalogo';
import Home from './vistas/home';
import CarritoDeCompras from './vistas/Carrito';
import Cuenta from './vistas/cuenta';
import ProductDetail from './vistas/producto';
import AdminLayout from './context/adminLayout';  // Importa el componente AdminLayout
import { CrudProvider as CrudProviderInventario } from './context/CrudContextInventario';  
import { CrudProvider as CrudProviderForm } from './context/CrudContextForms';  
import Login from './vistas/login';
import Register from './vistas/register';
import ProtectedRoute from './context/protectedRoute';  // Importa el componente ProtectedRoute

import './App.css';

function App() {
  return (
    <CrudProviderForm>
      <CrudProviderInventario>
        <Router>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            
            {/* Ruta protegida para el Inventario */}
            <Route path="/inventario" element={
              <ProtectedRoute role="admin">
                <InventoryManagement />
              </ProtectedRoute>
            } />
            
            {/* Ruta protegida para el Dashboard de Administración */}
            <Route path="/admin/*" element={
  <ProtectedRoute role="admin">
    <AdminLayout />
  </ProtectedRoute>
}>
  <Route path="overview" element={<div>Vista General</div>} />
  <Route path="inventario" element={<InventoryManagement />} />
  <Route path="providers" element={<div>Proveedores</div>} />
  <Route path="orders" element={<div>Pedidos</div>} />
  <Route path="purchases" element={<div>Compras</div>} />
  <Route path="sales" element={<div>Ventas</div>} />
</Route>

            {/* Otras rutas */}
            <Route path="/catalogo" element={<Catalog />} />
            <Route path="/cuenta" element={<Cuenta />} />
            <Route path="/carrito" element={<CarritoDeCompras />} />
            <Route path="/producto/:id" element={<ProductDetail />} />
          </Routes>
        </Router>
      </CrudProviderInventario>
    </CrudProviderForm>
  );
}

export default App;
