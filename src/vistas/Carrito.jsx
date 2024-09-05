import React from "react";
import Header from "./header";
import Footer from "./footer";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useCart } from "../context/CartContext";  // Importar el contexto del carrito

export default function CarritoDeCompras() {
  const { cart, removeFromCart } = useCart();  // Obtener el carrito y la función para eliminar productos

  const totalCompra = cart.reduce((total, producto) => {
    const price = parseFloat(producto.price) || 0;  // Asegurarse de que el precio sea numérico
    return total + price;
  }, 0);

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 container py-6">
        <h1 className="text-2xl font-bold mb-6">Carrito de Compras</h1>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {cart.length > 0 ? (
            cart.map((producto) => {
              const price = parseFloat(producto.price) || 0;  // Asegurarse de que el precio sea numérico

              return (
                <Card key={producto.id}>
                  <CardHeader>
                    <CardTitle>{producto.name}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <img
                      src={producto.image}
                      alt={producto.name}
                      className="w-full h-40 object-cover mb-4"
                    />
                    <p className="text-2xl font-bold">
                      ${price.toFixed(2)}  {/* Aplicar toFixed solo si es un número */}
                    </p>
                  </CardContent>
                  <CardFooter className="flex justify-between items-center">
                    <Button
                      variant="outline"
                      onClick={() => removeFromCart(producto.id)}  // Eliminar producto del carrito
                    >
                      Eliminar
                    </Button>
                  </CardFooter>
                </Card>
              );
            })
          ) : (
            <p>No hay productos en el carrito.</p>
          )}
        </div>
      </main>

      <footer className="sticky bottom-0 border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container py-4 flex justify-end">
          <p className="text-lg font-bold mr-auto">Total: ${totalCompra.toFixed(2)}</p>
          <Button disabled={cart.length === 0}>Finalizar Compra</Button>
        </div>
      </footer>
      <Footer />
    </div>
  );
}
