import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign, CalendarDays, TrendingUp, Plus, Edit, Trash2, Search, BarChart2 } from 'lucide-react';
import { useCrudContextVentas } from '../context/CrudContextVentas'; // Asegúrate de que la ruta sea correcta

export default function GestionVentas() {
  const { db: ventas, createData, updateData, deleteData, loading, error } = useCrudContextVentas();
  const [isOpen, setIsOpen] = useState(false);
  const [isConfirmDeleteOpen, setIsConfirmDeleteOpen] = useState(false);
  const [currentVenta, setCurrentVenta] = useState(null);
  const [productos, setProductos] = useState([]);
  const [ventaToDelete, setVentaToDelete] = useState(null);

  const handleNewVenta = () => {
    setCurrentVenta(null);
    setProductos([]);
    setIsOpen(true);
  };

  const handleEditVenta = (venta) => {
    setCurrentVenta(venta);
    setProductos(venta.productos || []);
    setIsOpen(true);
  };

  const handleDeleteVenta = (venta) => {
    setVentaToDelete(venta);
    setIsConfirmDeleteOpen(true);
  };

  const confirmDelete = () => {
    if (ventaToDelete) {
      deleteData(ventaToDelete.id);
      setIsConfirmDeleteOpen(false);
    }
  };

  const handleAddProduct = () => {
    setProductos([...productos, { id: Date.now().toString(), nombre: '', cantidad: 1, precio: 0 }]);
  };

  const handleRemoveProduct = (id) => {
    setProductos(productos.filter(producto => producto.id !== id));
  };

  const handleProductChange = (id, field, value) => {
    setProductos(productos.map(producto =>
      producto.id === id ? { ...producto, [field]: value } : producto
    ));
  };

  const totalVentas = ventas.reduce((sum, venta) => sum + venta.total, 0);
  const ventasCompletadas = ventas.filter(venta => venta.estado === 'Completada');
  const promedioVentas = ventasCompletadas.length > 0
    ? ventasCompletadas.reduce((sum, venta) => sum + venta.total, 0) / ventasCompletadas.length
    : 0;

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const cliente = formData.get('cliente');
    const fecha = formData.get('fecha');
    const estado = formData.get('estado');
    const total = productos.reduce((sum, p) => sum + p.cantidad * p.precio, 0);

    if (cliente && fecha && estado) {
      const ventaData = { cliente, fecha, estado, total, productos };
      if (currentVenta) {
        updateData({ ...currentVenta, ...ventaData });
      } else {
        createData(ventaData);
      }
      setIsOpen(false);
    } else {
      alert('Por favor, complete todos los campos.');
    }
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold flex items-center">
          <BarChart2 className="mr-2 h-8 w-8" />
          Gestión de Ventas
        </h1>
        <div className="flex items-center space-x-4">
          <div className="relative">
            <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <Input className="pl-8" placeholder="Buscar ventas..." />
          </div>
          <Button onClick={handleNewVenta}>
            <Plus className="mr-2 h-4 w-4" /> Nueva Venta
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3 mb-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ventas Totales</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalVentas.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">Suma de todas las ventas</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Promedio de Ventas</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${promedioVentas.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">Promedio de ventas completadas</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Última Venta</CardTitle>
            <CalendarDays className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{ventas[ventas.length - 1]?.fecha}</div>
            <p className="text-xs text-muted-foreground">Fecha de la última venta registrada</p>
          </CardContent>
        </Card>
      </div>

      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Cliente</TableHead>
              <TableHead>Fecha</TableHead>
              <TableHead>Total</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead className="text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {ventas.map((venta) => (
              <TableRow key={venta.id} className="hover:bg-gray-50">
                <TableCell className="font-medium">{venta.id}</TableCell>
                <TableCell>{venta.cliente}</TableCell>
                <TableCell>{venta.fecha}</TableCell>
                <TableCell>${venta.total.toFixed(2)}</TableCell>
                <TableCell>
                <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                  venta.estado === 'Completada' ? 'bg-blue-100 text-blue-800' : 
                  venta.estado === 'Pendiente' ? 'bg-yellow-100 text-yellow-800' : 
                  'bg-red-100 text-red-800'
                }`}>
                  {venta.estado}
                </span>
              </TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="sm" onClick={() => handleEditVenta(venta)}>
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => handleDeleteVenta(venta)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>{currentVenta ? 'Editar Venta' : 'Nueva Venta'}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit}>
            <div className="grid gap-4">
              <div>
                <Label htmlFor="cliente">Cliente</Label>
                <Input
                  id="cliente"
                  name="cliente"
                  defaultValue={currentVenta?.cliente || ''}
                  required
                />
              </div>
              <div>
                <Label htmlFor="fecha">Fecha</Label>
                <Input
                  id="fecha"
                  name="fecha"
                  type="date"
                  defaultValue={currentVenta?.fecha || ''}
                  required
                />
              </div>
              <div>
                <Label htmlFor="estado">Estado</Label>
                <Select
                  id="estado"
                  name="estado"
                  defaultValue={currentVenta?.estado || 'Pendiente'}
                  required
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Pendiente">Pendiente</SelectItem>
                    <SelectItem value="Completada">Completada</SelectItem>
                    <SelectItem value="Cancelada">Cancelada</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Productos</Label>
                {productos.map(producto => (
                  <div key={producto.id} className="flex items-center space-x-4">
                    <Input
                      placeholder="Nombre"
                      value={producto.nombre}
                      onChange={(e) => handleProductChange(producto.id, 'nombre', e.target.value)}
                    />
                    <Input
                      type="number"
                      placeholder="Cantidad"
                      value={producto.cantidad}
                      onChange={(e) => handleProductChange(producto.id, 'cantidad', Number(e.target.value))}
                    />
                    <Input
                      type="number"
                      placeholder="Precio"
                      value={producto.precio}
                      onChange={(e) => handleProductChange(producto.id, 'precio', Number(e.target.value))}
                    />
                    <Button
                      variant="destructive"
                      className="mt-1"
                      onClick={() => handleRemoveProduct(producto.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
                <Button
                  type="button"
                  onClick={handleAddProduct}
                >
                  <Plus className="mr-2 h-4 w-4" /> Agregar Producto
                </Button>
              </div>
            </div>
            <div className="flex justify-end mt-4">
              <Button type="submit">
                {currentVenta ? 'Actualizar Venta' : 'Crear Venta'}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={isConfirmDeleteOpen} onOpenChange={setIsConfirmDeleteOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmar Eliminación</DialogTitle>
          </DialogHeader>
          <div className="p-4">
            <p>¿Estás seguro de que deseas eliminar esta venta?</p>
            <div className="flex justify-end mt-4 space-x-2">
              <Button variant="outline" onClick={() => setIsConfirmDeleteOpen(false)}>
                Cancelar
              </Button>
              <Button variant="destructive" onClick={confirmDelete}>
                Confirmar
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
