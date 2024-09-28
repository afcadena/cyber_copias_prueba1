import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { 
  ShoppingCart, 
  Book, 
  User, 
  Package, 
  Heart, 
  Search, 
  X, 
  Minus, 
  Plus, 
  LogOut, 
  Trash 
} from "lucide-react";
import { useCrudContextForms } from "../context/CrudContextForms";
import { useCart } from "../context/CartContext";

export default function HeaderCliente() {
  const [searchTerm, setSearchTerm] = useState("");
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [showModal, setShowModal] = useState(false);
  
  const { currentUser, logoutUser } = useCrudContextForms();
  const { cart = [], updateQuantity, removeFromCart } = useCart();
  
  const navigate = useNavigate();
  const location = useLocation();

  // Definir las rutas donde el carrito no debe ser accesible
  const excludedPaths = ["/carrito", "/previa"];
  const isCartAccessible = !excludedPaths.some(path => location.pathname.startsWith(path));

  const handleSearch = (e) => {
    e.preventDefault();
    console.log("Searching for:", searchTerm);
    // Aquí puedes agregar la lógica para redirigir o buscar según el término.
  };

  const toggleCart = () => {
    setIsCartOpen(!isCartOpen);
  };

  const handleAccountClick = () => {
    if (currentUser) {
      navigate('/cuenta'); // Redirige a la cuenta si hay usuario
    } else {
      navigate('/login'); // Redirige a la página de login si no hay usuario
    }
  };

  // Modificación: Redirige a la página de cuenta mostrando la sección "Pedidos"
  const handlePedidosClick = () => {
    navigate('/cuenta?section=pedidos'); // Redirige a la cuenta directamente a la sección de pedidos
  };

  const handleQuantityChange = (productId, newQuantity) => {
    if (newQuantity >= 1) { // Aseguramos que la cantidad no sea menor que 1
      updateQuantity(productId, newQuantity);
    }
    // No hacemos nada si newQuantity < 1, evitando así la eliminación del producto
  };

  const subtotal = cart.reduce((total, item) => total + (parseFloat(item.price) || 0) * item.quantity, 0);

  const handleLogoutClick = () => {
    setShowModal(true);
  };

  const handleConfirmLogout = () => {
    logoutUser();
    setShowModal(false);
    navigate('/login'); // Opcional: Redirige al usuario a la página de login
  };

  const handleCancelLogout = () => {
    setShowModal(false);
  };

  // Efecto para cerrar el carrito al navegar a una ruta excluida
  useEffect(() => {
    if (!isCartAccessible && isCartOpen) {
      setIsCartOpen(false);
    }
  }, [location.pathname, isCartAccessible, isCartOpen]);

  return (
    <>
      <header className="flex items-center justify-between px-4 py-2 bg-white shadow-md">
        <div className="flex items-center">
          <Link to="/homecli" className="text-xl font-bold text-primary">CyberCopias</Link>
        </div>

        <form onSubmit={handleSearch} className="flex-1 max-w-md mx-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Buscar productos..."
              className="w-full py-2 pl-10 pr-4 text-gray-700 bg-white border rounded-full focus:outline-none focus:border-primary"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button type="submit" className="absolute inset-y-0 left-0 flex items-center pl-3">
              <Search className="w-5 h-5 text-gray-400" />
            </button>
          </div>
        </form>

        <nav className="flex items-center space-x-6">
          <Link to="/catalogo" className="flex flex-col items-center hover:text-primary">
            <Book className="h-5 w-5" />
            <span className="text-xs mt-1">Catálogo</span>
          </Link>
          <button onClick={handlePedidosClick} className="flex flex-col items-center hover:text-primary">
            <Package className="h-5 w-5" />
            <span className="text-xs mt-1">Pedidos</span>
          </button>
          {isCartAccessible && (
            <button onClick={toggleCart} className="flex flex-col items-center hover:text-primary relative">
              <ShoppingCart className="h-5 w-5" />
              <span className="text-xs mt-1">Carrito</span>
              {cart.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-primary text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                  {cart.length}
                </span>
              )}
            </button>
          )}
          <Link to="/favoritos" className="flex flex-col items-center hover:text-primary">
            <Heart className="h-5 w-5" />
            <span className="text-xs mt-1">Favoritos</span>
          </Link>
          <button onClick={handleAccountClick} className="flex flex-col items-center hover:text-primary">
            <User className="h-5 w-5" />
            <span className="text-xs mt-1">Cuenta</span>
          </button>
          <button onClick={handleLogoutClick} className="flex flex-col items-center hover:text-primary">
            <LogOut className="h-5 w-5" />
            <span className="text-xs mt-1">Salir</span>
          </button>
        </nav>
      </header>

      {/* Modal de confirmación de cierre de sesión */}
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

      {/* Sidebar del carrito */}
      <div className={`fixed inset-y-0 right-0 w-96 bg-white shadow-xl transform ${isCartOpen ? 'translate-x-0' : 'translate-x-full'} transition-transform duration-300 ease-in-out z-50`}>
        <div className="flex flex-col h-full">
          <div className="flex justify-between items-center p-4 border-b">
            <h2 className="text-lg font-semibold">Carrito</h2>
            <button onClick={toggleCart} className="text-gray-500 hover:text-gray-700">
              <X className="h-6 w-6" />
            </button>
          </div>
          <div className="flex-grow overflow-y-auto p-4">
            {cart.length === 0 ? (
              <p>El carrito está vacío</p>
            ) : (
              <ul className="space-y-4">
                {cart.map((item) => (
                  <li key={item.id} className="flex items-center justify-between py-2 border-b">
                    <div className="flex items-center space-x-4">
                      <img src={item.imageUrl} alt={item.name} className="w-16 h-16 object-cover" />
                      <div>
                        <p className="font-medium">{item.name}</p>
                        <p className="text-sm text-gray-500">${(parseFloat(item.price) || 0).toFixed(2)}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button 
                        onClick={() => handleQuantityChange(item.id, item.quantity - 1)} 
                        className={`text-gray-500 hover:text-gray-700 ${item.quantity === 1 ? 'cursor-not-allowed opacity-50' : ''}`}
                        disabled={item.quantity === 1} 
                        aria-disabled={item.quantity === 1} 
                      >
                        <Minus className="h-4 w-4" />
                      </button>
                      <span className="text-sm">{item.quantity}</span>
                      <button 
                        onClick={() => handleQuantityChange(item.id, item.quantity + 1)} 
                        className="text-gray-500 hover:text-gray-700"
                      >
                        <Plus className="h-4 w-4" />
                      </button>
                      {/* Botón de Eliminación */}
                      <button 
                        onClick={() => removeFromCart(item.id)} 
                        className="text-red-500 hover:text-red-700 ml-2" 
                        aria-label={`Eliminar ${item.name} del carrito`}
                      >
                        <Trash className="h-4 w-4" />
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
          <div className="p-4 border-t">
            <h3 className="text-lg font-semibold">Subtotal: ${subtotal.toFixed(2)}</h3>
            <button 
              onClick={() => navigate('/checkout')} 
              className="w-full bg-primary text-white py-2 rounded mt-2 hover:bg-primary-dark"
            >
              Proceder a la compra
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
