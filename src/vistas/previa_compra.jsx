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
    const product = db.find(item => item._id === productId);

    if (!product) {
      console.error("Producto no encontrado");
      return;
    }

    if (newQuantity < 1) {
      return;
    }

    if (newQuantity > product.stock) {
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
      }, 10000);
    } else {
      navigate('/carrito');
    }
  };

  const handleGoToCatalog = () => {
    navigate('/catalogo');
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <Header />

      <main className="container mx-auto px-4 py-6 md:py-8 max-w-7xl flex-1">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
          <h1 className="text-2xl sm:text-3xl font-bold text-indigo-600">Tu pedido</h1>
          <Button 
            variant="link" 
            className="text-indigo-600 px-0 sm:px-4" 
            onClick={handleGoToCatalog}
          >
            <ArrowLeft className="mr-2 h-4 w-4" /> Seguir comprando
          </Button>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          <Card className="lg:col-span-2 shadow-lg order-2 lg:order-1">
            <CardHeader>
              <CardTitle>Producto</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {cart && cart.length > 0 ? cart.map((product) => (
                <div key={product._id} className="flex flex-col sm:flex-row items-start sm:items-center gap-4 py-4 border-b">
                  <img 
                    src={product.imageUrl} 
                    alt={product.name} 
                    className="w-20 h-20 object-cover rounded"
                  />
                  <div className="flex-grow">
                    <h3 className="font-semibold text-gray-800">{product.name}</h3>
                    <p className="text-sm text-gray-500">{product.brand}</p>
                  </div>
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 w-full sm:w-auto">
                    <div className="flex items-center gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        className="h-8 w-8 p-0"
                        onClick={() => handleQuantityChange(product._id, product.quantity - 1)}
                        disabled={product.quantity <= 1}
                      >
                        <Minus className="h-4 w-4" />
                      </Button>
                      <span className="w-8 text-center text-gray-800">{product.quantity}</span>
                      <Button
                        size="sm"
                        variant="outline"
                        className="h-8 w-8 p-0"
                        onClick={() => handleQuantityChange(product._id, product.quantity + 1)}
                        disabled={product.quantity >= product.stock}
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      className="w-full sm:w-auto"
                      onClick={() => removeFromCart(product._id)}
                    >
                      Eliminar
                    </Button>
                  </div>
                  <p className="font-semibold text-gray-800 text-right w-full sm:w-auto">
                    $ {(product.price * product.quantity).toLocaleString('es-CO')}
                  </p>
                </div>
              )) : (
                <div className="text-center py-8">
                  <p className="text-gray-600">El carrito está vacío.</p>
                  <Button 
                    variant="outline" 
                    className="mt-4"
                    onClick={handleGoToCatalog}
                  >
                    Ir al catálogo
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="shadow-lg bg-[#2e3a59] text-white order-1 lg:order-2 sticky top-4">
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
              <Button 
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white" 
                onClick={handleContinuePurchase}
                disabled={!cart || cart.length === 0}
              >
                Realizar pedido
              </Button>
              <div className="grid grid-cols-3 gap-2 mt-4">
                <div className="flex flex-col items-center">
                  <ShieldCheck className="h-6 w-6 sm:h-8 sm:w-8 text-indigo-400" />
                  <span className="text-[10px] sm:text-xs text-center mt-1">Transacción Segura</span>
                </div>
                <div className="flex flex-col items-center">
                  <Truck className="h-6 w-6 sm:h-8 sm:w-8 text-indigo-400" />
                  <span className="text-[10px] sm:text-xs text-center mt-1">Envío Garantizado</span>
                </div>
                <div className="flex flex-col items-center">
                  <ThumbsUp className="h-6 w-6 sm:h-8 sm:w-8 text-indigo-400" />
                  <span className="text-[10px] sm:text-xs text-center mt-1">Satisfacción Garantizada</span>
                </div>
              </div>
            </CardFooter>
          </Card>
        </div>
      </main>

      <Footer />

      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 p-4 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg text-center max-w-sm w-full">
            <h2 className="text-lg font-semibold mb-2">Serás redirigido al login para iniciar sesión</h2>
            <p className="text-gray-600">Espera un momento...</p>
          </div>
        </div>
      )}
    </div>
  );
}