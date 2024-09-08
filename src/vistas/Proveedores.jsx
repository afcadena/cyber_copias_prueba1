import React, { useContext, useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { UserPlus, Edit, Trash2, Search } from 'lucide-react';
import CrudContextProveedores from '../context/CrudContextProveedores';

export default function GestionProveedores() {
  const { db: proveedores, createData, updateData, deleteData, dataToEdit, setDataToEdit } = useContext(CrudContextProveedores);

  const [isOpen, setIsOpen] = useState(false);
  const [currentProveedor, setCurrentProveedor] = useState(null);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [proveedorToDelete, setProveedorToDelete] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    if (dataToEdit) {
      setCurrentProveedor(dataToEdit);
      setIsOpen(true);
    }
  }, [dataToEdit]);

  const handleNewProveedor = () => {
    setCurrentProveedor(null);
    setIsOpen(true);
  };

  const handleEditProveedor = (proveedor) => {
    setDataToEdit(proveedor);
  };

  const handleDeleteProveedor = (proveedor) => {
    setProveedorToDelete(proveedor.id);
    setIsConfirmOpen(true);
  };

  const confirmDelete = () => {
    if (proveedorToDelete) {
      deleteData(proveedorToDelete);
      setProveedorToDelete(null);
      setIsConfirmOpen(false);
    }
  };

  const cancelDelete = () => {
    setProveedorToDelete(null);
    setIsConfirmOpen(false);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const form = event.target;
    const newProveedor = {
      id: currentProveedor?.id || Date.now().toString(),
      nombre: form.nombre.value,
      contacto: form.contacto.value,
      telefono: form.telefono.value,
      email: form.email.value,
      direccion: form.direccion.value,
    };

    if (currentProveedor) {
      updateData(newProveedor);
    } else {
      createData(newProveedor);
    }
    setIsOpen(false);
  };

  // Filtrar proveedores según el término de búsqueda
  const filteredProveedores = proveedores?.filter(proveedor =>
    proveedor.id.includes(searchTerm) ||
    proveedor.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    proveedor.contacto.toLowerCase().includes(searchTerm.toLowerCase()) ||
    proveedor.telefono.includes(searchTerm) ||
    proveedor.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    proveedor.direccion.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Gestión de Proveedores</h1>
        <div className="flex items-center space-x-4">
          <div className="relative">
            <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <Input 
              className="pl-8" 
              placeholder="Buscar proveedores..." 
              value={searchTerm} 
              onChange={(e) => setSearchTerm(e.target.value)} 
            />
          </div>
          <Button onClick={handleNewProveedor}>
            <UserPlus className="mr-2 h-4 w-4" /> Nuevo Proveedor
          </Button>
        </div>
      </div>

      <div className="space-y-4">
        {filteredProveedores?.map((proveedor) => (
          <div key={proveedor.id} className="flex items-center justify-between p-4 bg-white rounded-lg shadow">
            <div className="flex items-center space-x-4">
              <Avatar className="h-12 w-12">
                <AvatarImage src={`https://api.dicebear.com/6.x/initials/svg?seed=${proveedor.nombre}`} />
                <AvatarFallback>{proveedor.nombre.charAt(0)}</AvatarFallback>
              </Avatar>
              <div>
                <h2 className="text-lg font-semibold">{proveedor.nombre}</h2>
                <p className="text-sm text-gray-500">{proveedor.contacto}</p>
                <p className="text-sm text-gray-500">Teléfono: {proveedor.telefono}</p>
                <p className="text-sm text-gray-500">Email: {proveedor.email}</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="sm" onClick={() => handleEditProveedor(proveedor)}>
                <Edit className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm" onClick={() => handleDeleteProveedor(proveedor)}>
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal de confirmación de eliminación */}
      <Dialog open={isConfirmOpen} onOpenChange={setIsConfirmOpen}>
        <DialogContent aria-labelledby="confirm-title" aria-describedby="confirm-description">
          <DialogHeader>
            <DialogTitle id="confirm-title">Confirmar Eliminación</DialogTitle>
            <DialogDescription id="confirm-description">
              ¿Estás seguro de eliminar este proveedor?
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end space-x-4">
            <Button variant="outline" onClick={cancelDelete}>Cancelar</Button>
            <Button onClick={confirmDelete} className="bg-red-500 text-white hover:bg-red-600">
              Eliminar
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent aria-labelledby="dialog-title" aria-describedby="dialog-description">
          <DialogHeader>
            <DialogTitle id="dialog-title">
              {currentProveedor ? 'Editar Proveedor' : 'Nuevo Proveedor'}
            </DialogTitle>
            <DialogDescription id="dialog-description">
              {currentProveedor
                ? 'Edita la información del proveedor.'
                : 'Agrega un nuevo proveedor a la lista.'}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="nombre">Nombre</Label>
              <Input id="nombre" name="nombre" defaultValue={currentProveedor?.nombre || ''} />
            </div>
            <div>
              <Label htmlFor="contacto">Contacto</Label>
              <Input id="contacto" name="contacto" defaultValue={currentProveedor?.contacto || ''} />
            </div>
            <div>
              <Label htmlFor="telefono">Teléfono</Label>
              <Input id="telefono" name="telefono" defaultValue={currentProveedor?.telefono || ''} />
            </div>
            <div>
              <Label htmlFor="email">Email</Label>
              <Input id="email" name="email" type="email" defaultValue={currentProveedor?.email || ''} />
            </div>
            <div>
              <Label htmlFor="direccion">Dirección</Label>
              <Textarea id="direccion" name="direccion" defaultValue={currentProveedor?.direccion || ''} />
            </div>
            <Button type="submit" className="bg-black text-white hover:bg-gray-800">
              {currentProveedor ? 'Guardar Cambios' : 'Agregar Proveedor'}
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
