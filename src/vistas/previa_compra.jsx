import React, { useState, useEffect } from 'react';
import { useCart } from "../context/CartContext"; 
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Minus, Plus, ArrowLeft, ShieldCheck, Truck, ThumbsUp } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Header from './header';  
import Footer from './footer';  
import { useProducts } from "../context/CrudContextInventario";
import { useCrudContextForms } from "../context/CrudContextForms"; 

export default function CartPreview() {
  const { cart, updateQuantity, removeFromCart } = useCart();  
  const { db } = useProducts(); 
  const { currentUser } = useCrudContextForms(); 
  const navigate = useNavigate();  

  const subtotal = cart ? cart.reduce((total, product) => total + product.price * product.quantity, 0) : 0;
  const total = subtotal;

  const [showModal, setShowModal] = useState(false);

  const handleQuantityChange = (productId, newQuantity) => {
    const product = db.find(item => item.id === productId); 

    if (newQuantity < 1) {
      return;
    }

    if (product && newQuantity > product.stock) {
      console.log("No hay suficiente stock disponible");
      return;
    }

    updateQuantity(productId, newQuantity);
  };

  const handleContinuePurchase = () => {
    if (!currentUser || currentUser.role !== 'cliente') {
      setShowModal(true);
      setTimeout(() => {
        navigate('/login', { state: { from: '/carrito' } });
      }, 10000); // Redirige después de 10 segundos
    } else {
      navigate('/carrito');
    }
  };

  const handleGoToCatalog = () => {
    navigate('/catalogo'); // Redirige al catálogo
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <Header /> 

      <main className="container mx-auto p-4 max-w-4xl flex-1">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-indigo-600">Tu pedido</h1>
          <Button variant="link" className="text-indigo-600" onClick={handleGoToCatalog}>
            <ArrowLeft className="mr-2 h-4 w-4" /> Seguir comprando
          </Button>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          <Card className="lg:col-span-2 shadow-lg">
            <CardHeader>
              <CardTitle>Producto</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {cart && cart.length > 0 ? cart.map((product) => (
                <div key={product.id} className="flex items-center space-x-4 py-2 border-b">
                  <img src={product.imageUrl} alt={product.name} className="w-16 h-16 object-cover rounded" />
                  <div className="flex-grow">
                    <h3 className="font-semibold text-gray-800">{product.name}</h3>
                    <p className="text-sm text-gray-500">{product.brand}</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button
                      size="sm"
                      variant="outline"
                      className="bg-transparent border-gray-400 text-gray-800"
                      onClick={() => handleQuantityChange(product.id, product.quantity - 1)}
                      disabled={product.quantity <= 1}
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                    <span className="text-gray-800">{product.quantity}</span>
                    <Button
                      size="sm"
                      variant="outline"
                      className="bg-transparent border-gray-400 text-gray-800"
                      onClick={() => handleQuantityChange(product.id, product.quantity + 1)}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="bg-transparent border-gray-400 text-gray-800"
                      onClick={() => removeFromCart(product.id)}
                    >
                      Eliminar
                    </Button>
                  </div>
                  <p className="font-semibold text-gray-800">$ { (product.price * product.quantity).toLocaleString('es-CO') }</p>
                </div>
              )) : <p className="text-gray-600">El carrito está vacío.</p>}
            </CardContent>
          </Card>

          <Card className="shadow-lg bg-[#2e3a59] text-white">
            <CardHeader>
              <CardTitle>Resumen del Pedido</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>$ {subtotal.toLocaleString('es-CO')}</span>
              </div>
              <div className="flex justify-between font-bold text-lg">
                <span>Total:</span>
                <span>$ {total.toLocaleString('es-CO')}</span>
              </div>
            </CardContent>
            <CardFooter className="flex flex-col space-y-4">
              <Button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white" onClick={handleContinuePurchase}>
                CONTINUAR COMPRA
              </Button>
              <div className="flex justify-between mt-4">
                <div className="flex flex-col items-center">
                  <ShieldCheck className="h-8 w-8 text-indigo-400" />
                  <span className="text-xs text-center mt-1">Transacción Segura</span>
                </div>
                <div className="flex flex-col items-center">
                  <Truck className="h-8 w-8 text-indigo-400" />
                  <span className="text-xs text-center mt-1">Envío Garantizado</span>
                </div>
                <div className="flex flex-col items-center">
                  <ThumbsUp className="h-8 w-8 text-indigo-400" />
                  <span className="text-xs text-center mt-1">Satisfacción Garantizada</span>
                </div>
              </div>
            </CardFooter>
          </Card>
        </div>
      </main>

      <Footer /> 

      {/* Modal de Alerta */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-4 rounded shadow-lg text-center">
            <h2 className="text-lg font-semibold">Serás redirigido al login para iniciar sesión</h2>
            <p className="mt-2">Espera un momento...</p>
          </div>
        </div>
      )}
    </div>
  );
}
