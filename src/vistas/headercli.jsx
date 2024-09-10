import React, { useState } from "react";
import { Link } from "react-router-dom";
import { ShoppingCart, Grid, User, LogOut } from "lucide-react";
import Logo from "../assets/images/Logo.png";
import { useCrudContextForms } from "../context/CrudContextForms";

export default function Header() {
  // Utiliza el hook directamente para obtener el contexto
  const { logoutUser } = useCrudContextForms();
  const [showModal, setShowModal] = useState(false);

  const handleLogoutClick = () => {
    setShowModal(true);
  };

  const handleConfirmLogout = () => {
    logoutUser();
    setShowModal(false);
  };

  const handleCancelLogout = () => {
    setShowModal(false);
  };

  return (
    <>
      <header className="flex items-center justify-between p-4 bg-background shadow-md">
        <div className="flex items-center">
          <img src={Logo} alt="Logo" className="w-10 h-10 mr-2" />
          <Link to="/home" className="text-xl font-bold">
            CyberCopias
          </Link>
        </div>
        <nav className="flex items-center space-x-4">
          <Link to="/catalogo" className="text-foreground hover:text-primary">
            <Grid className="h-6 w-6" />
          </Link>
          <Link to="/cuenta" className="text-foreground hover:text-primary">
            <User className="h-6 w-6" />
          </Link>
          <Link to="/carrito" className="text-foreground hover:text-primary">
            <ShoppingCart className="h-6 w-6" />
          </Link>
          <Link to="#" onClick={handleLogoutClick} className="text-foreground hover:text-primary">
            <LogOut className="h-6 w-6" />
          </Link>
        </nav>
      </header>

      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-75 z-50">
          <div className="bg-white p-6 rounded shadow-lg max-w-sm mx-auto z-50">
            <h2 className="text-lg font-semibold mb-4">Confirmar Cierre de Sesión</h2>
            <p className="mb-4">¿Estás seguro de que quieres cerrar sesión?</p>
            <div className="flex justify-end space-x-4">
              <button
                onClick={handleConfirmLogout}
                className="bg-red-500 text-white px-4 py-2 rounded"
              >
                Confirmar
              </button>
              <button
                onClick={handleCancelLogout}
                className="bg-gray-300 text-black px-4 py-2 rounded"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
