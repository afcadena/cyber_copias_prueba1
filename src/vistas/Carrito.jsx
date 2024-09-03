import React, { useState } from "react";
import Logo from "../assets/images/Logo.png";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Menu, FileText, Palette, Book } from "lucide-react";

// Lista de productos de ejemplo
const productos = [
  {
    id: 1,
    nombre: "Camiseta",
    precio: 19.99,
    imagen: "/placeholder.svg?height=100&width=100",
  },
  {
    id: 2,
    nombre: "Pantalón",
    precio: 39.99,
    imagen: "/placeholder.svg?height=100&width=100",
  },
  {
    id: 3,
    nombre: "Zapatos",
    precio: 59.99,
    imagen: "/placeholder.svg?height=100&width=100",
  },
  {
    id: 4,
    nombre: "Gorra",
    precio: 14.99,
    imagen: "/placeholder.svg?height=100&width=100",
  },
];

export default function CarritoDeCompras() {
  const [productosSeleccionados, setProductosSeleccionados] = useState([]);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const toggleProducto = (id) => {
    setProductosSeleccionados((prev) =>
      prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]
    );
  };

  const comprar = () => {
    setIsDialogOpen(true);
  };

  const finalizarCompra = (event) => {
    event.preventDefault();
    // Aquí iría la lógica para procesar la compra
    alert("Compra finalizada con éxito!");
    setIsDialogOpen(false);
    setProductosSeleccionados([]);
  };

  const totalCompra = productosSeleccionados.reduce((total, id) => {
    const producto = productos.find((p) => p.id === id);
    return total + (producto ? producto.precio : 0);
  }, 0);

  return (
    <div className="flex flex-col min-h-screen">
      <header className="flex items-center justify-between p-4 bg-background shadow-md">
        <Button
          variant="ghost"
          size="sm"
          className="flex items-center text-primary"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          <span className="text-sm">Volver</span>
        </Button>
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
          <Link to="#" className="text-foreground hover:text-primary">
            <ShoppingBag className="h-6 w-6" />
          </Link>
        </nav>
        <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon" className="mr-2 md:hidden">
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

      <main className="flex-1 container py-6">
        <h1 className="text-2xl font-bold mb-6">Carrito de Compras</h1>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {productos.map((producto) => (
            <Card key={producto.id}>
              <CardHeader>
                <CardTitle>{producto.nombre}</CardTitle>
              </CardHeader>
              <CardContent>
                <img
                  src={producto.imagen}
                  alt={producto.nombre}
                  className="w-full h-40 object-cover mb-4"
                />
                <p className="text-2xl font-bold">
                  ${producto.precio.toFixed(2)}
                </p>
              </CardContent>
              <CardFooter className="flex justify-between items-center">
                <Checkbox
                  id={`producto-${producto.id}`}
                  checked={productosSeleccionados.includes(producto.id)}
                  onCheckedChange={() => toggleProducto(producto.id)}
                />
                <label
                  htmlFor={`producto-${producto.id}`}
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Seleccionar
                </label>
              </CardFooter>
            </Card>
          ))}
        </div>
      </main>

      <footer className="sticky bottom-0 border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container py-4 flex justify-end">
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button
                onClick={comprar}
                disabled={productosSeleccionados.length === 0}
              >
                Comprar Seleccionados ({productosSeleccionados.length})
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Finalizar Compra</DialogTitle>
                <DialogDescription>
                  Complete los siguientes datos para finalizar su compra.
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={finalizarCompra}>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="name" className="text-right">
                      Nombre
                    </Label>
                    <Input id="name" className="col-span-3" required />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="email" className="text-right">
                      Email
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      className="col-span-3"
                      required
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="address" className="text-right">
                      Dirección
                    </Label>
                    <Input id="address" className="col-span-3" required />
                  </div>
                </div>
                <DialogFooter>
                  <p className="text-lg font-bold mr-auto">
                    Total: ${totalCompra.toFixed(2)}
                  </p>
                  <Button type="submit">Confirmar Compra</Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </footer>
    </div>
  );
}
