import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Package, Trash2, Edit2, Search, ShoppingBag, Truck, CheckCircle, Eye } from 'lucide-react';
import { useCrudContextPedidos } from "../context/CrudContextPedidos";
import { useProducts } from "../context/CrudContextInventario";

export default function GestionPedidos() {
  const { db: pedidos, updateData, deleteData, error, loading } = useCrudContextPedidos();
  const { db: products } = useProducts();

  const [searchTerm, setSearchTerm] = useState('');
  const [isEditStatusOpen, setIsEditStatusOpen] = useState(false);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [currentPedido, setCurrentPedido] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newEstado, setNewEstado] = useState('');

  const handleDeletePedido = (pedido) => {
    setCurrentPedido(pedido);
    setIsDeleteConfirmOpen(true);
  };

  const confirmDeletePedido = () => {
    if (currentPedido) {
      deleteData(currentPedido.id);
      setIsDeleteConfirmOpen(false);
      setCurrentPedido(null);
    }
  };

  const handleEditStatus = (pedido) => {
    setCurrentPedido(pedido);
    setNewEstado(pedido.estado);
    setIsEditStatusOpen(true);
  };

  const handleStatusUpdate = (event) => {
    event.preventDefault();
    const updatedPedido = {
      ...currentPedido,
      estado: newEstado
    };
    updateData(updatedPedido);
    setIsEditStatusOpen(false);
    setCurrentPedido(null);
    setNewEstado('');
  };

  const handleViewMore = (pedido) => {
    setCurrentPedido(pedido);
    setIsModalOpen(true);
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
    return product?.imageUrl?.[0] || "/placeholder.svg?height=64&width=64";
  };

  const formatPhoneNumber = (phoneNumber) => {
    if (phoneNumber.startsWith('57')) {
      return phoneNumber.slice(2);
    }
    return phoneNumber;
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Pendiente':
        return <ShoppingBag className="h-5 w-5 text-yellow-500" />;
      case 'En preparación':
        return <Package className="h-5 w-5 text-blue-500" />;
      case 'Enviado':
        return <Truck className="h-5 w-5 text-purple-500" />;
      case 'Entregado':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      default:
        return null;
    }
  };
  
  return (
    <div className="container mx-auto p-6 space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold flex items-center">
          <ShoppingBag className="mr-2 h-8 w-8" />
          Gestión de Pedidos
        </h1>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <Input 
            className="pl-10 pr-4 py-2 w-64" 
            placeholder="Buscar pedidos..." 
            value={searchTerm} 
            onChange={(e) => setSearchTerm(e.target.value)} 
          />
        </div>
      </div>

      {error && <p className="text-red-500 bg-red-100 p-4 rounded-md">Hubo un error: {error.statusText}</p>}
      {loading && <p className="text-blue-500 bg-blue-100 p-4 rounded-md">Cargando pedidos...</p>}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredPedidos.length > 0 ? (
          filteredPedidos.map((pedido) => (
            <Card key={pedido.id} className="overflow-hidden flex flex-col shadow-md hover:shadow-lg transition-shadow duration-300">
              <CardHeader className="bg-primary text-primary-foreground">
                <CardTitle className="flex justify-between items-center">
                  <span>Pedido #{pedido.id}</span>
                  {getStatusIcon(pedido.estado)}
                </CardTitle>
                <CardDescription className="text-primary-foreground/80">{pedido.fecha}</CardDescription>
              </CardHeader>

              <CardContent className="flex-grow pt-6 space-y-2">
                <p className="flex justify-between"><span className="font-semibold">Cliente:</span> {pedido.cliente}</p>
                <p className="flex justify-between"><span className="font-semibold">Estado:</span> {pedido.estado}</p>
                <p className="flex justify-between"><span className="font-semibold">Total:</span> ${parseFloat(pedido.total || 0).toFixed(2)}</p>
              </CardContent>

              <CardFooter className="bg-muted mt-auto p-4">
                <div className="flex justify-between w-full">
                  <Button variant="outline" size="sm" onClick={() => handleEditStatus(pedido)}>
                    <Edit2 className="mr-2 h-4 w-4" /> Editar
                  </Button>
                  <Button variant="secondary" size="sm" onClick={() => handleViewMore(pedido)}>
                    <Eye className="mr-2 h-4 w-4" /> Ver más
                  </Button>
                  <Button variant="destructive" size="sm" onClick={() => handleDeletePedido(pedido)}>
                    <Trash2 className="mr-2 h-4 w-4" /> Cancelar
                  </Button>
                </div>
              </CardFooter>
            </Card>
          ))
        ) : (
          <p className="col-span-full text-center text-muted-foreground">No hay pedidos que mostrar.</p>
        )}
      </div>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-2xl">Detalles del Pedido #{currentPedido?.id}</DialogTitle>
          </DialogHeader>
          {currentPedido && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="font-semibold">Cliente:</p>
                  <p>{currentPedido.cliente}</p>
                </div>
                <div>
                  <p className="font-semibold">Estado:</p>
                  <p className="flex items-center">
                    {getStatusIcon(currentPedido.estado)}
                    <span className="ml-2">{currentPedido.estado}</span>
                  </p>
                </div>
                <div>
                  <p className="font-semibold">Total:</p>
                  <p>${parseFloat(currentPedido.total || 0).toFixed(2)}</p>
                </div>
                <div>
                  <p className="font-semibold">Fecha:</p>
                  <p>{new Date(currentPedido.fecha).toLocaleDateString()}</p>
                </div>
              </div>
              
              {currentPedido.shippingDetails && (
                <div className="border-t pt-4">
                  <h3 className="font-semibold mb-2">Detalles de Envío:</h3>
                  <p><span className="font-medium">Dirección:</span> {currentPedido.shippingDetails.direccion}</p>
                  <p><span className="font-medium">Teléfono:</span> {formatPhoneNumber(currentPedido.shippingDetails.telefono)}</p>
                  <p><span className="font-medium">Casa:</span> {currentPedido.shippingDetails.casa}</p>
                </div>
              )}

              <div className="border-t pt-4">
                <h3 className="font-semibold mb-2">Productos:</h3>
                <div className="space-y-4">
                  {currentPedido.products?.map((product, index) => (
                    <div key={index} className="flex items-center space-x-4 bg-muted p-2 rounded-md">
                      <img 
                        src={getProductImageByName(product.name)} 
                        alt={product.name} 
                        className="w-16 h-16 object-cover rounded-md border"
                        loading="lazy"
                      />
                      <div className="flex-grow">
                        <p className="font-medium">{product.name}</p>
                        <p className="text-sm text-muted-foreground">Cantidad: {product.quantity}</p>
                        <p className="text-sm text-muted-foreground">Precio: ${parseFloat(product.price || 0).toFixed(2)}</p>
                      </div>
                      <p className="font-semibold">${(product.quantity * parseFloat(product.price || 0)).toFixed(2)}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={isEditStatusOpen} onOpenChange={setIsEditStatusOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Editar Estado del Pedido #{currentPedido?.id}</DialogTitle>
          </DialogHeader>
          {currentPedido && (
            <form onSubmit={handleStatusUpdate} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="estado">Estado</Label>
                <Select value={newEstado} onValueChange={setNewEstado}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Selecciona un estado" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Pendiente">Pendiente</SelectItem>
                    <SelectItem value="En preparación">En preparación</SelectItem>
                    <SelectItem value="Enviado">Enviado</SelectItem>
                    <SelectItem value="Entregado">Entregado</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button type="submit" className="w-full">Actualizar Estado</Button>
            </form>
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={isDeleteConfirmOpen} onOpenChange={setIsDeleteConfirmOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmar Cancelación de Pedido</DialogTitle>
            <DialogDescription>
              ¿Estás seguro de que deseas cancelar el pedido #{currentPedido?.id}? Esta acción no se puede deshacer.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteConfirmOpen(false)}>
              Cancelar
            </Button>
            <Button variant="destructive" onClick={confirmDeletePedido}>
              Confirmar Cancelación
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}