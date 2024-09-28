import React, { useEffect, useState } from "react";
import Header from "./headercli";
import Footer from "./footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useCart } from "../context/CartContext";
import { useNavigate } from "react-router-dom";
import { useCrudContextForms } from "../context/CrudContextForms";
import axios from 'axios';

export default function CarritoDeCompras() {
  const { cart, clearCart } = useCart();
  const { currentUser } = useCrudContextForms();
  const [isOpen, setIsOpen] = useState(false);
  const [showMessage, setShowMessage] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",  // Se inicializan vacíos
    surname: "",  // Se inicializan vacíos
    address: "",
    apartment: "",
    state: "Bogotá",
    phone: "",
  });
  const [formErrors, setFormErrors] = useState({});

  useEffect(() => {
    if (currentUser && currentUser.role === "cliente") {
      setIsAuthenticated(true);

      // Cargar valores de currentUser si están presentes
      setFormData({
        ...formData,
        name: currentUser?.name || "", 
        surname: currentUser?.surname || "",  // Ahora surname se carga correctamente
      });
    } else {
      setIsAuthenticated(false);
    }
  }, [currentUser, cart]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
    validateField(name, value);
  };

  const validateField = (fieldName, value) => {
    let errors = { ...formErrors };
    switch (fieldName) {
      case "name":
      case "surname":
      case "address":
      case "apartment":
        errors[fieldName] = value
          ? ""
          : `${fieldName.charAt(0).toUpperCase() + fieldName.slice(1)} es requerido`;
        break;
      case "phone":
        errors.phone = value
          ? /^[3][0-9]{9}$/.test(value)
            ? ""
            : "Teléfono inválido (10 dígitos, comenzando con 3)"
          : "Teléfono es requerido";
        break;
      default:
        break;
    }
    setFormErrors(errors);
  };

  const subtotal = cart.reduce((total, producto) => {
    const price = parseFloat(producto.price) || 0;
    const quantity = producto.quantity || 1;
    return total + price * quantity;
  }, 0);

  const total = subtotal;

  const handleFinalizarCompra = () => {
    if (!isAuthenticated) {
      setShowMessage(true);
    } else {
      if (
        Object.values(formErrors).every((x) => x === "") &&
        Object.values(formData).every((x) => x !== "")
      ) {
        setIsOpen(true);
      } else {
        setShowMessage(true);
      }
    }
  };

  const handleConfirmPurchase = async () => {
    const products = cart.map((product) => ({
      id: product.id,
      name: product.name,
      quantity: product.quantity,
      price: product.price,
      stock: product.stock,
    }));

    const order = {
      cliente: currentUser.name,
      fecha: new Date().toISOString().split("T")[0],
      estado: "En proceso",
      total: total,
      products: products,
      shippingDetails: formData,
    };

    try {
      await axios.post("http://localhost:3000/pedidos", order);
      await Promise.all(
        products.map(async (product) => {
          const newStock = product.stock - product.quantity;
          if (newStock >= 0) {
            await axios.patch(`http://localhost:3000/products/${product.id}`, {
              stock: newStock,
            });
          } else {
            console.error(`Stock insuficiente para el producto: ${product.name}`);
          }
        })
      );

      setIsOpen(false);
      setShowSuccessModal(true);

      setTimeout(() => {
        setShowSuccessModal(false);
        clearCart();
      }, 10000);
    } catch (error) {
      console.error("Error al procesar la compra o actualizar el stock:", error);
    }
  };

  const handleCloseSuccessModal = () => {
    clearCart();
    setShowSuccessModal(false);
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <Header />
      <main className="flex-1 container py-6 px-4 md:px-0">
        <h1 className="text-4xl font-bold mb-8 text-center text-primary">Tu Pedido</h1>
        <div className="grid gap-8 lg:grid-cols-2">
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="text-2xl">Información de Entrega</CardTitle>
            </CardHeader>
            <CardContent>
              <form className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label
                      htmlFor="name"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Nombre
                    </label>
                    <Input
                      id="name"
                      name="name"
                      placeholder="Nombre"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="w-full"
                    />
                    {formErrors.name && (
                      <p className="text-red-500 text-xs mt-1">{formErrors.name}</p>
                    )}
                  </div>
                  <div>
                    <label
                      htmlFor="surname"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Apellidos
                    </label>
                    <Input
                      id="surname"
                      name="surname"
                      placeholder="Apellidos"
                      value={formData.surname}
                      onChange={handleInputChange}
                      className="w-full"
                    />
                    {formErrors.surname && (
                      <p className="text-red-500 text-xs mt-1">{formErrors.surname}</p>
                    )}
                  </div>
                </div>
                  <div>
                    <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">Dirección</label>
                    <Input id="address" name="address" placeholder="Dirección" value={formData.address} onChange={handleInputChange} className="w-full" />
                    {formErrors.address && <p className="text-red-500 text-xs mt-1">{formErrors.address}</p>}
                  </div>
                  <div>
                    <label htmlFor="apartment" className="block text-sm font-medium text-gray-700 mb-1">Casa, apartamento, etc.</label>
                    <Input id="apartment" name="apartment" placeholder="Casa, apartamento, etc." value={formData.apartment} onChange={handleInputChange} className="w-full" />
                    {formErrors.apartment && <p className="text-red-500 text-xs mt-1">{formErrors.apartment}</p>}
                  </div>
                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">Teléfono</label>
                    <div className="flex">
                      <span className="inline-flex items-center px-3 text-sm text-gray-900 bg-gray-200 border border-r-0 border-gray-300 rounded-l-md">
                        +57
                      </span>
                      <Input 
                        id="phone"
                        name="phone" 
                        placeholder="Teléfono" 
                        value={formData.phone} 
                        onChange={handleInputChange} 
                        className="rounded-l-none"
                      />
                    </div>
                    {formErrors.phone && <p className="text-red-500 text-xs mt-1">{formErrors.phone}</p>}
                  </div>
                </form>
              </CardContent>
            </Card>
            <Card className="bg-[#1a2b4a] text-white shadow-lg flex flex-col">
              <CardHeader>
                <CardTitle className="text-2xl">Resumen del Pedido</CardTitle>
              </CardHeader>
              <CardContent className="flex-grow overflow-y-auto">
                <div className="space-y-4">
                  {cart.map((producto) => (
                    <div key={producto.id} className="flex justify-between items-center border-b border-gray-600 pb-4">
                      <div className="flex items-center space-x-4">
                        <img src={producto.imageUrl} alt={producto.name} className="w-16 h-16 object-cover rounded" />
                        <div>
                          <p className="font-semibold">{producto.name}</p>
                          <p className="font-semibold">Cantidad: {producto.quantity}</p>
                        </div>
                      </div>
                      <p className="font-semibold">$ {producto.price.toLocaleString('es-CO')}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
              <CardFooter className="flex justify-between items-center">
                <p className="font-semibold">Total</p>
                <p className="font-semibold">$ {total.toLocaleString('es-CO')}</p>
              </CardFooter>
              <div className="p-4">
                <Button onClick={handleFinalizarCompra} className="w-full">Finalizar Compra</Button>
              </div>
            </Card>
          </div>
          {showMessage && (
            <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
              <div className="bg-white rounded-lg shadow-lg p-6">
                <h2 className="text-xl font-semibold mb-4">¡Atención!</h2>
                <p className="mb-4">Debes iniciar sesión para continuar con la compra.</p>
                <div className="flex justify-end">
                  <Button onClick={() => setShowMessage(false)}>Cerrar</Button>
                </div>
              </div>
            </div>
          )}
          {isOpen && (
            <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
              <div className="bg-white rounded-lg shadow-lg p-6">
                <h2 className="text-xl font-semibold mb-4">Confirmar Compra</h2>
                <p className="mb-4">¿Estás seguro de que deseas finalizar la compra?</p>
                <div className="flex justify-end space-x-4">
                  <Button onClick={() => setIsOpen(false)} variant="outline">Cancelar</Button>
                  <Button onClick={handleConfirmPurchase}>Confirmar</Button>
                </div>
              </div>
            </div>
          )}
          {showSuccessModal && (
            <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
              <div className="bg-white rounded-lg shadow-lg p-6">
                <h2 className="text-xl font-semibold mb-4">¡Éxito!</h2>
                <p className="mb-4">Tu pedido se ha realizado con éxito.</p>
                <div className="flex justify-end">
                  <Button onClick={handleCloseSuccessModal}>Cerrar</Button>
                </div>
              </div>
            </div>
          )}
        </main>
        <Footer />
      </div>
    );
  }
