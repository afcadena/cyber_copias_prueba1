// src/components/Cuenta.jsx

import React, { useState, useEffect, useContext, createContext } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { User, MapPin, Package, Edit2, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import Footer from "./footer";
import { useCrudContextForms } from '../context/CrudContextForms';
import HeaderCli from './headercli'; // Asegúrate de que la ruta sea correcta
import axios from 'axios'; // Asegúrate de tener axios instalado
import { useProducts } from "../context/CrudContextInventario";

// Crear el contexto para la cuenta
const CuentaContext = createContext();

// Proveedor del contexto de la cuenta
const CuentaProvider = ({ children }) => {
  const { currentUser, updateUser } = useCrudContextForms(); // Asegúrate de que `updateUser` está disponible
  const [userData, setUserData] = useState({}); // Inicializar userData con un objeto vacío

  // Actualizar userData cuando currentUser cambia
  useEffect(() => {
    if (currentUser) {
      console.log("Current User:", currentUser); // Depuración
      setUserData({
        ...currentUser,
        name: currentUser.name ? currentUser.name.trim() : "",
        surname: currentUser.surname ? currentUser.surname.trim() : "",
        // email and telefono are spread via ...currentUser
      });
    }
  }, [currentUser]);

  return (
    <CuentaContext.Provider value={{ userData, setUserData, updateUser }}>
      {children}
    </CuentaContext.Provider>
  );
};

// Modal para actualizar el perfil del usuario
const UpdateProfileModal = ({ email = '', telefono = '', onUpdate, onClose }) => {
  const { updateUser } = useCrudContextForms();

  // Inicializar newTelefono sin el prefijo '57' si está presente
  const initialTelefono = (telefono && typeof telefono === 'string' && telefono.startsWith('57')) 
    ? telefono.slice(2) 
    : (telefono || '');

  const [newEmail, setNewEmail] = useState(email);
  const [newTelefono, setNewTelefono] = useState(initialTelefono);
  const [phoneError, setPhoneError] = useState("");

  // Función para validar el número de teléfono
  const validatePhone = (phone) => {
    const regex = /^3\d{10}$/; // Debe comenzar con '3' y tener 11 dígitos
    return regex.test(phone);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validar el teléfono antes de enviar
    if (!validatePhone(newTelefono)) {
      setPhoneError("El teléfono debe comenzar con '3' y tener exactamente 11 dígitos.");
      return;
    } else {
      setPhoneError("");
    }

    // Combina los datos existentes con los nuevos
    const result = await updateUser({
      email: newEmail,
      telefono: `57${newTelefono}` // Almacenar con el prefijo '57'
    });

    if (result) {
      onUpdate({ email: newEmail, telefono: `57${newTelefono}` });
      onClose();
    }
  };

  const handlePhoneChange = (e) => {
    const value = e.target.value;
    // Permitir solo números
    if (/^\d*$/.test(value)) {
      setNewTelefono(value);
      // Validar en tiempo real
      if (validatePhone(value)) {
        setPhoneError("");
      } else {
        setPhoneError("El teléfono debe comenzar con '3' y tener exactamente 11 dígitos.");
      }
    }
  };

  return (
    <DialogContent className="sm:max-w-[425px]">
      <DialogHeader>
        <DialogTitle>Actualizar perfil</DialogTitle>
      </DialogHeader>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Campo de Email */}
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            value={newEmail}
            onChange={(e) => setNewEmail(e.target.value)}
            required
          />
        </div>

        {/* Campo de Teléfono con Prefijo +57 */}
        <div className="space-y-2">
          <Label htmlFor="telefono">Teléfono</Label>
          <div className="flex items-center">
            <span className="mr-2 text-gray-700">+57</span>
            <Input
              id="telefono"
              type="text"
              value={newTelefono}
              onChange={handlePhoneChange}
              required
              maxLength={11} // Limitar a 11 dígitos
              placeholder="Ej: 31234567890" // Placeholder más informativo
              className={phoneError ? "input-error" : ""}
            />
          </div>
          {phoneError && <p className="text-red-500 text-sm">{phoneError}</p>}
        </div>

        {/* Botón de Envío */}
        <Button type="submit" disabled={phoneError !== "" || newTelefono.length !== 11}>
          Guardar cambios
        </Button>
      </form>
    </DialogContent>
  );
};

// Modal para actualizar la dirección del usuario
const UpdateAddressModal = ({ address, onUpdate, onClose }) => {
  const { updateUser } = useCrudContextForms();
  const [newAddress, setNewAddress] = useState(address);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const result = await updateUser({
      direccion: newAddress
    });

    if (result) {
      onUpdate({ direccion: newAddress }); // Llama a onUpdate aquí
      onClose(); // Cerrar el modal después de la actualización
    }
  };
  
  return (
    <DialogContent className="sm:max-w-[425px]">
      <DialogHeader>
        <DialogTitle>Actualizar dirección</DialogTitle>
      </DialogHeader>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="address">Dirección</Label>
          <Input
            id="address"
            value={newAddress}
            onChange={(e) => setNewAddress(e.target.value)}
            required
          />
        </div>
        <Button type="submit">Guardar cambios</Button>
      </form>
    </DialogContent>
  );
};

// Componente para mostrar y editar el perfil del usuario
const ProfileContent = () => {
  const { userData, setUserData } = useContext(CuentaContext);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  if (!userData || !userData.email) {
    return <div>Cargando...</div>;
  }

  const handleUpdate = (newData) => {
    setUserData((prevUserData) => ({
      ...prevUserData,
      ...newData, // Combina el objeto anterior con el nuevo
    }));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Perfil de Usuario</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label>Nombres</Label>
          <p>{userData.name}</p>
        </div>
        <div className="space-y-2">
          <Label>Apellidos</Label>
          <p>{userData.surname}</p>
        </div>
        <div className="space-y-2">
          <Label>Email</Label>
          <p>{userData.email}</p>
        </div>
        
        <div className="space-y-2">
          <Label>Teléfono</Label>
          <p>
            +57 {userData.telefono ? userData.telefono.slice(2) : ""}
          </p>
        </div>
      </CardContent>
      <CardFooter>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button variant="outline">
              <Edit2 className="mr-2 h-4 w-4" /> Editar
            </Button>
          </DialogTrigger>
          <UpdateProfileModal
            email={userData.email}
            telefono={userData.telefono}
            onUpdate={handleUpdate}
            onClose={() => setIsDialogOpen(false)}
          />
        </Dialog>
      </CardFooter>
    </Card>
  );
};

// Componente para mostrar y editar las direcciones del usuario
const AddressesContent = () => {
  const { userData, setUserData } = useContext(CuentaContext);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  if (!userData) {
    return <div>Cargando...</div>;
  }

  const handleUpdate = (newData) => {
    setUserData((prevUserData) => ({
      ...prevUserData,
      ...newData, // Combina el objeto anterior con el nuevo
    }));
  };

  const addresses = userData.direccion ? [userData.direccion] : [];

  return (
    <div className="flex flex-col py-5">
      <Card className="flex-grow">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Direcciones de Envío</span>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
              </DialogTrigger>
              <UpdateAddressModal
                address=""
                onUpdate={handleUpdate}
                onClose={() => setIsDialogOpen(false)}
              />
            </Dialog>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {addresses.length > 0 ? (
            addresses.map((address, index) => (
              <div key={index} className="mb-4 p-4 border rounded-lg">
                <div className="flex items-start justify-between">
                  <div className="flex items-start">
                    <MapPin className="mr-2 h-5 w-5 text-gray-500 mt-1" />
                    <div>
                      <p className="font-medium">Dirección principal</p>
                      <p className="text-sm text-gray-600">{address}</p>
                    </div>
                  </div>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <Edit2 className="h-4 w-4" />
                      </Button>
                    </DialogTrigger>
                    <UpdateAddressModal
                      address={address}
                      onUpdate={handleUpdate}
                      onClose={() => setIsDialogOpen(false)}
                    />
                  </Dialog>
                </div>
              </div>
            ))
          ) : (
            <p className="text-center text-gray-500">
              No has agregado una dirección.
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

// Componente para mostrar los pedidos del usuario
const OrdersContent = () => {
  const { userData } = useContext(CuentaContext);
  const [pedidos, setPedidos] = useState([]);
  const { db: products } = useProducts(); // Traer los productos del contexto

  useEffect(() => {
    const fetchPedidos = async () => {
      try {
        const response = await fetch('http://localhost:3000/pedidos');
        const data = await response.json();
        setPedidos(data);
      } catch (error) {
        console.error("Error al obtener los pedidos:", error);
      }
    };

    fetchPedidos();
  }, []);

  if (!userData) {
    return <div>Cargando...</div>;
  }

  // Función para obtener la URL de la imagen del producto
  const getProductImageByName = (productName) => {
    const product = products.find(p => p.name === productName);
    return product?.imageUrl?.[0] || "https://via.placeholder.com/64"; // URL por defecto si no se encuentra la imagen
  };

  const nombreCompleto = `${userData.name} ${userData.surname}`.replace(/\s+/g, ' ').trim();
  
  const pedidosFiltrados = pedidos.filter(pedido => 
    pedido.cliente.replace(/\s+/g, ' ').trim() === nombreCompleto
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle>Pedidos Recientes</CardTitle>
      </CardHeader>
      <CardContent>
        {pedidosFiltrados.length > 0 ? (
          pedidosFiltrados.map((pedido) => (
            <Card key={pedido.id} className="mb-4">
              <CardHeader>
                <CardTitle>Pedido #{pedido.id}</CardTitle>
              </CardHeader>
              <CardContent>
                <p><strong>Estado:</strong> {pedido.estado}</p>
                <p><strong>Fecha:</strong> {pedido.fecha}</p>
                <p><strong>Total:</strong> ${pedido.total.toLocaleString('es-CO')}</p>
                <div className="mt-4">
                  <strong>Productos:</strong>
                  <div className="mt-2 space-y-4">
                    {pedido.products.map((product, index) => (
                      <div key={index} className="flex items-center space-x-4">
                        <img 
                          src={getProductImageByName(product.name)} 
                          alt={product.name} 
                          className="w-16 h-16 object-cover rounded-md border"
                          loading="lazy"
                        />
                        <div>
                          <p className="font-medium">{product.name}</p>
                          <p className="text-sm text-gray-500">Cantidad: {product.quantity}</p>
                          <p className="text-sm text-gray-500">Precio: ${parseFloat(product.price).toLocaleString('es-CO')}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="mt-4">
                  <strong>Detalles de Envío:</strong>
                  <p><strong>Dirección:</strong> {pedido.shippingDetails?.direccion || "No disponible"}</p>
                  <p><strong>Casa/Apartamento:</strong> {pedido.shippingDetails?.casa || "No disponible"}</p>
                  <p><strong>Teléfono:</strong> {pedido.shippingDetails?.telefono || "No disponible"}</p>
                  <p><strong>Estado:</strong> {pedido.shippingDetails?.state || "No disponible"}</p>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <p>No hay pedidos para mostrar.</p>
        )}
      </CardContent>
    </Card>
  );
};

// Componente principal de la cuenta
export default function Cuenta() {
  return (
    <CuentaProvider>
      <CuentaContent />
    </CuentaProvider>
  );
}

const CuentaContent = () => {
  const { userData } = useContext(CuentaContext); // Obtener userData desde el contexto
  const [activeSection, setActiveSection] = useState('perfil');

  const location = useLocation(); // Para manejar parámetros de consulta
  const navigate = useNavigate(); // Para redirecciones

  // Actualiza activeSection según el parámetro de consulta 'section'
  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const section = queryParams.get("section"); // Obtiene el valor del parámetro `section`
    if (section) {
      setActiveSection(section); // Actualiza la sección activa
    }
  }, [location.search]); // Vuelve a ejecutar el efecto si cambia el query string

  if (!userData || !userData.email) {
    return <div>Cargando...</div>;
  }

  return (
    <div className="min-h-screen bg-background">
      <HeaderCli /> {/* Reemplazamos el header antiguo con el nuevo HeaderCli */}

      <main className="container mx-auto py-6 px-4 flex flex-col md:flex-row">
        <div className="md:w-1/3 mb-6 md:mb-0">
          <h1 className="text-3xl font-bold mb-6">¡Hola, {userData.name}!</h1>

          <nav className="space-y-2">
            <Button
              variant={activeSection === 'perfil' ? "default" : "ghost"}
              className="w-full justify-start text-lg"
              onClick={() => setActiveSection('perfil')}
            >
              <User className="mr-2 h-5 w-5" />
              Perfil
            </Button>
            <Button
              variant={activeSection === 'direcciones' ? "default" : "ghost"}
              className="w-full justify-start text-lg"
              onClick={() => setActiveSection('direcciones')}
            >
              <MapPin className="mr-2 h-5 w-5" />
              Direcciones
            </Button>
            <Button
              variant={activeSection === 'pedidos' ? "default" : "ghost"}
              className="w-full justify-start text-lg"
              onClick={() => setActiveSection('pedidos')}
            >
              <Package className="mr-2 h-5 w-5" />
              Pedidos
            </Button>
          </nav>
        </div>

        <div className="md:w-2/3 md:pl-6">
          {activeSection === 'perfil' && <ProfileContent />}
          {activeSection === 'direcciones' && <AddressesContent />}
          {activeSection === 'pedidos' && <OrdersContent />}
        </div>
      </main>

      <Footer /> {/* Usa el componente Footer importado aquí */}
    </div>
  );
}

export { CuentaProvider };
