import React from "react";
import { ArrowLeft, User, MapPin, Package, CreditCard } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Cuenta() {
  return (
    <div className="min-h-screen bg-background">
      <header className="flex items-center justify-between p-4 bg-background shadow-md">
      <Button variant="ghost" size="sm" className="flex items-center text-primary">
          <ArrowLeft className="h-4 w-4 mr-2" />
          <span className="text-sm">Volver</span>
        </Button>
        <div className="flex items-center">
          <img src={Logo} alt="Logo" className="w-10 h-10 mr-2" />
          <h1 className="text-xl font-bold">CyberCopias</h1>
        </div>
        <nav className="hidden md:flex space-x-4">
            <a href="#ofertas" className="text-foreground hover:text-primary">
              <Tag className='h-6 w-6' />
              </a>
            <a href="/catalog" className="text-foreground hover:text-primary">
              <Grid  className='h-6 w-6' />
            </a>
            <a href="/carrito" className="text-foreground hover:text-primary">
              <ShoppingCart className='h-6 w-6' />
            </a>
            <a href="#" className="text-foreground hover:text-primary">
              <ShoppingBag className='h-6 w-6' />
            </a>
          </nav>
      </header>

      <main className="container py-6">
        <h1 className="text-3xl font-bold mb-6">¡Hola!</h1>

        <nav className="space-y-4">
          <Button variant="ghost" className="w-full justify-start text-lg" asChild>
            <a href="/perfil" className="flex items-center">
              <User className="mr-2 h-5 w-5" />
              Perfil
            </a>
          </Button>
          <Button variant="ghost" className="w-full justify-start text-lg" asChild>
            <a href="/direcciones" className="flex items-center">
              <MapPin className="mr-2 h-5 w-5" />
              Direcciones
            </a>
          </Button>
          <Button variant="ghost" className="w-full justify-start text-lg" asChild>
            <a href="/pedidos" className="flex items-center">
              <Package className="mr-2 h-5 w-5" />
              Pedidos
            </a>
          </Button>
          <Button variant="ghost" className="w-full justify-start text-lg" asChild>
            <a href="/tarjetas" className="flex items-center">
              <CreditCard className="mr-2 h-5 w-5" />
              Tarjetas de crédito
            </a>
          </Button>
        </nav>
      </main>
    </div>
  );
}