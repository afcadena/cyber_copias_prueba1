import React, { useEffect, useState } from "react";
import HeaderCliente from "./headercli";
import Footer from "./footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useCart } from "../context/CartContext";
import { useNavigate } from "react-router-dom";
import { useCrudContextForms } from "../context/CrudContextForms";
import { useCrudContextPedidos } from "../context/CrudContextPedidos";
import { useProducts } from '../context/CrudContextInventario';
import axios from 'axios';

export default function CarritoDeCompras() {
  const { cart, clearCart } = useCart();
  const { currentUser, updateUser } = useCrudContextForms();
  const { createData: createPedido } = useCrudContextPedidos();
  const { getData } = useProducts();
  const [isOpen, setIsOpen] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    surname: "",
    direccion: "",
    casa: "",
    state: "Bogotá",
    telefono: "",
  });
  const [formErrors, setFormErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (currentUser && currentUser.role === "cliente") {
      setFormData((prevState) => ({
        ...prevState,
        name: currentUser?.name || "", 
        surname: currentUser?.surname || "",
        direccion: currentUser?.direccion || "",
        casa: currentUser?.casa || "",
        telefono: currentUser?.telefono || "",
      }));
    }
  }, [currentUser]);

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
      case "direccion":
      case "casa":
        errors[fieldName] = value
          ? ""
          : `${capitalize(fieldName)} es requerido`;
        break;
      case "telefono":
        errors.telefono = value
          ? /^3\d{9}$/.test(value)
            ? ""
            : "Teléfono inválido (11 dígitos, comenzando con 3)"
          : "Teléfono es requerido";
        break;
      default:
        break;
    }
    setFormErrors(errors);
  };

  const capitalize = (s) => s.charAt(0).toUpperCase() + s.slice(1);

  const subtotal = cart.reduce((total, producto) => {
    const price = parseFloat(producto.price) || 0;
    const quantity = producto.quantity || 1;
    return total + price * quantity;
  }, 0);

  const total = subtotal;

  const handleFinalizarCompra = () => {
    const isFormValid = Object.values(formErrors).every((x) => x === "") &&
                        Object.values(formData).every((x) => x !== "");

    if (!currentUser || currentUser.role !== "cliente") {
      navigate("/login");
      return;
    }

    if (isFormValid) {
      setIsOpen(true);
    } else {
      Object.keys(formData).forEach((field) => {
        validateField(field, formData[field]);
      });
    }
  };

  const handleConfirmPurchase = async () => {
    setIsSubmitting(true);

    const products = cart.map((product) => ({
        name: product.name,
        quantity: product.quantity,
        price: product.price.toString(),
        id: product._id,
        stock: product.stock,
    }));

    try {
        const updateStockPromises = cart.map(async (product) => {
            const newStock = product.stock - product.quantity;
            if (newStock < 0) {
                throw new Error(`Stock insuficiente para el producto: ${product.name}`);
            }
            return axios.put(`https://cyber-copias-final.onrender.com/api/products/${product._id}`, {
                stock: newStock,
            });
        });

        await Promise.all(updateStockPromises);

        if (!currentUser?._id) {
            throw new Error("No se pudo obtener el ID del usuario.");
        }

        await updateUser(currentUser._id, {
            direccion: formData.direccion,
            casa: formData.casa,
            telefono: formData.telefono,
        });

        const pedidoData = {
            userId: currentUser._id,
            email: currentUser.email,
            total: total,
            products: products,
            direccion: formData.direccion,
            casa: formData.casa,
            telefono: formData.telefono,
            state: "pendiente",
        };

        await createPedido(pedidoData);

        setShowSuccessModal(true);
    } catch (error) {
        console.error("Error al procesar la compra o actualizar los datos del usuario:", error);
        alert("Ocurrió un error al procesar tu pedido. Por favor, intenta nuevamente.");
    } finally {
        setIsSubmitting(false);
    }
  };

  const handleCloseSuccessModal = () => {
    clearCart();
    setShowSuccessModal(false);
    navigate("/cuenta?section=pedidos");
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <HeaderCliente />
      <main className="flex-1 container mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl sm:text-4xl font-bold mb-6 sm:mb-8 text-center text-primary">Tu Pedido</h1>
        <div className="grid gap-6 lg:gap-8 lg:grid-cols-2">
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="text-xl sm:text-2xl">Información de Entrega</CardTitle>
            </CardHeader>
            <CardContent>
              <form className="space-y-4 sm:space-y-6" noValidate>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                      Nombre
                    </label>
                    <Input
                      id="name"
                      name="name"
                      placeholder="Nombre"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="w-full"
                      required
                    />
                    {formErrors.name && (
                      <p className="text-red-500 text-xs mt-1">{formErrors.name}</p>
                    )}
                  </div>
                  <div>
                    <label htmlFor="surname" className="block text-sm font-medium text-gray-700 mb-1">
                      Apellidos
                    </label>
                    <Input
                      id="surname"
                      name="surname"
                      placeholder="Apellidos"
                      value={formData.surname}
                      onChange={handleInputChange}
                      className="w-full"
                      required
                    />
                    {formErrors.surname && (
                      <p className="text-red-500 text-xs mt-1">{formErrors.surname}</p>
                    )}
                  </div>
                </div>
                <div>
                  <label htmlFor="direccion" className="block text-sm font-medium text-gray-700 mb-1">Dirección</label>
                  <Input
                    id="direccion"
                    name="direccion"
                    placeholder="Dirección"
                    value={formData.direccion}
                    onChange={handleInputChange}
                    className="w-full"
                    required
                  />
                  {formErrors.direccion && <p className="text-red-500 text-xs mt-1">{formErrors.direccion}</p>}
                </div>
                <div>
                  <label htmlFor="casa" className="block text-sm font-medium text-gray-700 mb-1">Casa, apartamento, etc.</label>
                  <Input
                    id="casa"
                    name="casa"
                    placeholder="Casa, apartamento, etc."
                    value={formData.casa}
                    onChange={handleInputChange}
                    className="w-full"
                    required
                  />
                  {formErrors.casa && <p className="text-red-500 text-xs mt-1">{formErrors.casa}</p>}
                </div>
                <div>
                  <label htmlFor="telefono" className="block text-sm font-medium text-gray-700 mb-1">Teléfono</label>
                  <div className="flex">
                    <span className="inline-flex items-center px-3 text-sm text-gray-900 bg-gray-200 border border-r-0 border-gray-300 rounded-l-md">
                      +57
                    </span>
                    <Input 
                      id="telefono"
                      name="telefono" 
                      placeholder="Teléfono" 
                      value={formData.telefono} 
                      onChange={handleInputChange} 
                      className="rounded-l-none"
                      required
                    />
                  </div>
                  {formErrors.telefono && <p className="text-red-500 text-xs mt-1">{formErrors.telefono}</p>}
                </div>
              </form>
            </CardContent>
          </Card>
          <Card className="bg-[#1a2b4a] text-white shadow-lg flex flex-col">
            <CardHeader>
              <CardTitle className="text-xl sm:text-2xl">Resumen del Pedido</CardTitle>
            </CardHeader>
            <CardContent className="flex-grow overflow-y-auto">
              <div className="space-y-4">
                {cart.map((producto) => (
                  <div key={producto.id} className="flex justify-between items-center border-b border-gray-600 pb-4">
                    <div className="flex items-center space-x-4">
                      {producto.imageUrl && producto.imageUrl.length > 0 && (
                        <img src={producto.imageUrl[0]} alt={producto.name} className="w-12 h-12 sm:w-16 sm:h-16 object-cover rounded" />
                      )}
                      <div>
                        <p className="font-semibold text-sm sm:text-base">{producto.name}</p>
                        <p className="font-semibold text-sm">Cantidad: {producto.quantity}</p>
                      </div>
                    </div>
                    <p className="font-semibold text-sm sm:text-base">$ {parseFloat(producto.price).toLocaleString('es-CO')}</p>
                  </div>
                ))}
              </div>
            </CardContent>
            <CardFooter className="flex justify-between items-center">
              <p className="font-semibold">Total </p>
              <p className="font-semibold">$ {total.toLocaleString('es-CO')}</p>
            </CardFooter>
            <div className="p-4">
              <Button onClick={handleFinalizarCompra} className="w-full" disabled={isSubmitting}>
                {isSubmitting ? "Procesando..." : "Finalizar Compra"}
              </Button>
            </div>
          </Card>
        </div>
        {isOpen && (
          <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 z-50">
            <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md mx-4">
              <h2 className="text-xl font-semibold mb-4">Confirmar Pedido</h2>
              <p className="mb-4">¿Estás seguro de que deseas finalizar el pedido?</p>
              <div className="flex justify-end space-x-4">
                <Button onClick={() => setIsOpen(false)} variant="outline">Cancelar</Button>
                <Button onClick={handleConfirmPurchase} disabled={isSubmitting}>
                  {isSubmitting ? "Confirmando..." : "Confirmar"}
                </Button>
              </div>
            </div>
          </div>
        )}
        {showSuccessModal && (
          <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 z-50">
            <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md mx-4">
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