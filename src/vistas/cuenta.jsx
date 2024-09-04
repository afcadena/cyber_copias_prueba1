import React, { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, User, MapPin, Package, CreditCard, Tag, Grid, ShoppingCart, ShoppingBag } from "lucide-react";
import Logo from "../assets/images/Logo.png";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const ProfileContent = () => (
  <Card>
    <CardHeader>
      <CardTitle>Perfil de Usuario</CardTitle>
    </CardHeader>
    <CardContent>
      <p>Nombre: Juan Pérez</p>
      <p>Email: juan@example.com</p>
      <p>Teléfono: +1234567890</p>
    </CardContent>
  </Card>
);

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

const CardsContent = () => (
  <Card>
    <CardHeader>
      <CardTitle>Metodos de pago</CardTitle>
    </CardHeader>
    <CardContent>
      <Card className="mb-4">
        <CardHeader>
          <CardTitle>Visa</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Número de tarjeta: ************1234</p>
          <p>Fecha de vencimiento: 02/2025</p>
        </CardContent>
      </Card>
      <Card className="mb-4">
        <CardHeader>
          <CardTitle>Mastercard</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Número de tarjeta: ************5678</p>
          <p>Fecha de vencimiento: 08/2026</p>
        </CardContent>
      </Card>
    </CardContent>
  </Card>
);

export default function Cuenta() {
  const [activeSection, setActiveSection] = useState('perfil');
  const orders = [
    { id: 1234, status: 'En camino', date: '2023-02-20', total: 100.00 },
    { id: 5678, status: 'Entregado', date: '2023-02-15', total: 50.00 },
    { id: 9012, status: 'Procesando', date: '2023-02-10', total: 200.00 },
  ];

  return (
    <div className="min-h-screen bg-background">
      <header className="flex items-center justify-between p-4 bg-background border-b">
        <Link to="/">
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
            <Link to="#ofertas" aria-label="Ofertas">
              <Tag className="h-6 w-6" />
            </Link>
          </Button>
          <Button variant="ghost" size="icon" asChild>
            <Link to="/catalog" aria-label="Catálogo">
              <Grid className="h-6 w-6" />
            </Link>
          </Button>
          <Button variant="ghost" size="icon" asChild>
            <Link to="/carrito" aria-label="Carrito">
              <ShoppingCart className="h-6 w-6" />
            </Link>
          </Button>
          <Button variant="ghost" size="icon" asChild>
            <Link to="#" aria-label="Compras">
              <ShoppingBag className="h-6 w-6" />
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
            <Button 
              variant={activeSection === 'tarjetas' ? "default" : "ghost"}
              className="w-full justify-start text-lg"
              onClick={() => setActiveSection('tarjetas')}
            >
              <CreditCard className="mr-2 h-5 w-5" />
              Metodos de pago
            </Button>
          </nav>
        </div>

        <div className="md:w-2/3 md:pl-6">
          {activeSection === 'perfil' && <ProfileContent />}
          {activeSection === 'direcciones' && <AddressesContent />}
          {activeSection === 'pedidos' && <OrdersContent />}
          {activeSection === 'tarjetas' && <CardsContent />}
        </div>
      </main>
    </div>
  );
}