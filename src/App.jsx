import React, { Fragment } from 'react';  // Asegúrate de importar Fragment
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import InventoryManagement from './vistas/Inventario';
import Catalog from './vistas/catalogo';
import Home from './vistas/home';
import Carrito from  './vistas/Carrito';
import Cuenta from './vistas/cuenta';
import Header from './vistas/header';

import './App.css';

function App() {
  return (
    <Fragment>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/inventario" element={<InventoryManagement />} />
          <Route path="/catalogo" element={<Catalog />} />
          <Route path="/carrito" element={<Carrito />} />
          <Route path="/cuenta" element={<Cuenta />} />
          <Route path="/header" element={<Header />} />
        </Routes>
      </Router>
    </Fragment>
  );
}

export default App;
