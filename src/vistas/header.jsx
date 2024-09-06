import React from "react";
import { Link } from "react-router-dom";
import { ShoppingCart, Tag, Grid, User, ShoppingBag, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import Logo from "../assets/images/Logo.png";

export default function Header() {
  return (
    <header className="flex items-center justify-between p-4 bg-background shadow-md">
      <div className="flex items-center">
        <img src={Logo} alt="Logo" className="w-10 h-10 mr-2" />
        <Link to="/home" className="text-xl font-bold">
          CyberCopias
        </Link>
      </div>
      <div className="flex-1 max-w-xl mx-4">
        <div className="relative">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input type="search" placeholder="Buscar productos..." className="pl-8 w-full" />
        </div>
      </div>
      <nav className="flex items-center space-x-4">
        <Link to="#ofertas" className="text-foreground hover:text-primary">
          <Tag className="h-6 w-6" />
        </Link>
        <Link to="/catalogo" className="text-foreground hover:text-primary">
          <Grid className="h-6 w-6" />
        </Link>
        <Link to="/login" className="text-foreground hover:text-primary">
          <User className="h-6 w-6" />
        </Link>
        <Link to="/carrito" className="text-foreground hover:text-primary">
          <ShoppingCart className="h-6 w-6" />
        </Link>
        <Link to="#" className="text-foreground hover:text-primary">
          <ShoppingBag className="h-6 w-6" />
        </Link>
      </nav>
    </header>
  );
}
