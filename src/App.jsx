import React, { Fragment } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import InventoryManagement from './vistas/Inventario';
import Catalog from './vistas/catalogo';
import Home from './vistas/home';
import CarritoDeCompras from './vistas/Carrito';
import Cuenta from './vistas/cuenta';
import ProductDetail from './vistas/producto';
import { CrudProvider as CrudProviderInventario } from './context/CrudContextInventario';  
import { CrudProvider as CrudProviderForm } from './context/CrudContextForms';  
import Login from './vistas/login';
import Register from './vistas/register';
import ProtectedRoute from './context/protectedRoute';  // Importamos el componente ProtectedRoute
import HomeCliente from  './vistas/homecli';


import './App.css';

function App() {
  return (
    <Fragment>
      {/* Envuelve toda la aplicación con CrudProviderForm para que el contexto esté disponible */}
      <CrudProviderForm>
        <Router>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            
            {/* Protege la ruta de inventario */}
            <Route path="/inventario" element={
              <CrudProviderInventario>
                <ProtectedRoute role="admin">
                  <InventoryManagement />
                </ProtectedRoute>
              </CrudProviderInventario>
            } />
            
            <Route path="/catalogo" element={<Catalog />} />
            <Route path="/cuenta" element={<Cuenta />} />
            <Route path="/carrito" element={<CarritoDeCompras />} />
            <Route path="/producto/:id" element={<ProductDetail />} />  {/* Asegúrate de que la ruta sea la correcta */}
            <Route path="/homecli" element={<HomeCliente />} />

          </Routes>
        </Router>
      </CrudProviderForm>
    </Fragment>
  );
}

export default App;
