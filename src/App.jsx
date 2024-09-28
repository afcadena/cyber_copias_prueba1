import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Catalog from './vistas/catalogo';
import Home from './vistas/home';
import CarritoDeCompras from './vistas/Carrito';
import Cuenta from './vistas/cuenta';
import { CuentaProvider } from './vistas/cuenta';
import ProductDetail from './vistas/producto';
import AdminLayout from './context/adminLayout';
import { CrudProvider as CrudProviderInventario } from './context/CrudContextInventario';
import { CrudProvider as CrudProviderForm } from './context/CrudContextForms';
import Login from './vistas/login';
import Register from './vistas/register';
import ProtectedRoute from './context/protectedRoute';
import HomeCliente from './vistas/homecli';
import { CartProvider } from './context/CartContext';
// Importar las nuevas vistas para administración
import InventoryManagement from './vistas/Inventario';
import GestionPedidos from './vistas/Pedidos';
import GestionProveedores from './vistas/Proveedores';
import GestionVentas from './vistas/Ventas';
import GestionCompras from './vistas/Compras'; // Nueva vista
import CartPreview from './vistas/previa_compra';

// Importar los proveedores de contexto
import { CrudProviderProveedores } from './context/CrudContextProveedores';
import { CrudProviderPedidos } from './context/CrudContextPedidos';
import { CrudProviderCompras } from './context/CrudContextCompras'; // Importar el proveedor de compras
import { CrudProviderVentas } from './context/CrudContextVentas'; // Importar el proveedor de ventas

import './App.css';

function App() {
  return (
    <Router>
      <CrudProviderForm>
        <CrudProviderInventario>
          <CrudProviderPedidos>
            <CartProvider>
              <CrudProviderProveedores>
                <CrudProviderCompras>
                  <CrudProviderVentas>
                    <Routes>
                      {/* Rutas públicas */}
                      <Route path="/" element={<Home />} />
                      <Route path="/login" element={<Login />} />
                      <Route path="/register" element={<Register />} />
                      <Route path="/catalogo" element={<Catalog />} />
                      <Route path="/carrito" element={<CarritoDeCompras />} />
                      <Route path="/previa" element={< CartPreview/>} />
                      <Route path="/producto/:id" element={<ProductDetail />} />

                      {/* Rutas protegidas del cliente */}
                      <Route path="/homecli" element={
                        <ProtectedRoute role="cliente">
                          <HomeCliente />
                        </ProtectedRoute>
                      } />

                      {/* Rutas protegidas del admin */}
                      <Route path="/admin" element={
                        <ProtectedRoute role="admin">
                          <AdminLayout /> {/* AdminLayout maneja todas las rutas de administración */}
                        </ProtectedRoute>
                      }>
                        <Route path="inventario" element={<InventoryManagement />} />
                        <Route path="providers" element={<GestionProveedores />} />
                        <Route path="orders" element={<GestionPedidos />} />  {/* Pedidos */}
                        <Route path="purchases" element={<GestionCompras />} /> {/* Compras */}
                        <Route path="sales" element={<GestionVentas />} />  {/* Ventas */}
                      </Route>

                      {/* Ruta protegida de cuenta */}
                      <Route path="/cuenta" element={
                        <CuentaProvider>
                          <Cuenta />
                        </CuentaProvider>
                      } />
                    </Routes>
                  </CrudProviderVentas>
                </CrudProviderCompras>
              </CrudProviderProveedores>
            </CartProvider>
          </CrudProviderPedidos>
        </CrudProviderInventario>
      </CrudProviderForm>
    </Router>
  );
}

export default App;
