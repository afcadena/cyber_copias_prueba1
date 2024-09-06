import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import InventoryManagement from './vistas/Inventario';
import Catalog from './vistas/catalogo';
import Home from './vistas/home';
import CarritoDeCompras from './vistas/Carrito';
import Cuenta from './vistas/cuenta';
import ProductDetail from './vistas/producto';
import AdminLayout from './context/adminLayout';
import { CrudProvider as CrudProviderInventario } from './context/CrudContextInventario';
import { CrudProvider as CrudProviderForm } from './context/CrudContextForms';
import Login from './vistas/login';
import Register from './vistas/register';
<<<<<<< HEAD
import ProtectedRoute from './context/protectedRoute';  // Importamos el componente ProtectedRoute
import HomeCliente from  './vistas/homecli';

=======
import ProtectedRoute from './context/protectedRoute';
import { CartProvider } from './context/CartContext';  // Importa el CartProvider
>>>>>>> 38de9a26ee00e0ad0791a7d32fb786f97dc0dc02

import './App.css';

function App() {
  return (
    <CrudProviderForm>
      <CrudProviderInventario>
        <CartProvider>
          <Router>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/inventario" element={
                <ProtectedRoute role="admin">
                  <InventoryManagement />
                </ProtectedRoute>
<<<<<<< HEAD
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
=======
              } />
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
              <Route path="/catalogo" element={<Catalog />} />
              <Route path="/cuenta" element={<Cuenta />} />
              <Route path="/carrito" element={<CarritoDeCompras />} />
              <Route path="/producto/:id" element={<ProductDetail />} />
            </Routes>
          </Router>
        </CartProvider>
      </CrudProviderInventario>
    </CrudProviderForm>
>>>>>>> 38de9a26ee00e0ad0791a7d32fb786f97dc0dc02
  );
}

export default App;
