import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Package, Edit, Trash2, Plus, Search } from 'lucide-react';
import { useCrudContextPedidos } from "../context/CrudContextPedidos";

export default function GestionPedidos() {
  const { db: pedidos, createData, updateData, deleteData, dataToEdit, setDataToEdit, error, loading } = useCrudContextPedidos();

  const [isOpen, setIsOpen] = useState(false);
  const [currentPedido, setCurrentPedido] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [products, setProducts] = useState([{ id: Date.now(), name: '', quantity: 0, price: 0 }]);
  const [isConfirmDeleteOpen, setIsConfirmDeleteOpen] = useState(false);
  const [pedidoToDelete, setPedidoToDelete] = useState(null);

  useEffect(() => {
    if (dataToEdit) {
      setCurrentPedido(dataToEdit);
      setProducts(dataToEdit.products || [{ id: Date.now(), name: '', quantity: 0, price: 0 }]);
      setIsOpen(true);
    } else {
      setIsOpen(false);
    }
  }, [dataToEdit]);

  const handleNewPedido = () => {
    setCurrentPedido(null);
    setProducts([{ id: Date.now(), name: '', quantity: 0, price: 0 }]);
    setIsOpen(true);
  };

  const handleEditPedido = (pedido) => {
    setDataToEdit(pedido);
    setIsOpen(true);
  };

  const handleDeletePedido = (pedido) => {
    setPedidoToDelete(pedido);
    setIsConfirmDeleteOpen(true);
  };

  const confirmDelete = () => {
    if (pedidoToDelete) {
      deleteData(pedidoToDelete.id);
    }
    setIsConfirmDeleteOpen(false);
    setPedidoToDelete(null);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const form = event.target;
    const total = products.reduce((sum, product) => sum + product.quantity * product.price, 0);

    const newPedido = {
      id: currentPedido?.id || Date.now().toString(),
      cliente: form.cliente.value,
      fecha: form.fecha.value,
      estado: form.estado.value,
      total,
      products,
    };

    if (currentPedido) {
      updateData(newPedido);
    } else {
      createData(newPedido);
    }
    setIsOpen(false);
    setDataToEdit(null);
  };

  const handleProductChange = (index, field, value) => {
    const newProducts = [...products];
    newProducts[index][field] = field === 'name' ? value : parseFloat(value);
    setProducts(newProducts);
  };

  const addProduct = () => {
    setProducts([...products, { id: Date.now(), name: '', quantity: 0, price: 0 }]);
  };

  const removeProduct = (index) => {
    const newProducts = products.filter((_, i) => i !== index);
    setProducts(newProducts);
  };

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
          <Button onClick={handleNewPedido}>
            <Plus className="mr-2 h-4 w-4" /> Nuevo Pedido
          </Button>
        </div>
      </div>

      {error && <p className="text-red-500">Hubo un error: {error.statusText}</p>}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredPedidos.map((pedido) => (
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
                      {product.name} - Cantidad: {product.quantity}, Precio: ${product.price.toFixed(2)}
                    </li>
                  ))}
                </ul>
              </div>
            </CardContent>
            <CardFooter className="bg-muted mt-auto">
              <div className="flex justify-between w-full">
                <Button variant="outline" size="sm" onClick={() => handleEditPedido(pedido)}>
                  <Edit className="mr-2 h-4 w-4" /> Editar
                </Button>
                <Button variant="destructive" size="sm" onClick={() => handleDeletePedido(pedido)}>
                  <Trash2 className="mr-2 h-4 w-4" /> Eliminar
                </Button>
              </div>
            </CardFooter>
          </Card>
        ))}
      </div>

      <Dialog open={isOpen} onOpenChange={(open) => {
        if (!open) {
          setDataToEdit(null);
        }
        setIsOpen(open);
      }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{currentPedido ? 'Editar Pedido' : 'Nuevo Pedido'}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="cliente">Cliente</Label>
              <Input id="cliente" name="cliente" defaultValue={currentPedido?.cliente || ''} required />
            </div>
            <div>
              <Label htmlFor="fecha">Fecha</Label>
              <Input id="fecha" name="fecha" type="date" defaultValue={currentPedido?.fecha || ''} required />
            </div>
            <div>
              <Label htmlFor="estado">Estado</Label>
              <Select id="estado" name="estado" defaultValue={currentPedido?.estado || 'Pendiente'}>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar estado" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Pendiente">Pendiente</SelectItem>
                  <SelectItem value="En proceso">En proceso</SelectItem>
                  <SelectItem value="Entregado">Entregado</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Productos</Label>
              {products.map((product, index) => (
                <div key={index} className="flex space-x-2 mb-2">
                  <Input
                    placeholder="Nombre del producto"
                    value={product.name}
                    onChange={(e) => handleProductChange(index, 'name', e.target.value)}
                  />
                  <Input
                    type="number"
                    placeholder="Cantidad"
                    value={product.quantity}
                    onChange={(e) => handleProductChange(index, 'quantity', e.target.value)}
                  />
                  <Input
                    type="number"
                    placeholder="Precio"
                    value={product.price}
                    onChange={(e) => handleProductChange(index, 'price', e.target.value)}
                  />
                  <Button type="button" variant="destructive" onClick={() => removeProduct(index)}>Eliminar</Button>
                </div>
              ))}
              <Button type="button" onClick={addProduct}>Añadir Producto</Button>
            </div>
            <Button type="submit" className="w-full">Guardar</Button>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={isConfirmDeleteOpen} onOpenChange={(open) => setIsConfirmDeleteOpen(open)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmar Eliminación</DialogTitle>
          </DialogHeader>
          <p>¿Estás seguro de que deseas eliminar este pedido?</p>
          <div className="flex justify-end space-x-2 mt-4">
            <Button variant="outline" onClick={() => setIsConfirmDeleteOpen(false)}>Cancelar</Button>
            <Button variant="destructive" onClick={confirmDelete}>Eliminar</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
