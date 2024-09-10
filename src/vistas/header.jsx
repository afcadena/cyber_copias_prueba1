import React from "react";
import { Link } from "react-router-dom";
import { ShoppingCart, Grid, User, ShoppingBag } from "lucide-react";
import Logo from "../assets/images/Logo.png";

export default function Header() {
  return (
    <header className="flex items-center justify-between p-4 bg-background shadow-md">
      <div className="flex items-center">
        <img src={Logo} alt="Logo" className="w-10 h-10 mr-2" />
        <Link to="/" className="text-xl font-bold">
          CyberCopias
        </Link>
      </div>
      <nav className="flex items-center space-x-4">
        <Link to="/catalogo" className="text-foreground hover:text-primary">
          <Grid className="h-6 w-6" />
        </Link>
        <Link to="/login" className="text-foreground hover:text-primary">
          <User className="h-6 w-6" />
        </Link>
        <Link to="/carrito" className="text-foreground hover:text-primary">
          <ShoppingCart className="h-6 w-6" />
        </Link>
      </nav>
    </header>
  );
}
