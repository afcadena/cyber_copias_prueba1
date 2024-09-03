import React from "react";
import Logo from "../assets/images/Logo.png";
import { Link } from "react-router-dom";
import { ArrowLeft, User, MapPin, Package, CreditCard, Tag, Grid, ShoppingCart, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Cuenta() {
  return (
    <div className="min-h-screen bg-background">
      <header className="flex items-center justify-between p-4 bg-background shadow-md">
      <Link to="/">
          <Button
            variant="ghost"
            size="sm"
            className="flex items-center text-primary"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            <span className="text-sm">Volver</span>
          </Button>
        </Link>
        <div className="flex items-center">
          <img src={Logo} alt="Logo" className="w-10 h-10 mr-2" />
          <h1 className="text-xl font-bold">CyberCopias</h1>
        </div>
        <nav className="hidden md:flex space-x-4">
            <Link to="#ofertas" className="text-foreground hover:text-primary">
              <Tag className='h-6 w-6' />
              </Link>
            <Link to="/catalog" className="text-foreground hover:text-primary">
              <Grid  className='h-6 w-6' />
            </Link>
            <Link to="/carrito" className="text-foreground hover:text-primary">
              <ShoppingCart className='h-6 w-6' />
            </Link>
            <Link to="#" className="text-foreground hover:text-primary">
              <ShoppingBag className='h-6 w-6' />
            </Link>
          </nav>
      </header>

      <main className="container py-6">
        <h1 className="text-3xl font-bold mb-6">¡Hola!</h1>

        <nav className="space-y-4">
          <Button variant="ghost" className="w-full justify-start text-lg" asChild>
            <Link to="/perfil" className="flex items-center">
              <User className="mr-2 h-5 w-5" />
              Perfil
            </Link>
          </Button>
          <Button variant="ghost" className="w-full justify-start text-lg" asChild>
            <Link to="/direcciones" className="flex items-center">
              <MapPin className="mr-2 h-5 w-5" />
              Direcciones
            </Link>
          </Button>
          <Button variant="ghost" className="w-full justify-start text-lg" asChild>
            <Link to="/pedidos" className="flex items-center">
              <Package className="mr-2 h-5 w-5" />
              Pedidos
            </Link>
          </Button>
          <Button variant="ghost" className="w-full justify-start text-lg" asChild>
            <Link to="/tarjetas" className="flex items-center">
              <CreditCard className="mr-2 h-5 w-5" />
              Tarjetas de crédito
            </Link>
          </Button>
        </nav>
      </main>
    </div>
  );
}