import React, { useState } from "react";
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

const UpdateProfileModal = ({ email, phone, onUpdate, onClose }) => {
  const [newEmail, setNewEmail] = useState(email);
  const [newPhone, setNewPhone] = useState(phone);

  const handleSubmit = (e) => {
    e.preventDefault();
    onUpdate({ email: newEmail, phone: newPhone });
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

const ProfileContent = () => {
  const [userData, setUserData] = useState({
    name: "Juan Pérez",
    email: "juan@example.com",
    phone: "+1234567890"
  });
  const [isDialogOpen, setIsDialogOpen] = useState(false);

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

const AddressesContent = () => (
  <Card>
    <CardHeader>
      <CardTitle>Direcciones de Envío</CardTitle>
    </CardHeader>
    <CardContent>
      <p>Calle Principal 123</p>
      <p>Ciudad Ejemplo, 12345</p>
      <p>País</p>
    </CardContent>
  </Card>
);

const OrdersContent = () => (
  <Card>
    <CardHeader>
      <CardTitle>Pedidos Recientes</CardTitle>
    </CardHeader>
    <CardContent>
      <Card className="mb-4">
        <CardHeader>
          <CardTitle>Pedido #1234</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Estado: En camino</p>
          <p>Fecha: 2023-02-20</p>
          <p>Total: 100.00</p>
        </CardContent>
      </Card>
      <Card className="mb-4">
        <CardHeader>
          <CardTitle>Pedido #5678</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Estado: Entregado</p>
          <p>Fecha: 2023-02-15</p>
          <p>Total: 50.00</p>
        </CardContent>
      </Card>
      <Card className="mb-4">
        <CardHeader>
          <CardTitle>Pedido #9012</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Estado: Procesando</p>
          <p>Fecha: 2023-02-10</p>
          <p>Total: 200.00</p>
        </CardContent>
      </Card>
    </CardContent>
  </Card>
);

export default function Cuenta() {
  const [activeSection, setActiveSection] = useState('perfil');

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
