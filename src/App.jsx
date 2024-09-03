import React, { Fragment } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import InventoryManagement from './vistas/Inventario';
import Catalog from './vistas/catalogo';
import Home from './vistas/home';
import CarritoDeCompras from './vistas/Carrito';
import Cuenta from './vistas/cuenta';
import ProductDetail from './vistas/producto';  // Importa el componente de detalles del producto
import { CrudProvider } from './context/CrudContextInventario';  // Importa el proveedor del contexto



import './App.css';

function App() {
  return (
    <CrudProvider>
      <Fragment>
        <Router>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/inventario" element={<InventoryManagement />} />
            <Route path="/catalogo" element={<Catalog />} />
            <Route path="/cuenta" element={<Cuenta />} />
            <Route path="/carrito" element={<CarritoDeCompras />} />
            <Route path="/producto/:id" element={<ProductDetail />} />  {/* Ruta para detalles del producto */}
          </Routes>
        </Router>
      </Fragment>
    </CrudProvider>

  );
}

export default App;
