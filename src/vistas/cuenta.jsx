import React, { useState, useEffect, useContext, createContext } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { User, MapPin, Package, Edit2 } from "lucide-react";
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
import HeaderCli from './headercli';
import axios from 'axios';
import { useProducts } from "../context/CrudContextInventario";

const CuentaContext = createContext();

const CuentaProvider = ({ children }) => {
  const { currentUser, updateUser, refreshUser } = useCrudContextForms();
  const [userData, setUserData] = useState({});

  useEffect(() => {
    if (currentUser) {
      setUserData({
        ...currentUser,
        name: currentUser.name ? currentUser.name.trim() : "",
        surname: currentUser.surname ? currentUser.surname.trim() : "",
      });
    }
  }, [currentUser]);

  const updateUserData = async (newData) => {
    try {
      const updatedUser = await updateUser(currentUser._id, newData);
      if (updatedUser) {
        setUserData(prevData => ({ ...prevData, ...newData }));
        await refreshUser();
      }
    } catch (error) {
      console.error("Error updating user data:", error);
      throw error;
    }
  };

  return (
    <CuentaContext.Provider value={{ userData, setUserData, updateUserData }}>
      {children}
    </CuentaContext.Provider>
  );
};

const UpdateProfileModal = ({ onClose }) => {
  const { userData, updateUserData } = useContext(CuentaContext);
  const [newEmail, setNewEmail] = useState(userData.email || '');
  const [newTelefono, setNewTelefono] = useState(userData.telefono || '');
  const [phoneError, setPhoneError] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);

  const validatePhone = (phone) => {
    const regex = /^57\d{10}$/;
    return regex.test(phone);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validatePhone(newTelefono)) {
      setPhoneError("El teléfono debe comenzar con '57' y tener exactamente 12 dígitos.");
      return;
    }

    setIsUpdating(true);
    try {
      await updateUserData({
        email: newEmail,
        telefono: newTelefono,
      });
      onClose();
    } catch (error) {
      console.error("Error updating user:", error);
      // Mostrar mensaje de error al usuario
    } finally {
      setIsUpdating(false);
    }
  };

  const handlePhoneChange = (e) => {
    const value = e.target.value;
    if (/^\d*$/.test(value)) {
      setNewTelefono(value.startsWith('57') ? value : `57${value}`);
      setPhoneError(validatePhone(value) ? "" : "El teléfono debe comenzar con '57' y tener exactamente 12 dígitos.");
    }
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
            type="email"
            value={newEmail}
            onChange={(e) => setNewEmail(e.target.value)}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="telefono">Teléfono</Label>
          <Input
            id="telefono"
            type="text"
            value={newTelefono}
            onChange={handlePhoneChange}
            required
            maxLength={12}
            placeholder="Ej: 573123456789"
            className={phoneError ? "input-error" : ""}
          />
          {phoneError && <p className="text-red-500 text-sm">{phoneError}</p>}
        </div>
        <Button type="submit" disabled={isUpdating || phoneError !== "" || newTelefono.length !== 12}>
          {isUpdating ? "Actualizando..." : "Guardar cambios"}
        </Button>
      </form>
    </DialogContent>
  );
};

const UpdateAddressModal = ({ onClose }) => {
  const { userData, updateUserData } = useContext(CuentaContext);
  const [newAddress, setNewAddress] = useState(userData.direccion || '');
  const [isUpdating, setIsUpdating] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsUpdating(true);
    try {
      await updateUserData({ direccion: newAddress });
      onClose();
    } catch (error) {
      console.error("Error updating address:", error);
      // Mostrar mensaje de error al usuario
    } finally {
      setIsUpdating(false);
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
        <Button type="submit" disabled={isUpdating}>
          {isUpdating ? "Actualizando..." : "Guardar cambios"}
        </Button>
      </form>
    </DialogContent>
  );
};

const ProfileContent = () => {
  const { userData } = useContext(CuentaContext);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  if (!userData || !userData.email) {
    return <div>Cargando...</div>;
  }

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
          <p>{userData.telefono || "No disponible"}</p>
        </div>
      </CardContent>
      <CardFooter>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button variant="outline">
              <Edit2 className="mr-2 h-4 w-4" /> Editar
            </Button>
          </DialogTrigger>
          <UpdateProfileModal onClose={() => setIsDialogOpen(false)} />
        </Dialog>
      </CardFooter>
    </Card>
  );
};

const AddressesContent = () => {
  const { userData } = useContext(CuentaContext);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  if (!userData) {
    return <div>Cargando...</div>;
  }

  const addresses = userData.direccion ? [userData.direccion] : [];

  return (
    <div className="flex flex-col py-5">
      <Card className="flex-grow">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Direcciones de Envío</span>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="outline">
                  <Edit2 className="mr-2 h-4 w-4" /> {addresses.length > 0 ? "Editar dirección" : "Agregar dirección"}
                </Button>
              </DialogTrigger>
              <UpdateAddressModal onClose={() => setIsDialogOpen(false)} />
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

const OrdersContent = () => {
  const { userData } = useContext(CuentaContext);
  const [pedidos, setPedidos] = useState([]);
  const { db: products } = useProducts();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchPedidos = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get('http://localhost:4000/api/pedidos');
        setPedidos(response.data);
      } catch (error) {
        console.error("Error al obtener los pedidos:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (userData && userData.email) {
      fetchPedidos();
    }
  }, [userData]);

  if (isLoading) {
    return <div>Cargando pedidos...</div>;
  }

  if (!userData) {
    return <div>Cargando información del usuario...</div>;
  }

  const getProductImageByName = (productName) => {
    const product = products.find(p => p.name === productName);
    return product?.imageUrl?.[0] || "https://via.placeholder.com/64";
  };

  const pedidosFiltrados = pedidos.filter(pedido => 
    pedido.cliente === userData.email
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle>Pedidos Recientes</CardTitle>
      </CardHeader>
      <CardContent>
        {pedidosFiltrados.length > 0 ? (
          pedidosFiltrados.map((pedido) => (
            <Card key={pedido._id} className="mb-4">
              <CardHeader>
                <CardTitle>Pedido #{pedido._id}</CardTitle>
              </CardHeader>
              <CardContent>
                <p><strong>Estado:</strong> {pedido.estado}</p>
                <p><strong>Fecha:</strong> {new Date(pedido.fecha).toLocaleDateString("es-CO")}</p>
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
                  <p><strong>Estado de Envío:</strong> {pedido.shippingDetails?.state || "No disponible"}</p>
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

const CuentaContent = () => {
  const { userData } = useContext(CuentaContext);
  const [activeSection, setActiveSection] = useState('perfil');
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const section = queryParams.get("section");
    if (section) {
      setActiveSection(section);
    }
  }, [location.search]);

  if (!userData || !userData.email) {
    return <div>Cargando...</div>;
  }

  return (
    <div className="min-h-screen bg-background">
      <HeaderCli />
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
      <Footer />
    </div>
  );
};

export default function Cuenta() {
  return (
    <CuentaProvider>
      <CuentaContent />
    </CuentaProvider>
  );
}

export { CuentaProvider };