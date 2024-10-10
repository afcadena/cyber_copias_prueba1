import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Search, X, ShoppingCart, Book, User, Heart, Minus, Plus, Trash } from "lucide-react";
import { useCrudContextForms } from "../context/CrudContextForms";
import { useCart } from "../context/CartContext";

export default function Header() {
  const [searchTerm, setSearchTerm] = useState("");
  const [allProducts, setAllProducts] = useState([]);
  const [filteredSuggestions, setFilteredSuggestions] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  const { currentUser } = useCrudContextForms();
  const { cart = [], updateQuantity, removeFromCart } = useCart();

  const navigate = useNavigate();
  const location = useLocation();

  const excludedPaths = ["/carrito", "/previa"];
  const isCartAccessible = !excludedPaths.some(path => location.pathname.startsWith(path));

  const isCatalogo = location.pathname === "/catalogo";

  useEffect(() => {
    fetch("http://localhost:3000/products")
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
    navigate(`/producto/${product.id}`);
    setFilteredSuggestions([]);
  };

  const handleSearch = (e) => {
    e.preventDefault();
  };

  const toggleCart = () => {
    setIsCartOpen(!isCartOpen);
  };

  const handleAccountClick = () => {
    if (currentUser) {
      navigate('/cuenta');
    } else {
      navigate('/login');
    }
  };

  const handleQuantityChange = (productId, newQuantity) => {
    const product = allProducts.find(p => p.id === productId);
  
    if (product) {
      if (newQuantity <= product.stock && newQuantity >= 1) {
        updateQuantity(productId, newQuantity);
      }
    } else {
      console.error("Producto no encontrado");
    }
  };

  const subtotal = cart.reduce((total, item) => total + (parseFloat(item.price) || 0) * item.quantity, 0);

  useEffect(() => {
    if (!isCartAccessible && isCartOpen) {
      setIsCartOpen(false);
    }
  }, [location.pathname, isCartAccessible, isCartOpen]);

  const handleContinueShopping = () => {
    if (cart.length === 0) {
      alert("El carrito está vacío. Añade productos para continuar la compra.");
    } else {
      navigate("/previa");
    }
  };

  return (
    <>
      <header className="flex items-center justify-between px-4 py-2 bg-white shadow-md">
        <Link to="/" className="text-xl font-bold text-primary">CyberCopias</Link>
        
        {isCatalogo ? (
          <div className="flex-1 max-w-md mx-4 flex items-center justify-center">
            <h2 className="text-lg font-semibold text-gray-700">Explora nuestro catálogo</h2>
          </div>
        ) : (
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
              
              {filteredSuggestions.length > 0 && (
                <ul className="absolute z-10 w-full bg-white border border-gray-200 rounded-lg mt-2 max-h-48 overflow-y-auto">
                  {filteredSuggestions.map((product) => (
                    <li 
                      key={product.id} 
                      className="p-2 hover:bg-gray-100 cursor-pointer"
                      onClick={() => handleProductClick(product)}
                    >
                      {product.name}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </form>
        )}
        
        <nav className="flex items-center space-x-6">
          <Link to="/catalogo" className="flex flex-col items-center hover:text-primary">
            <Book className="h-5 w-5" />
            <span className="text-xs mt-1">Catálogo</span>
          </Link>
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
        </nav>
      </header>

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
                      <img src={item.imageUrl[0]} alt={item.name} className="w-16 h-16 object-cover" />
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
                        disabled={item.quantity >= item.stock}
                      >
                        <Plus className="h-4 w-4" />
                      </button>
                      <button 
                        onClick={() => removeFromCart(item.id)} 
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
              className={`bg-primary text-white w-full py-2 rounded ${cart.length === 0 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-600'}`}
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