import React, { useEffect, useState } from "react";
import HeaderCliente from "./headercli";
import Footer from "./footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useCart } from "../context/CartContext";
import { useNavigate } from "react-router-dom";
import { useCrudContextForms } from "../context/CrudContextForms";
import { useCrudContextPedidos } from "../context/CrudContextPedidos"; // Importa el contexto de pedidos
import { useProducts } from '../context/CrudContextInventario'; // Importa el hook del contexto de productos
import axios from 'axios'; // Asegúrate de tener axios instalado

export default function CarritoDeCompras() {
  const { cart, clearCart } = useCart();
  const { currentUser, updateUser } = useCrudContextForms(); // Asegúrate de que `updateUser` está disponible
  const { createData: createPedido } = useCrudContextPedidos(); // Desestructura la función para crear pedidos
  const { getData } = useProducts(); // Obtener la función getData del contexto de productos
  const [isOpen, setIsOpen] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    surname: "",
    direccion: "",      // Cambiado de address a direccion
    casa: "",           // Cambiado de apartment a casa
    state: "Bogotá",
    telefono: "",       // Cambiado de phone a telefono
  });
  const [formErrors, setFormErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false); // Para manejar el estado de envío

  useEffect(() => {
    if (currentUser && currentUser.role === "cliente") {
      // Cargar valores de currentUser si están presentes
      setFormData((prevState) => ({
        ...prevState,
        name: currentUser?.name || "", 
        surname: currentUser?.surname || "",
        direccion: currentUser?.direccion || "",    // Cargar direccion
        casa: currentUser?.casa || "",              // Cargar casa
        telefono: currentUser?.telefono || "",      // Cargar telefono
      }));
    }
  }, [currentUser]); // Eliminado 'cart' de las dependencias, ya que no afecta la autenticación

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
          ? /^3\d{10}$/.test(value)
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
    // Validar los campos del formulario
    const isFormValid = Object.values(formErrors).every((x) => x === "") &&
                        Object.values(formData).every((x) => x !== "");

    if (!currentUser || currentUser.role !== "cliente") {
      // Redirigir al usuario a la página de inicio de sesión si no está autenticado
      navigate("/login"); // Asegúrate de que esta ruta sea correcta en tu aplicación
      return;
    }

    if (isFormValid) {
      setIsOpen(true);
    } else {
      // Validar todos los campos nuevamente para mostrar errores
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
      id: product.id, // Asegúrate de incluir el ID
      stock: product.stock, // Incluye el stock actual
    }));
  
    // Genera un ID para el pedido
    const pedidoId = `pedido-${Date.now()}`;
  
    const pedido = {
      id: pedidoId,
      cliente: `${currentUser.name} ${currentUser.surname}`,
      fecha: new Date().toISOString().split("T")[0],
      estado: "En proceso",
      total: total,
      products: products,
      shippingDetails: {
        direccion: formData.direccion,
        casa: formData.casa,
        telefono: formData.telefono,
        state: formData.state,
      },
    };
  
    try {
      // Crear el pedido usando el contexto
      await createPedido(pedido);
  
      // Actualizar el stock de cada producto en la API
      const updateStockPromises = cart.map(async (product) => {
        const newStock = product.stock - product.quantity;
        if (newStock < 0) {
          throw new Error(`Stock insuficiente para el producto: ${product.name}`);
        }
        return axios.patch(`http://localhost:3000/products/${product.id}`, {
          stock: newStock,
        });
      });
  
      // Esperar a que todas las actualizaciones de stock se completen
      await Promise.all(updateStockPromises);
  
      // Refrescar los datos del inventario
      await getData(); // Llamar a getData para obtener los datos actualizados
  
      // Actualizar datos del usuario si es necesario
      const updatedUserData = {};
      if (!currentUser.direccion || currentUser.direccion !== formData.direccion) {
        updatedUserData.direccion = formData.direccion;
      }
      if (!currentUser.casa || currentUser.casa !== formData.casa) {
        updatedUserData.casa = formData.casa;
      }
      if (!currentUser.telefono || currentUser.telefono !== formData.telefono) {
        updatedUserData.telefono = formData.telefono;
      }
  
      if (Object.keys(updatedUserData).length > 0) {
        await axios.patch(`http://localhost:3000/users/${currentUser.id}`, updatedUserData);
        if (updateUser) {
          updateUser(updatedUserData);
        }
      }
  
      setIsOpen(false);
      setShowSuccessModal(true);
  
      setTimeout(() => {
        setShowSuccessModal(false);
        clearCart();
        navigate(`/cuenta?section=pedidos&pedidoId=${pedidoId}`);
      }, 5000);
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
    navigate("/cuenta?section=pedidos"); // Redirigir al usuario después de cerrar el modal de éxito
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <HeaderCliente />
      <main className="flex-1 container py-6 px-4 md:px-0">
        <h1 className="text-4xl font-bold mb-8 text-center text-primary">Tu Pedido</h1>
        <div className="grid gap-8 lg:grid-cols-2">
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="text-2xl">Información de Entrega</CardTitle>
            </CardHeader>
            <CardContent>
              <form className="space-y-6" noValidate>
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
                      required
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
              <CardTitle className="text-2xl">Resumen del Pedido</CardTitle>
            </CardHeader>
            <CardContent className="flex-grow overflow-y-auto">
              <div className="space-y-4">
                {cart.map((producto) => (
                  <div key={producto.id} className="flex justify-between items-center border-b border-gray-600 pb-4">
                    <div className="flex items-center space-x-4">
                      {/* Asegurarse de que imageUrl es un arreglo */}
                      {producto.imageUrl && producto.imageUrl.length > 0 && (
                        <img src={producto.imageUrl[0]} alt={producto.name} className="w-16 h-16 object-cover rounded" />
                      )}
                      <div>
                        <p className="font-semibold">{producto.name}</p>
                        <p className="font-semibold">Cantidad: {producto.quantity}</p>
                      </div>
                    </div>
                    <p className="font-semibold">$ {parseFloat(producto.price).toLocaleString('es-CO')}</p>
                  </div>
                ))}
              </div>
            </CardContent>
            <CardFooter className="flex justify-between items-center">
              <p className="font-semibold">Total</p>
              <p className="font-semibold">$ {total.toLocaleString('es-CO')}</p>
            </CardFooter>
            <div className="p-4">
              <Button onClick={handleFinalizarCompra} className="w-full" disabled={isSubmitting}>
                {isSubmitting ? "Procesando..." : "Finalizar Compra"}
              </Button>
            </div>
          </Card>
        </div>
        {/* Modal de Confirmación de Compra */}
        {isOpen && (
          <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-xl font-semibold mb-4">Confirmar Compra</h2>
              <p className="mb-4">¿Estás seguro de que deseas finalizar la compra?</p>
              <div className="flex justify-end space-x-4">
                <Button onClick={() => setIsOpen(false)} variant="outline">Cancelar</Button>
                <Button onClick={handleConfirmPurchase} disabled={isSubmitting}>
                  {isSubmitting ? "Confirmando..." : "Confirmar"}
                </Button>
              </div>
            </div>
          </div>
        )}
        {/* Modal de Éxito */}
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
