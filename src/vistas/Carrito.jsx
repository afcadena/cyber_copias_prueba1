import React, { useEffect, useState } from "react";
import Header from "./header";
import Footer from "./footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useCart } from "../context/CartContext";
import { XIcon } from 'lucide-react';
import { useNavigate } from "react-router-dom";
import { useCrudContextForms } from "../context/CrudContextForms"; // Asegúrate de importar el contexto
import axios from 'axios'; // Asegúrate de tener axios instalado

export default function CarritoDeCompras() {
  const { cart, removeFromCart, addToCart, clearCart } = useCart(); // Añadir clearCart para vaciar el carrito
  const { currentUser } = useCrudContextForms(); // Usamos el contexto para obtener el usuario actual
  const [isOpen, setIsOpen] = useState(false);
  const [showMessage, setShowMessage] = useState(false); // Estado para mostrar el mensaje de error de autenticación
  const [showSuccessModal, setShowSuccessModal] = useState(false); // Estado para mostrar el modal de éxito
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Verificar la autenticación del usuario actual
    if (currentUser && currentUser.role === "cliente") {
      setIsAuthenticated(true);
    } else {
      setIsAuthenticated(false);
    }
  }, [currentUser, cart]);

  const handleQuantityChange = (productId, newQuantity) => {
    const product = cart.find((p) => p.id === productId);
    if (product) {
      const maxQuantity = parseInt(product.stock); // Control de stock
      const quantityToSet = Math.min(newQuantity, maxQuantity);

      if (quantityToSet > product.quantity) {
        // Si la cantidad es mayor, agrega más al carrito
        addToCart(product);
      } else if (quantityToSet < product.quantity) {
        // Si la cantidad es menor, remueve del carrito
        removeFromCart(product.id);
        for (let i = 0; i < quantityToSet; i++) {
          addToCart(product); // Reagregar la cantidad ajustada
        }
      }
    }
  };

  const handleRemoveFromCart = (productId) => {
    removeFromCart(productId);
  };

  const totalCompra = cart.reduce((total, producto) => {
    const price = parseFloat(producto.price) || 0;
    const quantity = producto.quantity || 1;
    return total + price * quantity;
  }, 0);

  const handleFinalizarCompra = () => {
    if (!isAuthenticated) {
      setShowMessage(true); // Mostrar mensaje si no está autenticado
    } else {
      setIsOpen(true); // Abrir el modal para confirmar la compra
    }
  };

  // Función para manejar la confirmación de compra
  const handleConfirmPurchase = async () => {
    // Recolectar los productos
    const products = cart.map((product) => ({
      name: product.name,
      quantity: product.quantity,
      price: product.price
    }));

    // Crear el objeto del pedido
    const order = {
      cliente: currentUser.name,
      fecha: new Date().toISOString().split('T')[0], // Fecha actual en formato yyyy-mm-dd
      estado: "En proceso", // Estado inicial del pedido
      total: totalCompra, // Total de la compra
      products: products, // Productos en el carrito
    };

    try {
      // Hacer el POST request a tu API para guardar el pedido
      await axios.post('http://localhost:3000/pedidos', order); // Cambia la URL a tu API real

      // Mostrar un mensaje de éxito y vaciar el carrito
      setIsOpen(false);
      setShowSuccessModal(true);

      // Ocultar el modal de éxito después de 10 segundos
      setTimeout(() => {
        setShowSuccessModal(false);
        clearCart(); // Vaciar el carrito
      }, 10000);
      
    } catch (error) {
      console.error("Error al guardar el pedido:", error);
      // Manejar el error mostrando un mensaje de error
    }
  };

  const handleCloseSuccessModal = () => {
    clearCart(); // Vaciar el carrito
    setShowSuccessModal(false); // Cerrar el modal de éxito
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 container py-6">
        <h1 className="text-2xl font-bold mb-6">Carrito de Compras</h1>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {cart.length > 0 ? (
            cart.map((producto) => {
              const price = parseFloat(producto.price) || 0;
              const quantity = producto.quantity || 1;

              return (
                <Card key={producto.id} className="relative">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <CardTitle>{producto.name}</CardTitle>
                      <button
                        onClick={() => handleRemoveFromCart(producto.id)}
                        className="text-red-500"
                      >
                        <XIcon className="w-6 h-6" />
                      </button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <img
                      src={producto.imageUrl}
                      alt={producto.name}
                      className="w-full h-40 object-cover mb-4"
                    />
                    <p className="text-2xl font-bold">${price.toFixed(2)}</p>
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

      {/* Modal de confirmación de compra */}
      {isOpen && (
        <div className="fixed top-0 left-0 w-full h-full bg-gray-900 bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-4 rounded-md shadow-md">
            <h2 className="text-2xl font-bold mb-4">Finalizar Compra</h2>
            <p className="text-lg mb-4">¿Estás seguro de que deseas finalizar la compra?</p>
            <div className="flex justify-end space-x-4">
              <Button onClick={() => setIsOpen(false)}>Cancelar</Button>
              <Button onClick={handleConfirmPurchase}>Confirmar Compra</Button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de éxito después de la compra */}
      {showSuccessModal && (
        <div className="fixed top-0 left-0 w-full h-full bg-gray-900 bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-4 rounded-md shadow-md">
            <h2 className="text-2xl font-bold mb-4">Pedido Agendado con Éxito</h2>
            <p className="text-lg mb-4">Tu pedido ha sido procesado correctamente.</p>
            <div className="flex justify-end space-x-4">
              <Button onClick={handleCloseSuccessModal}>Cerrar</Button>
            </div>
          </div>
        </div>
      )}

      {/* Mensaje de error de autenticación */}
      {showMessage && (
        <div className="fixed top-0 left-0 w-full h-full bg-gray-900 bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-4 rounded-md shadow-md">
            <h2 className="text-2xl font-bold mb-4">Error</h2>
            <p className="text-lg mb-4">Debes iniciar sesión para finalizar la compra.</p>
            <div className="flex justify-end space-x-4">
              <Button onClick={() => setShowMessage(false)}>Cerrar</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
