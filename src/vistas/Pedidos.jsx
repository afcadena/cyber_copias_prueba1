import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Package, Trash2, Edit2, Search, ShoppingBag, Truck, CheckCircle, Eye, ChevronLeft, ChevronRight, Calendar } from 'lucide-react';
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
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [dateRange, setDateRange] = useState({ from: '', to: '' });

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
    const pedidoDate = new Date(pedido.fecha);
    const fromDate = dateRange.from ? new Date(dateRange.from) : null;
    const toDate = dateRange.to ? new Date(dateRange.to) : null;

    const dateInRange = (!fromDate || pedidoDate >= fromDate) &&
                        (!toDate || pedidoDate <= toDate);

    return dateInRange && Object.values(pedido).some(value =>
      typeof value === 'string' && value.toLowerCase().includes(lowercasedSearchTerm)
    );
  };

  const sortedPedidos = [...pedidos].sort((a, b) => new Date(b.fecha) - new Date(a.fecha));
  const filteredPedidos = sortedPedidos.filter(filterPedidos);

  // Pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredPedidos.slice(indexOfFirstItem, indexOfLastItem);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

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

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('es-ES', options);
  };

  return (
    <div className="container mx-auto p-4 md:p-6 space-y-6 md:space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
        <h1 className="text-2xl md:text-3xl font-bold flex items-center">
          <ShoppingBag className="mr-2 h-6 w-6 md:h-8 md:w-8" />
          Gestión de Pedidos
        </h1>
        <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-4 w-full md:w-auto">
          <div className="relative w-full md:w-64">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <Input 
              className="pl-10 pr-4 py-2 w-full" 
              placeholder="Buscar pedidos..." 
              value={searchTerm} 
              onChange={(e) => setSearchTerm(e.target.value)} 
            />
          </div>
          <div className="flex space-x-2 items-center">
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" />
              <Input
                type="date"
                className="pl-10 pr-4 py-2"
                value={dateRange.from}
                onChange={(e) => setDateRange({ ...dateRange, from: e.target.value })}
                aria-label="Desde"
              />
            </div>
            <span className="text-gray-500">hasta</span>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" />
              <Input
                type="date"
                className="pl-10 pr-4 py-2"
                value={dateRange.to}
                onChange={(e) => setDateRange({ ...dateRange, to: e.target.value })}
                aria-label="Hasta"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-end items-center">
  <div className="flex space-x-2">
    <Select value={itemsPerPage.toString()} onValueChange={(value) => setItemsPerPage(Number(value))}>
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Pedidos por página" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="5">5 por página</SelectItem>
        <SelectItem value="10">10 por página</SelectItem>
        <SelectItem value="20">20 por página</SelectItem>
      </SelectContent>
    </Select>
  </div>
</div>


      {error && <p className="text-red-500 bg-red-100 p-4 rounded-md">Hubo un error: {error.statusText}</p>}
      {loading && <p className="text-blue-500 bg-blue-100 p-4 rounded-md">Cargando pedidos...</p>}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        {currentItems.length > 0 ? (
          currentItems.map((pedido) => (
            <Card key={pedido.id} className="overflow-hidden flex flex-col shadow-md hover:shadow-lg transition-shadow duration-300">
              <CardHeader className="bg-primary text-primary-foreground">
                <CardTitle className="flex justify-between items-center text-lg md:text-xl">
                  <span>Pedido #{pedido.id}</span>
                  {getStatusIcon(pedido.estado)}
                </CardTitle>
                <CardDescription className="text-primary-foreground/80 text-sm">{formatDate(pedido.fecha)}</CardDescription>
              </CardHeader>

              <CardContent className="flex-grow pt-4 md:pt-6 space-y-2">
                <p className="flex justify-between text-sm"><span className="font-semibold">Cliente:</span> {pedido.cliente}</p>
                <p className="flex justify-between text-sm">
                  <span className="font-semibold">Estado:</span> 
                  <Badge variant={pedido.estado === 'Entregado' ? 'default' : 'secondary'}>
                    {pedido.estado}
                  </Badge>
                </p>
                <p className="flex justify-between text-sm"><span className="font-semibold">Total:</span> ${parseFloat(pedido.total || 0).toFixed(2)}</p>
              </CardContent>

              <CardFooter className="bg-muted mt-auto p-3 md:p-4">
                <div className="flex justify-between w-full">
                  <Button variant="outline" size="sm" onClick={() => handleEditStatus(pedido)}>
                    <Edit2 className="mr-1 h-3 w-3 md:h-4 md:w-4" /> Editar
                  </Button>
                  <Button variant="secondary" size="sm" onClick={() => handleViewMore(pedido)}>
                    <Eye className="mr-1 h-3 w-3 md:h-4 md:w-4" /> Ver más
                  </Button>
                  <Button variant="destructive" size="sm" onClick={() => handleDeletePedido(pedido)}>
                    <Trash2 className="mr-1 h-3 w-3 md:h-4 md:w-4" /> Cancelar
                  </Button>
                </div>
              </CardFooter>
            </Card>
          ))
        ) : (
          <p className="col-span-full text-center text-muted-foreground">No hay pedidos que mostrar.</p>
        )}
      </div>

      {/* Pagination */}
      <div className="flex justify-center mt-6">
        <Button
          variant="outline"
          size="sm"
          onClick={() => paginate(currentPage - 1)}
          disabled={currentPage === 1}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <span className="mx-4">
          Página {currentPage} de {Math.ceil(filteredPedidos.length / itemsPerPage)}
        </span>
        <Button
          variant="outline"
          size="sm"
          onClick={() => paginate(currentPage + 1)}
          disabled={currentPage === Math.ceil(filteredPedidos.length / itemsPerPage)}
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl md:text-2xl">Detalles del Pedido #{currentPedido?.id}</DialogTitle>
          </DialogHeader>
          {currentPedido && (
            <div className="space-y-4 md:space-y-6">
              <div className="grid grid-cols-2 gap-3 md:gap-4">
                <div>
                  <p className="font-semibold">Cliente:</p>
                  <p className="text-sm">{currentPedido.cliente}</p>
                </div>
                <div>
                  <p className="font-semibold">Estado:</p>
                  <p className="flex items-center text-sm">
                    {getStatusIcon(currentPedido.estado)}
                    <span className="ml-2">{currentPedido.estado}</span>
                  </p>
                </div>
                <div>
                  <p className="font-semibold">Total:</p>
                  <p className="text-sm">${parseFloat(currentPedido.total || 0).toFixed(2)}</p>
                </div>
                <div>
                  <p className="font-semibold">Fecha:</p>
                  <p className="text-sm">{formatDate(currentPedido.fecha)}</p>
                </div>
              </div>
              
              {currentPedido.shippingDetails && (
                <div className="border-t pt-3 md:pt-4">
                  <h3 className="font-semibold mb-2">Detalles de Envío:</h3>
                  <p className="text-sm"><span className="font-medium">Dirección:</span> {currentPedido.shippingDetails.direccion}</p>
                  <p className="text-sm"><span className="font-medium">Teléfono:</span> {formatPhoneNumber(currentPedido.shippingDetails.telefono)}</p>
                  <p className="text-sm"><span className="font-medium">Casa:</span> {currentPedido.shippingDetails.casa}</p>
                </div>
              )}

              <div className="border-t pt-3 md:pt-4">
                <h3 className="font-semibold mb-2">Productos:</h3>
                <div className="space-y-3 md:space-y-4">
                  
                  {currentPedido.products?.map((product, index) => (
                    <div key={index} className="flex items-center space-x-3 md:space-x-4 bg-muted p-2 rounded-md">
                      <img 
                        src={getProductImageByName(product.name)} 
                        alt={product.name} 
                        className="w-12 h-12 md:w-16 md:h-16 object-cover rounded-md border"
                        loading="lazy"
                      />
                      <div className="flex-grow">
                        <p className="font-medium text-sm">{product.name}</p>
                        <p className="text-xs text-muted-foreground">Cantidad: {product.quantity}</p>
                        <p className="text-xs text-muted-foreground">Precio: ${parseFloat(product.price || 0).toFixed(2)}</p>
                      </div>
                      <p className="font-semibold text-sm">${(product.quantity * parseFloat(product.price || 0)).toFixed(2)}</p>
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