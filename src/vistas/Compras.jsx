import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { ShoppingCart, Plus, Edit, Trash2, Search } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import useCrudContextCompras from "../context/CrudContextCompras";

export default function GestionCompras() {
  const [isOpen, setIsOpen] = useState(false);
  const [currentCompra, setCurrentCompra] = useState(null);
  const [products, setProducts] = useState([{ name: '', quantity: 0, price: 0 }]);
  const [searchTerm, setSearchTerm] = useState('');

  // Usar el contexto de compras
  const { db: comprasData, createData, updateData, deleteData, error, loading } = useCrudContextCompras();

  // No es necesario usar setCompras, solo usamos comprasData directamente
  useEffect(() => {
    // Cualquier lógica adicional si es necesaria para el uso de comprasData
  }, [comprasData]);

  const handleNewCompra = () => {
    setCurrentCompra(null);
    setProducts([{ name: '', quantity: 0, price: 0 }]);
    setIsOpen(true);
  };

  const handleEditCompra = (compra) => {
    setCurrentCompra(compra);
    setProducts(compra.products || [{ name: '', quantity: 0, price: 0 }]);
    setIsOpen(true);
  };

  const handleDeleteCompra = (id) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar esta compra?')) {
      deleteData(id);
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    const total = products.reduce((sum, product) => sum + product.quantity * product.price, 0);
    const newCompra = {
      id: currentCompra ? currentCompra.id : Date.now().toString(),
      proveedor: formData.get('proveedor'),
      fecha: formData.get('fecha'),
      total: total,
      estado: formData.get('estado'),
      products: products
    };
    if (currentCompra) {
      updateData(newCompra);
    } else {
      createData(newCompra);
    }
    setIsOpen(false);
  };

  const handleProductChange = (index, field, value) => {
    const newProducts = [...products];
    newProducts[index][field] = field === 'name' ? value : parseFloat(value) || 0;
    setProducts(newProducts);
  };

  const addProduct = () => {
    setProducts([...products, { name: '', quantity: 0, price: 0 }]);
  };

  const removeProduct = (index) => {
    const newProducts = products.filter((_, i) => i !== index);
    setProducts(newProducts);
  };

  const getStatusBadge = (status) => {
    const statusStyles = {
      'Recibido': 'bg-green-100 text-green-800',
      'Pendiente': 'bg-yellow-100 text-yellow-800',
      'En tránsito': 'bg-blue-100 text-blue-800'
    };
    return <Badge className={statusStyles[status]}>{status}</Badge>;
  };

  const filteredCompras = comprasData.filter(compra =>
    compra.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    compra.proveedor.toLowerCase().includes(searchTerm.toLowerCase()) ||
    compra.fecha.toLowerCase().includes(searchTerm.toLowerCase()) ||
    compra.estado.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <div>Cargando...</div>;
  if (error) return <div>Error: {error.message || "Ocurrió un error"}</div>;

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold flex items-center">
          <ShoppingCart className="mr-2 h-8 w-8" />
          Gestión de Compras
        </h1>
        <div className="flex items-center space-x-4">
          <div className="relative">
            <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <Input 
              className="pl-8" 
              placeholder="Buscar compras..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Button onClick={handleNewCompra}>
            <Plus className="mr-2 h-5 w-5" /> Nueva Compra
          </Button>
        </div>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>Proveedor</TableHead>
            <TableHead>Fecha</TableHead>
            <TableHead>Total</TableHead>
            <TableHead>Estado</TableHead>
            <TableHead>Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredCompras.map(compra => (
            <TableRow key={compra.id}>
              <TableCell>{compra.id}</TableCell>
              <TableCell>{compra.proveedor}</TableCell>
              <TableCell>{compra.fecha}</TableCell>
              <TableCell>{compra.total.toFixed(2)}</TableCell> {/* Aseguramos que el total esté en formato numérico */}
              <TableCell>{getStatusBadge(compra.estado)}</TableCell>
              <TableCell>
                <Button onClick={() => handleEditCompra(compra)} className="mr-2">
                  <Edit className="h-5 w-5" />
                </Button>
                <Button onClick={() => handleDeleteCompra(compra.id)} variant="destructive">
                  <Trash2 className="h-5 w-5" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{currentCompra ? 'Editar Compra' : 'Nueva Compra'}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="proveedor">Proveedor</Label>
                  <Input 
                    id="proveedor" 
                    name="proveedor" 
                    defaultValue={currentCompra?.proveedor || ''} 
                    required 
                  />
                </div>
                <div>
                  <Label htmlFor="fecha">Fecha</Label>
                  <Input 
                    id="fecha" 
                    name="fecha" 
                    type="date" 
                    defaultValue={currentCompra?.fecha || ''} 
                    required 
                  />
                </div>
                <div>
                  <Label htmlFor="estado">Estado</Label>
                  <Select 
                    id="estado" 
                    name="estado" 
                    defaultValue={currentCompra?.estado || 'Pendiente'} 
                    required 
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar estado" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Recibido">Recibido</SelectItem>
                      <SelectItem value="Pendiente">Pendiente</SelectItem>
                      <SelectItem value="En tránsito">En tránsito</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div>
                <Label>Productos</Label>
                {products.map((product, index) => (
                  <div key={index} className="flex items-center space-x-4 mb-4">
                    <Input 
                      placeholder="Nombre" 
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
                    <Button type="button" onClick={() => removeProduct(index)} variant="destructive">Eliminar</Button>
                  </div>
                ))}
                <Button type="button" onClick={addProduct}>Agregar Producto</Button>
              </div>
            </div>
            <Button type="submit" className="mt-4">Guardar</Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
