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
  Trash,
  ArrowLeft,
  Menu
} from "lucide-react";
import { useCrudContextForms } from "../context/CrudContextForms";
import { useCart } from "../context/CartContext";

export default function HeaderCliente() {
  const [searchTerm, setSearchTerm] = useState("");
  const [allProducts, setAllProducts] = useState([]);
  const [filteredSuggestions, setFilteredSuggestions] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const { currentUser, logoutUser } = useCrudContextForms();
  const { cart = [], updateQuantity, removeFromCart } = useCart();

  const navigate = useNavigate();
  const location = useLocation();

  const excludedPaths = ["/carrito", "/previa"];
  const isCartAccessible = !excludedPaths.some(path => location.pathname.startsWith(path));
  const isCatalogo = location.pathname === "/catalogo";
  const isHomeCli = location.pathname === "/homecli";

  useEffect(() => {
    fetch("https://cyber-copias-prueba1.onrender.com//api/products")
      .then(response => response.json())
      .then(data => {
        setAllProducts(data);
      })
      .catch(error => {
        console.error("Error fetching products:", error);
      });
  }, []);

  useEffect(() => {
    if (searchTerm.length > 0) {
      const filtered = allProducts.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredSuggestions(filtered);
    } else {
      setFilteredSuggestions([]);
    }
  }, [searchTerm, allProducts]);

  const handleProductClick = (product) => {
    navigate(`/producto/${product._id}`);
    setFilteredSuggestions([]);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    console.log("Searching for:", searchTerm);
  };

  const toggleCart = () => {
    setIsCartOpen(!isCartOpen);
  };

  const handleAccountClick = () => {
    navigate('/cuenta');
  };

  const handlePedidosClick = () => {
    navigate('/cuenta?section=pedidos');
  };

  const handleQuantityChange = (productId, newQuantity) => {
    const product = allProducts.find(p => p._id === productId);
  
    if (product) {
      if (newQuantity <= product.stock && newQuantity >= 1) {
        updateQuantity(productId, newQuantity);
      }
    } else {
      console.error("Producto no encontrado");
    }
  };

  const subtotal = cart.reduce((total, item) => total + (parseFloat(item.price) || 0) * item.quantity, 0);

  const handleLogoutClick = () => {
    setShowModal(true);
  };

  const handleConfirmLogout = () => {
    logoutUser();
    setShowModal(false);
    navigate('/login');
  };

  const handleCancelLogout = () => {
    setShowModal(false);
  };

  const handleContinueShopping = () => {
    if (cart.length === 0) {
      alert("El carrito está vacío. Añade productos para continuar la compra.");
    } else {
      navigate("/previa");
    }
  };

  const handleBackClick = () => {
    navigate(-1);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  useEffect(() => {
    if (!isCartAccessible && isCartOpen) {
      setIsCartOpen(false);
    }
  }, [location.pathname, isCartAccessible, isCartOpen]);

  return (
    <>
      <header className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-4">
            <div className="flex items-center">
              {!isHomeCli && (
                <button onClick={handleBackClick} className="mr-4 text-gray-600 hover:text-primary">
                  <ArrowLeft className="h-6 w-6" />
                </button>
              )}
              <Link to="/homecli" className="text-xl font-bold text-primary">CyberCopias</Link>
            </div>

            <div className="hidden md:block flex-1 max-w-md mx-4">
              {isCatalogo ? (
                <h2 className="text-lg font-semibold text-gray-700">Explora nuestro catálogo</h2>
              ) : (
                <form onSubmit={handleSearch} className="relative">
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
                </form>
              )}
            </div>

            <nav className="hidden md:flex items-center space-x-6">
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
              <button onClick={handleAccountClick} className="flex flex-col items-center hover:text-primary">
                <User className="h-5 w-5" />
                <span className="text-xs mt-1">Cuenta</span>
              </button>
              <button onClick={handleLogoutClick} className="flex flex-col items-center hover:text-primary">
                <LogOut className="h-5 w-5" />
                <span className="text-xs mt-1">Salir</span>
              </button>
            </nav>

            <button onClick={toggleMobileMenu} className="md:hidden text-gray-600 hover:text-primary">
              <Menu className="h-6 w-6" />
            </button>
          </div>

          {/* Mobile Menu */}
          {isMobileMenuOpen && (
            <div className="md:hidden py-4">
              <form onSubmit={handleSearch} className="mb-4">
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
              <nav className="flex flex-col space-y-4">
                <Link to="/catalogo" className="flex items-center hover:text-primary">
                  <Book className="h-5 w-5 mr-2" />
                  <span>Catálogo</span>
                </Link>
                <button onClick={handlePedidosClick} className="flex items-center hover:text-primary">
                  <Package className="h-5 w-5 mr-2" />
                  <span>Pedidos</span>
                </button>
                {isCartAccessible && (
                  <button onClick={toggleCart} className="flex items-center hover:text-primary relative">
                    <ShoppingCart className="h-5 w-5 mr-2" />
                    <span>Carrito</span>
                    {cart.length > 0 && (
                      <span className="absolute top-0 -right-2 bg-primary text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                        {cart.length}
                      </span>
                    )}
                  </button>
                )}
                <button onClick={handleAccountClick} className="flex items-center hover:text-primary">
                  <User className="h-5 w-5 mr-2" />
                  <span>Cuenta</span>
                </button>
                <button onClick={handleLogoutClick} className="flex items-center hover:text-primary">
                  <LogOut className="h-5 w-5 mr-2" />
                  <span>Salir</span>
                </button>
              </nav>
            </div>
          )}
        </div>
      </header>

      {/* Logout Modal */}
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

      {/* Cart Sidebar */}
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
                  <li key={item._id} className="flex items-center justify-between py-2 border-b">
                    <div className="flex items-center space-x-4">
                      <img src={item.imageUrl[0]} alt={item.name} className="w-16 h-16 object-cover" />
                      <div>
                        <p className="font-medium">{item.name}</p>
                        <p className="text-sm text-gray-500">${(parseFloat(item.price) || 0).toFixed(2)}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button 
                        onClick={() => handleQuantityChange(item._id, item.quantity - 1)} 
                        className={`text-gray-500 hover:text-gray-700 ${item.quantity === 1 ? 'cursor-not-allowed opacity-50' : ''}`}
                        disabled={item.quantity === 1}
                        aria-disabled={item.quantity === 1}
                      >
                        <Minus className="h-4 w-4" />
                      </button>
                      <span className="text-sm">{item.quantity}</span>
                      <button 
                        onClick={() => handleQuantityChange(item._id, item.quantity + 1)}
                        className="text-gray-500 hover:text-gray-700"
                        disabled={item.quantity >= item.stock}
                      >
                        <Plus className="h-4 w-4" />
                      </button>
                      <button 
                        onClick={() => removeFromCart(item._id)} 
                        className="text-gray-500 hover:text-red-500 ml-2" 
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
            <div className="flex justify-between items-center mb-4">
              <span className="text-lg font-semibold">Subtotal:</span>
              <span className="text-lg font-semibold">${subtotal.toFixed(2)}</span>
            </div>
            <button 
              onClick={handleContinueShopping} 
              className={`bg-primary text-white w-full py-2 rounded ${cart.length === 0 ? 'opacity-50 cursor-not-allowed' : 
              'hover:bg-blue-600'}`}
              disabled={cart.length === 0}
            >
              Continuar a la Compra
            </button>
          </div>
        </div>
      </div>
    </>
  );
}