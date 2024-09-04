import React, { Fragment } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import InventoryManagement from './vistas/Inventario';
import Catalog from './vistas/catalogo';
import Home from './vistas/home';
import CarritoDeCompras from './vistas/Carrito';
import Cuenta from './vistas/cuenta';
import ProductDetail from './vistas/producto';
import { CrudProvider as CrudProviderInventario } from './context/CrudContextInventario';  // Contexto para el inventario
import { CrudProvider as CrudProviderForm } from './context/CrudContextForms';  // Contexto para la autenticación
import Login from './vistas/login';
import Register from './vistas/register';

import './App.css';

function App() {
  return (
    <Fragment>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          
          <Route path="/login" element={
            <CrudProviderForm>
              <Login />
            </CrudProviderForm>
          } />
          
          <Route path="/register" element={
            <CrudProviderForm>
              <Register />
            </CrudProviderForm>
          } />
          
          <Route path="/inventario" element={
            <CrudProviderInventario>
              <InventoryManagement />
            </CrudProviderInventario>
          } />
          
          <Route path="/catalogo" element={<Catalog />} />
          <Route path="/cuenta" element={<Cuenta />} />
          <Route path="/carrito" element={<CarritoDeCompras />} />
          <Route path="/producto/:id" element={<ProductDetail />} />
        </Routes>
      </Router>
    </Fragment>
  );
}

export default App;
