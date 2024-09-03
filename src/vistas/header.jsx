import React, { useState } from "react";
import Logo from "../assets/images/Logo.png";
import { Link } from "react-router-dom";
import {
  Menu,
  ShoppingCart,
  FileText,
  Palette,
  Book,
  Tag,
  Grid,
  User,
  ShoppingBag,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

export default function Component() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className="flex flex-col min-h-screen">
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
            <Tag className="h-6 w-6" />
          </Link>
          <Link to="/catalogo" className="text-foreground hover:text-primary">
            <Grid className="h-6 w-6" />
          </Link>
          <Link to="#" className="text-foreground hover:text-primary">
            <User className="h-6 w-6" />
          </Link>
          <Link to="/carrito" className="text-foreground hover:text-primary">
            <ShoppingCart className="h-6 w-6" />
          </Link>
          <Link to="#" className="text-foreground hover:text-primary">
            <ShoppingBag className="h-6 w-6" />
          </Link>
        </nav>
        <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon" className="mr-2">
              <Menu className="h-6 w-6" />
              <span className="sr-only">Toggle menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="right">
            <SheetHeader>
              <SheetTitle>Menú</SheetTitle>
              <SheetDescription>Explora nuestras categorías</SheetDescription>
            </SheetHeader>
            <div className="grid gap-4 py-4">
              <Button variant="ghost" className="w-full justify-start">
                <FileText className="mr-2 h-4 w-4" />
                Libros de dibujo
              </Button>
              <Button variant="ghost" className="w-full justify-start">
                <Palette className="mr-2 h-4 w-4" />
                Arte y manualidades
              </Button>
              <Button variant="ghost" className="w-full justify-start">
                <Book className="mr-2 h-4 w-4" />
                Cuadernos
              </Button>
            </div>
          </SheetContent>
        </Sheet>
      </header>
    </div>
  );
}
