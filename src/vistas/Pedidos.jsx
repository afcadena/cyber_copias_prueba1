// src/components/GestionPedidos.jsx

import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Package, Trash2, Search } from 'lucide-react'; // Eliminado 'Edit' y 'Plus'
import { useCrudContextPedidos } from "../context/CrudContextPedidos";

export default function GestionPedidos() {
  const { db: pedidos, deleteData, error, loading } = useCrudContextPedidos();

  const [searchTerm, setSearchTerm] = useState('');
  
  // Función para manejar la eliminación de un pedido con confirmación
  const handleDeletePedido = (pedido) => {
    const confirm = window.confirm(`¿Estás seguro de que deseas cancelar el pedido #${pedido.id}?`);
    if (confirm) {
      deleteData(pedido.id);
    }
  };

  // Función para filtrar pedidos según el término de búsqueda
  const filterPedidos = (pedido) => {
    const lowercasedSearchTerm = searchTerm.toLowerCase();
    return Object.values(pedido).some(value =>
      typeof value === 'string' && value.toLowerCase().includes(lowercasedSearchTerm)
    );
  };

  const filteredPedidos = pedidos.filter(filterPedidos);

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Gestión de Pedidos</h1>
        <div className="flex items-center space-x-4">
          <div className="relative">
            <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <Input 
              className="pl-8" 
              placeholder="Buscar pedidos..." 
              value={searchTerm} 
              onChange={(e) => setSearchTerm(e.target.value)} 
            />
          </div>
          {/* Botón "Nuevo Pedido" eliminado */}
        </div>
      </div>

      {error && <p className="text-red-500">Hubo un error: {error.statusText}</p>}
      {loading && <p>Cargando pedidos...</p>}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredPedidos.length > 0 ? (
          filteredPedidos.map((pedido) => (
            <Card key={pedido.id} className="overflow-hidden flex flex-col">
              <CardHeader className="bg-primary text-primary-foreground">
                <CardTitle className="flex justify-between items-center">
                  <span>Pedido #{pedido.id}</span>
                  <Package className="h-6 w-6" />
                </CardTitle>
                <CardDescription className="text-primary-foreground/80">{pedido.fecha}</CardDescription>
              </CardHeader>
              <CardContent className="flex-1 pt-6">
                <p><strong>Cliente:</strong> {pedido.cliente}</p>
                <p><strong>Estado:</strong> {pedido.estado}</p>
                <p><strong>Total:</strong> ${pedido.total.toFixed(2)}</p>
                <div className="mt-4">
                  <strong>Productos:</strong>
                  <ul className="list-disc list-inside">
                    {pedido.products && pedido.products.map((product, index) => (
                      <li key={index}>
                        {product.name} - Cantidad: {product.quantity}, Precio: ${parseFloat(product.price || 0).toFixed(2)}
                      </li>
                    ))}
                  </ul>
                </div>
              </CardContent>
              <CardFooter className="bg-muted mt-auto">
                <div className="flex justify-end w-full">
                  {/* Botón "Editar Estado" eliminado */}
                  <Button 
                    variant="destructive" 
                    size="sm" 
                    onClick={() => handleDeletePedido(pedido)}
                  >
                    <Trash2 className="mr-2 h-4 w-4" /> Cancelar Pedido
                  </Button>
                </div>
              </CardFooter>
            </Card>
          ))
        ) : (
          <p className="col-span-full text-center text-gray-500">No hay pedidos que mostrar.</p>
        )}
      </div>

      {/* Modal para Crear/Editar Pedido eliminado */}
      {/* Modal para Editar Estado del Pedido eliminado */}
      {/* Modal de Confirmación para Cancelar Pedido eliminado */}
    </div>
  );
}
