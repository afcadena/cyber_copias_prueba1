// src/components/GestionPedidos.jsx
import React, { useState, useEffect } from 'react'; // Asegúrate de importar useEffect
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Package, Trash2, Edit2, Search } from 'lucide-react';
import { useCrudContextPedidos } from "../context/CrudContextPedidos";
import { useProducts } from "../context/CrudContextInventario";

export default function GestionPedidos() {
  const { db: pedidos, updateData, deleteData, error, loading } = useCrudContextPedidos();
  const { db: products, loading: loadingProducts } = useProducts();

  const [searchTerm, setSearchTerm] = useState('');
  const [isEditStatusOpen, setIsEditStatusOpen] = useState(false);
  const [currentPedido, setCurrentPedido] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newEstado, setNewEstado] = useState(''); // Estado para el nuevo estado

  const handleDeletePedido = (pedido) => {
    const confirmDelete = window.confirm(`¿Estás seguro de que deseas cancelar el pedido #${pedido.id}?`);
    if (confirmDelete) {
      deleteData(pedido.id);
    }
  };

  const handleEditStatus = (pedido) => {
    setCurrentPedido(pedido);
    setNewEstado(pedido.estado); // Establecer el estado actual
    setIsEditStatusOpen(true);
  };

  const handleStatusUpdate = (event) => {
    event.preventDefault();
    const updatedPedido = {
      ...currentPedido,
      estado: newEstado // Usar el nuevo estado
    };
    updateData(updatedPedido);
    setIsEditStatusOpen(false);
    setCurrentPedido(null);
    setNewEstado(''); // Resetear el estado
  };

  const filterPedidos = (pedido) => {
    const lowercasedSearchTerm = searchTerm.toLowerCase();
    return Object.values(pedido).some(value =>
      typeof value === 'string' && value.toLowerCase().includes(lowercasedSearchTerm)
    );
  };

  const filteredPedidos = pedidos.filter(filterPedidos);

  const getProductImageByName = (productName) => {
    const product = products.find(p => p.name === productName);
    if (product && product.imageUrl && product.imageUrl.length > 0) {
      return product.imageUrl[0];
    }
    return "https://via.placeholder.com/64";
  };

  const openModal = (pedido) => {
    setCurrentPedido(pedido);
    setIsModalOpen(true);
  };

  return (
    <div className="container mx-auto p-4">
      {/* Encabezado */}
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
        </div>
      </div>

      {error && <p className="text-red-500">Hubo un error: {error.statusText}</p>}
      {loading && <p>Cargando pedidos...</p>}

      {/* Lista de Pedidos */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredPedidos.length > 0 ? (
          filteredPedidos.map((pedido) => (
            <Card key={pedido.id} className="overflow-hidden flex flex-col shadow-md">
              <CardHeader className="bg-primary text-primary-foreground">
                <CardTitle className="flex justify-between items-center">
                  <span>Pedido #{pedido.id}</span>
                  <Package className="h-6 w-6" />
                </CardTitle>
                <CardDescription className="text-primary-foreground/80">{pedido.fecha}</CardDescription>
              </CardHeader>

              <CardContent className="flex-grow pt-6 max-h-40 overflow-y-auto">
                <p><strong>Cliente:</strong> {pedido.cliente}</p>
                <p><strong>Estado:</strong> {pedido.estado}</p>
                <p><strong>Total:</strong> ${parseFloat(pedido.total || 0).toFixed(2)}</p>

                {/* Lista de Productos */}
                <div className="mt-4">
                  <strong>Productos:</strong>
                  <div className="mt-2 space-y-4">
                    {pedido.products && pedido.products.map((product, index) => (
                      <div key={index} className="flex items-center space-x-4">
                        <img 
                          src={getProductImageByName(product.name)} 
                          alt={product.name} 
                          className="w-16 h-16 object-cover rounded-md border"
                          loading="lazy"
                        />
                        <div>
                          <p className="font-medium">{product.name}</p>
                          <p className="text-sm text-gray-500">Cantidad: {product.quantity}</p>
                          <p className="text-sm text-gray-500">Precio: ${parseFloat(product.price || 0).toFixed(2)}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>

              <CardFooter className="bg-muted mt-auto">
                <div className="flex justify-end w-full space-x-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => handleEditStatus(pedido)}
                  >
                    <Edit2 className="mr-2 h-4 w-4" /> Editar Estado
                  </Button>
                  <Button 
                    variant="secondary" 
                    size="sm" 
                    onClick={() => openModal(pedido)}
                  >
                    Ver más
                  </Button>
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

  
{/* Modal para mostrar más detalles del pedido */}
<Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
    <DialogContent className="max-w-md"> {/* Ajustar el ancho del modal */}
        <DialogHeader>
            <DialogTitle>Detalles del Pedido #{currentPedido?.id}</DialogTitle>
        </DialogHeader>
        {currentPedido && (
            <div>
                <p><strong>Cliente:</strong> {currentPedido.cliente}</p>
                <p><strong>Estado:</strong> {currentPedido.estado}</p>
                <p><strong>Total:</strong> ${parseFloat(currentPedido.total || 0).toFixed(2)}</p>
                <div className="mt-4">
                    <strong>Productos:</strong>
                    <div className="mt-2 space-y-4">
                        {currentPedido.products && currentPedido.products.map((product, index) => (
                            <div key={index} className="flex items-center space-x-4">
                                <img 
                                    src={getProductImageByName(product.name)} 
                                    alt={product.name} 
                                    className="w-16 h-16 object-cover rounded-md border"
                                    loading="lazy"
                                />
                                <div>
                                    <p className="font-medium">{product.name}</p>
                                    <p className="text-sm text-gray-500">Cantidad: {product.quantity}</p>
                                    <p className="text-sm text-gray-500">Precio: ${parseFloat(product.price || 0).toFixed(2)}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        )}
    </DialogContent>
</Dialog>

    {/* Modal para editar estado del pedido */}
<Dialog open={isEditStatusOpen} onOpenChange={setIsEditStatusOpen}>
    <DialogContent className="max-w-md"> {/* Ajustar el ancho del modal */}
        <DialogHeader>
            <DialogTitle>Editar Estado del Pedido #{currentPedido?.id}</DialogTitle>
        </DialogHeader>
        {currentPedido && (
            <form onSubmit={handleStatusUpdate}>
                <div className="space-y-4">
                    <div>
                        <Label htmlFor="estado">Estado</Label>
                        <Select value={newEstado} onValueChange={setNewEstado}>
                            <SelectTrigger>
                                <SelectValue placeholder="Seleccionar estado" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="Pendiente">Pendiente</SelectItem>
                                <SelectItem value="En Proceso">En Proceso</SelectItem>
                                <SelectItem value="Completado">Completado</SelectItem>
                                <SelectItem value="Cancelado">Cancelado</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <Button type="submit">Actualizar Estado</Button>
                </div>
            </form>
        )}
    </DialogContent>
</Dialog>
    </div>
  );
}
