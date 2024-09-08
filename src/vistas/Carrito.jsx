import React, { useState, useEffect } from "react";
import Header from "./header";
import Footer from "./footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useCart } from "../context/CartContext"; // Importar el contexto del carrito
import { XIcon } from 'lucide-react'; // Ícono de "X" para eliminar
import { useNavigate } from "react-router-dom"; // Usar useNavigate de react-router-dom

export default function CarritoDeCompras() {
  const { cart, removeFromCart } = useCart(); // Obtener el carrito y la función para eliminar productos
  const [quantities, setQuantities] = useState(() => {
    const initialQuantities = {};
    cart.forEach(product => {
      initialQuantities[product.id] = 1; // Inicialmente, cantidad = 1 para todos los productos
    });
    return initialQuantities;
  });
  const [isAuthenticated, setIsAuthenticated] = useState(false); // Estado de autenticación
  const [isOpen, setIsOpen] = useState(false); // Estado para el modal
  const navigate = useNavigate(); // Hook de react-router-dom para redireccionar

  // Verificar el estado de autenticación al montar el componente y cuando cambie el carrito
  useEffect(() => {
    const userLoggedIn = Boolean(localStorage.getItem("user")); // Verificar si hay usuario en el localStorage
    setIsAuthenticated(userLoggedIn);
  }, [cart]); // Añadir 'cart' como dependencia

  const handleQuantityChange = (productId, newQuantity) => {
    setQuantities(prev => ({
      ...prev,
      [productId]: newQuantity < 1 ? 1 : newQuantity // La cantidad mínima es 1
    }));
  };

  const handleRemoveFromCart = (productId) => {
    removeFromCart(productId);
    setQuantities(prev => {
      const newQuantities = { ...prev };
      delete newQuantities[productId]; // Eliminar la cantidad de ese producto
      return newQuantities;
    });
  };

  const totalCompra = cart.reduce((total, producto) => {
    const price = parseFloat(producto.price) || 0; // Asegurarse de que el precio sea numérico
    const quantity = quantities[producto.id] || 1;
    return total + price * quantity;
  }, 0);

  const handleFinalizarCompra = () => {
    if (!isAuthenticated) {
      // Si no ha iniciado sesión, redirigir a la página de login
      navigate("/login");
    } else {
      // Si ha iniciado sesión, abrir el estado de isOpen
      setIsOpen(true);
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 container py-6">
        <h1 className="text-2xl font-bold mb-6">Carrito de Compras</h1>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {cart.length > 0 ? (
            cart.map((producto) => {
              const price = parseFloat(producto.price) || 0; // Asegurarse de que el precio sea numérico
              const quantity = quantities[producto.id] || 1;

              return (
                <Card key={producto.id} className="relative">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <CardTitle>{producto.name}</CardTitle>
                      <button
                        onClick={() => handleRemoveFromCart(producto.id)} // Eliminar producto
                        className="text-red-500"
                      >
                        <XIcon className="w-6 h-6" /> {/* Botón X */}
                      </button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <img
                      src={producto.image}
                      alt={producto.name}
                      className="w-full h-40 object-cover mb-4"
                    />
                    <p className="text-2xl font-bold">
                      ${price.toFixed(2)}
                    </p>
                    <div className="mt-2">
                      <label className="block text-sm font-medium text-gray-700">Cantidad:</label>
                      <input
                        type="number"
                        value={quantity}
                        min="1"
                        onChange={(e) => handleQuantityChange(producto.id, parseInt(e.target.value))}
                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                      />
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-between items-center">
                    <p className="text-lg">Subtotal: ${(price * quantity).toFixed(2)}</p>
                  </CardFooter>
                </Card>
              );
            })
          ) : (
            <p>No hay productos en el carrito.</p>
          )}
        </div>
      </main>

      <footer className="sticky bottom-0 border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container py-4 flex justify-end">
          <p className="text-lg font-bold mr-auto">Total: ${totalCompra.toFixed(2)}</p>
          <Button onClick={handleFinalizarCompra} disabled={cart.length === 0}>
            Finalizar Compra
          </Button>
        </div>
      </footer>
      <Footer />

      {/* Modal */}
      {isOpen && (
        <div className="fixed top-0 left-0 w-full h-full bg-gray-900 bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-4 rounded-md shadow-md">
            <h2 className="text-2xl font-bold mb-4">Finalizar Compra</h2>
            <p className="text-lg mb-4">¿Estás seguro de que deseas finalizar la compra?</p>
            <div className="flex justify-end">
              <Button onClick={() => setIsOpen(false)}>Cancelar</Button>
              <Button onClick={() => {
                console.log("Finalizar compra"); 
                // Aquí podrías agregar la lógica para procesar la compra
                setIsOpen(false); // Cerrar el modal después de finalizar la compra
              }}>
                Finalizar Compra
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
