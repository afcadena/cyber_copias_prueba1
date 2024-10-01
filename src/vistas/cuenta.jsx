// src/components/Cuenta.jsx

import React, { useState, useEffect, useContext, createContext } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { User, MapPin, Package, Edit } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
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
      });
    }
  }, [currentUser]);

  return (
    <CuentaContext.Provider value={{ userData, setUserData, updateUser }}>
      {children}
    </CuentaContext.Provider>
  );
};

// Modal para actualizar el perfil
const UpdateProfileModal = ({ email, telefono, onUpdate, onClose }) => {
  const { updateUser } = useCrudContextForms();
  const [newEmail, setNewEmail] = useState(email);
  const [newTelefono, setNewTelefono] = useState(telefono);

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Actualizando perfil:", { email: newEmail, telefono: newTelefono }); // Depuración
    await updateUser({ email: newEmail, telefono: newTelefono });
    onClose();
  };

  return (
    <DialogContent className="sm:max-w-[425px]">
      <DialogHeader>
        <DialogTitle>Actualizar perfil</DialogTitle>
      </DialogHeader>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            value={newEmail}
            onChange={(e) => setNewEmail(e.target.value)}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="telefono">Teléfono</Label>
          <Input
            id="telefono"
            value={newTelefono}
            onChange={(e) => setNewTelefono(e.target.value)}
            required
          />
        </div>
        <Button type="submit">Guardar cambios</Button>
      </form>
    </DialogContent>
  );
};

// Modal para actualizar la dirección
const UpdateAddressModal = ({ address, onUpdate, onClose }) => {
  const { updateUser } = useCrudContextForms();
  const [newAddress, setNewAddress] = useState(address);

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Actualizando dirección:", newAddress); // Depuración
    await updateUser({ direccion: newAddress });
    onClose();
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

  if (!userData) {
    return <div>Loading...</div>;
  }

  const handleUpdate = (newData) => {
    setUserData({ ...userData, ...newData });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Perfil de Usuario</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label>Nombre</Label>
          <p>{userData.name}</p>
        </div>
        <div className="space-y-2">
          <Label>Apellido</Label>
          <p>{userData.surname}</p>
        </div>
        <div className="space-y-2">
          <Label>Email</Label>
          <p>{userData.email}</p>
        </div>
        <div className="space-y-2">
          <Label>Teléfono</Label>
          <p>{userData.telefono}</p>
        </div>
      </CardContent>
      <CardFooter>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button variant="outline">
              <Edit className="mr-2 h-4 w-4" /> Editar
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
    return <div>Loading...</div>;
  }

  const handleUpdate = (newData) => {
    setUserData({ ...userData, ...newData });
  };

  console.log("Dirección actual:", userData.direccion); // Depuración

  return (
    <Card>
      <CardHeader>
        <CardTitle>Direcciones de Envío</CardTitle>
      </CardHeader>
      <CardContent>
        <p>{userData.direccion || "No has agregado una dirección."}</p>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button variant="outline">
              <Edit className="mr-2 h-5 w-5" /> Editar
            </Button>
          </DialogTrigger>
          <UpdateAddressModal
            address={userData.direccion}
            onUpdate={handleUpdate}
            onClose={() => setIsDialogOpen(false)}
          />
        </Dialog>
      </CardContent>
    </Card>
  );
};

// Componente para mostrar los pedidos del usuario
const OrdersContent = () => {
  const { userData } = useContext(CuentaContext); // Usamos el contexto para obtener los datos del usuario
  const [pedidos, setPedidos] = useState([]); // Aquí se almacenan los pedidos

  useEffect(() => {
    // Aquí haces una petición a tu API o base de datos para obtener los pedidos
    const fetchPedidos = async () => {
      try {
        const response = await fetch('http://localhost:3000/pedidos'); // Cambia la URL a la de tu API
        const data = await response.json();
        console.log("Pedidos:", data); // Para verificar los pedidos
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

  // Filtrar los pedidos por el cliente autenticado usando nombre completo
  const nombreCompleto = `${userData.name} ${userData.surname}`.replace(/\s+/g, ' ').trim();
  console.log("Nombre Completo para filtrar pedidos:", nombreCompleto); // Depuración

  const pedidosFiltrados = pedidos.filter(pedido => 
    pedido.cliente.replace(/\s+/g, ' ').trim() === nombreCompleto
  );

  console.log("Pedidos Filtrados:", pedidosFiltrados); // Depuración

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
                  <ul className="list-disc list-inside">
                    {pedido.products.map((product, index) => (
                      <li key={index}>
                        {product.name} - Cantidad: {product.quantity}, Precio: ${parseFloat(product.price).toLocaleString('es-CO')}
                      </li>
                    ))}
                  </ul>
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
          <p>No tienes pedidos recientes.</p>
        )}
      </CardContent>
    </Card>
  );
};

// Componente principal de la cuenta
export default function Cuenta() {
  const [activeSection, setActiveSection] = useState('perfil');
  const { currentUser } = useCrudContextForms();
  const [userData, setUserData] = useState({});

  const location = useLocation(); // Para manejar parámetros de consulta
  const navigate = useNavigate(); // Para redirecciones

  useEffect(() => {
    if (currentUser) {
      setUserData({
        name: currentUser.name?.trim() || "",
        surname: currentUser.surname?.trim() || "",
        email: currentUser.email || "",
        telefono: currentUser.telefono || "",
        direccion: currentUser.direccion || ""
      });
    }
  }, [currentUser]);

  // Actualiza activeSection según el parámetro de consulta 'section'
  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const section = queryParams.get("section"); // Obtiene el valor del parámetro `section`
    if (section) {
      setActiveSection(section); // Actualiza la sección activa
    }
  }, [location.search]); // Vuelve a ejecutar el efecto si cambia el query string

  return (
    <CuentaProvider>
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
    </CuentaProvider>
  );
}

export { CuentaProvider };
