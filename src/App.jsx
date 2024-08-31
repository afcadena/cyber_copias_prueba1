import React, { Fragment } from 'react';  // Asegúrate de importar Fragment
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import InventoryManagement from './vistas/Inventario';
import Catalog from './vistas/catalogo';
import './App.css';

function App() {
  return (
    <Fragment>
      <Router>
        <Routes>
          <Route path="/inventario" element={<InventoryManagement />} />
          <Route path="/catalogo" element={<Catalog />} />
        </Routes>
      </Router>
    </Fragment>
  );
}

export default App;
