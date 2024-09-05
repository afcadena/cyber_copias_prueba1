// src/pages/CarritoDeCompras.jsx
import React, { useState } from "react";
import Header from "./header"; // Asegúrate de que la ruta sea correcta
import Footer from "./footer"; // Asegúrate de que la ruta sea correcta
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
      <Header />
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
      <Footer />
    </div>
  );
}
