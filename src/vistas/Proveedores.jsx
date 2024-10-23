import React, { useContext, useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { UserPlus, Edit, Trash2, Search, Mail, Phone, MapPin } from 'lucide-react';
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
    setCurrentProveedor(proveedor);
    setIsOpen(true);
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
    setCurrentProveedor(null);
  };

  const filteredProveedores = proveedores?.filter(proveedor =>
    proveedor.id.includes(searchTerm) ||
    proveedor.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    proveedor.contacto.toLowerCase().includes(searchTerm.toLowerCase()) ||
    proveedor.telefono.includes(searchTerm) ||
    proveedor.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    proveedor.direccion.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
        <h1 className="text-3xl font-bold">Gestión de Proveedores</h1>
        <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-4">
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
            <Input 
              className="pl-10 pr-4 w-full" 
              placeholder="Buscar proveedores..." 
              value={searchTerm} 
              onChange={(e) => setSearchTerm(e.target.value)} 
            />
          </div>
          <Button onClick={handleNewProveedor} className="w-full sm:w-auto">
            <UserPlus className="mr-2 h-4 w-4" /> Nuevo Proveedor
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProveedores?.map((proveedor) => (
          <Card key={proveedor.id} className="overflow-hidden">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center space-x-4">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={`https://api.dicebear.com/6.x/initials/svg?seed=${proveedor.nombre}`} />
                  <AvatarFallback>{proveedor.nombre.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                  <h2 className="text-lg font-semibold">{proveedor.nombre}</h2>
                  <p className="text-sm text-muted-foreground">{proveedor.contacto}</p>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-2">
              <div className="space-y-2">
                <p className="text-sm flex items-center">
                  <Phone className="h-4 w-4 mr-2 text-muted-foreground" />
                  {proveedor.telefono}
                </p>
                <p className="text-sm flex items-center">
                  <Mail className="h-4 w-4 mr-2 text-muted-foreground" />
                  {proveedor.email}
                </p>
                <p className="text-sm flex items-center">
                  <MapPin className="h-4 w-4 mr-2 text-muted-foreground" />
                  {proveedor.direccion}
                </p>
              </div>
              <div className="flex justify-end mt-4 space-x-2">
                <Button variant="outline" size="sm" onClick={() => handleEditProveedor(proveedor)}>
                  <Edit className="h-4 w-4 mr-2" /> Editar
                </Button>
                <Button variant="destructive" size="sm" onClick={() => handleDeleteProveedor(proveedor)}>
                  <Trash2 className="h-4 w-4 mr-2" /> Eliminar
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Dialog open={isConfirmOpen} onOpenChange={setIsConfirmOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmar Eliminación</DialogTitle>
            <DialogDescription>
              ¿Estás seguro de eliminar este proveedor? Esta acción no se puede deshacer.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="sm:justify-start">
            <Button variant="secondary" onClick={() => setIsConfirmOpen(false)}>
              Cancelar
            </Button>
            <Button variant="destructive" onClick={confirmDelete}>
              Eliminar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isOpen} onOpenChange={(open) => {
        setIsOpen(open);
        if (!open) setCurrentProveedor(null);
      }}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>
              {currentProveedor ? 'Editar Proveedor' : 'Nuevo Proveedor'}
            </DialogTitle>
            <DialogDescription>
              {currentProveedor
                ? 'Edita la información del proveedor.'
                : 'Agrega un nuevo proveedor a la lista.'}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="nombre">Nombre</Label>
                <Input id="nombre" name="nombre" defaultValue={currentProveedor?.nombre || ''} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="contacto">Contacto</Label>
                <Input id="contacto" name="contacto" defaultValue={currentProveedor?.contacto || ''} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="telefono">Teléfono</Label>
                <Input id="telefono" name="telefono" defaultValue={currentProveedor?.telefono || ''} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" name="email" type="email" defaultValue={currentProveedor?.email || ''} />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="direccion">Dirección</Label>
              <Input id="direccion" name="direccion" defaultValue={currentProveedor?.direccion || ''} />
            </div>
            <DialogFooter>
              <Button type="submit">
                {currentProveedor ? 'Guardar Cambios' : 'Agregar Proveedor'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}