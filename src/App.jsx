import React, { Fragment } from 'react';  // Asegúrate de importar Fragment
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import InventoryManagement from './vistas/Inventario';
import './App.css';

function App() {
  return (
    <Fragment>
      <Router>
        <Routes>
          <Route path="/inventario" element={<InventoryManagement />} />
        </Routes>
      </Router>
    </Fragment>
  );
}

export default App;
