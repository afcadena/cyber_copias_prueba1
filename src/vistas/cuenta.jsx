import React, { useState, useEffect, useContext, createContext } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, User, MapPin, Package, Grid, ShoppingCart, Edit } from "lucide-react";
import Logo from "../assets/images/Logo.png";
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
import Footer from "./footer"; // Importa el footer desde el archivo Footer.jsx
import { useCrudContextForms } from '../context/CrudContextForms';

const CuentaContext = createContext();

const CuentaProvider = ({ children }) => {
  const { currentUser, updateUserAddress } = useCrudContextForms(); // Add this line
  const [userData, setUserData] = useState({}); // Initialize userData with an empty object

  // Update userData when the currentUser changes
  useEffect(() => {
    if (currentUser) {
      setUserData(currentUser);
    }
  }, [currentUser]);

    return (
    <CuentaContext.Provider value={{ userData, setUserData, updateUserAddress }}>
      {children}
    </CuentaContext.Provider>
  );
};

const UpdateProfileModal = ({ email, phone, onUpdate, onClose }) => {
  const { currentUser, updateUser } = useCrudContextForms();
  const [newEmail, setNewEmail] = useState(email);
  const [newPhone, setNewPhone] = useState(phone);

  const handleSubmit = (e) => {
    e.preventDefault();
    updateUser({ email: newEmail, phone: newPhone });
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
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="phone">Teléfono</Label>
          <Input
            id="phone"
            value={newPhone}
            onChange={(e) => setNewPhone(e.target.value)}
          />
        </div>
        <Button type="submit">Guardar cambios</Button>
      </form>
    </DialogContent>
  );
};

const UpdateAddressModal = ({ address, onUpdate, onClose }) => {
  const { currentUser, updateUser } = useCrudContextForms();
  const [newAddress, setNewAddress] = useState(address);

  const handleSubmit = (e) => {
    e.preventDefault();
    updateUser({ direccion: newAddress });
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
          />
        </div>
        <Button type="submit">Guardar cambios</Button>
      </form>
    </DialogContent>
  );
};

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
          <Label>Email</Label>
          <p>{userData.email}</p>
        </div>
        <div className="space-y-2">
          <Label>Teléfono</Label>
          <p>{userData.phone}</p>
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
            phone={userData.phone}
            onUpdate={handleUpdate}
            onClose={() => setIsDialogOpen(false)}
          />
        </Dialog>
      </CardFooter>
    </Card>
  );
};

const AddressesContent = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { userData, setUserData } = useContext(CuentaContext);

  if (!userData) {
    return <div>Loading...</div>;
  }

  const handleUpdate = (newData) => {
    setUserData({ ...userData, ...newData });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Direcciones de Envío</CardTitle>
      </CardHeader>
      <CardContent>
        <p>{userData.direccion}</p>
        <Button variant="outline" onClick={() => setIsDialogOpen(true)}>
          <Edit className="mr-2 h-5 w-5" /> Editar
        </Button>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button variant="ghost">Cerrar</Button>
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

const OrdersContent = () => {
  const { currentUser } = useCrudContextForms(); // Usamos el contexto para obtener el usuario actual
  const [pedidos, setPedidos] = useState([]); // Aquí se almacenan los pedidos

  useEffect(() => {
    // Aquí puedes hacer una petición a tu API o base de datos para obtener los pedidos
    const fetchPedidos = async () => {
      try {
        const response = await fetch('http://localhost:3000/pedidos'); // Cambia la URL a la de tu API
        const data = await response.json();
        setPedidos(data);
      } catch (error) {
        console.error("Error al obtener los pedidos:", error);
      }
    };

    fetchPedidos();
  }, []);

  // Filtrar los pedidos por el cliente autenticado
  const pedidosFiltrados = pedidos.filter(pedido => pedido.cliente === currentUser.name);

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
                <p>Estado: {pedido.estado}</p>
                <p>Fecha: {pedido.fecha}</p>
                <p>Total: ${pedido.total}</p>
                <div className="mt-4">
                  <strong>Productos:</strong>
                  <ul className="list-disc list-inside">
                    {pedido.products.map((product, index) => (
                      <li key={index}>
                        {product.name} - Cantidad: {product.quantity}, Precio: ${product.price}
                      </li>
                    ))}
                  </ul>
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
export default function Cuenta() {
  const [activeSection, setActiveSection] = useState('perfil');
  const { currentUser } = useCrudContextForms();
  const [userData, setUserData] = useState({});

  useEffect(() => {
    if (currentUser) {
      setUserData(currentUser);
    }
  }, [currentUser]);

  return (
    <div className="min-h-screen bg-background">
      <header className="flex items-center justify-between p-4 bg-background border-b">
        <Link to="/homecli">
          <Button variant="ghost" size="sm" className="flex items-center text-primary">
            <ArrowLeft className="h-4 w-4 mr-2" />
            <span className="text-sm">Volver</span>
          </Button>
        </Link>
        <div className="flex items-center">
          <img src={Logo} alt="Logo" className="w-10 h-10 mr-2" />
          <h1 className="text-xl font-bold">CyberCopias</h1>
        </div>
        <nav className="hidden md:flex space-x-4">
          <Button variant="ghost" size="icon" asChild>
            <Link to="/catalogo" aria-label="Catálogo">
              <Grid className="h-6 w-6" />
            </Link>
          </Button>
          <Button variant="ghost" size="icon" asChild>
            <Link to="/carrito" aria-label="Carrito">
              <ShoppingCart className="h-6 w-6" />
            </Link>
          </Button>
        </nav>
      </header>

      <main className="container mx-auto py-6 px-4 flex flex-col md:flex-row">
        <div className="md:w-1/3 mb-6 md:mb-0">
          <h1 className="text-3xl font-bold mb-6">¡Hola!</h1>

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