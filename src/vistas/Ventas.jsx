import React, { useState, useContext, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DollarSign, CalendarDays, TrendingUp, Plus, Trash2, BarChart2, Eye, ChevronLeft, ChevronRight, ChevronsUpDown } from 'lucide-react';
import CrudContext from '../context/CrudContextInventario';
import { useCrudContextVentas } from '../context/CrudContextVentas';

export default function GestionVentas() {
  const { db: productosInventario, loading: inventarioLoading } = useContext(CrudContext);
  const { db: ventasDesdeContext, createData, updateData, deleteData } = useCrudContextVentas();


  const [isOpen, setIsOpen] = useState(false);
  const [isConfirmDeleteOpen, setIsConfirmDeleteOpen] = useState(false);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [currentVenta, setCurrentVenta] = useState(null);
  const [productos, setProductos] = useState([]);
  const [ventaToDelete, setVentaToDelete] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [carrito, setCarrito] = useState([]);
  const [fechaVenta, setFechaVenta] = useState(new Date().toISOString().split("T")[0]);
  const [ventas, setVentas] = useState(ventasDesdeContext || []); // Inicia el estado con los datos desde el contexto

  // New state for pagination, filtering, and sorting
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [filterTerm, setFilterTerm] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'ascending' });


  useEffect(() => {
    fetch('http://localhost:4000/api/ventas')
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => setVentas(data))
      .catch(error => console.error('Error fetching data:', error));
  }, []);

  const handleNewVenta = () => {
    setCurrentVenta(null);
    setProductos([{ id: Date.now().toString(), productoId: '', cantidad: 1, precio: 0 }]);
    setIsOpen(true);
  };

  const handleDeleteVenta = (venta) => {
    if (venta._id) {
      setVentaToDelete(venta._id);
      setIsConfirmDeleteOpen(true);
    } else {
      console.error('No se puede eliminar la venta. ID es undefined.');
    }
  };

  const confirmDelete = async () => {
    if (ventaToDelete) {
      try {
        // Llama a la función de eliminar en el contexto
        await deleteData(ventaToDelete); // Asumiendo que deleteData realiza la eliminación en el backend
        // Actualiza el estado local para eliminar la venta
        setVentas(prevVentas => prevVentas.filter(venta => venta._id !== ventaToDelete));
        setIsConfirmDeleteOpen(false);
        setVentaToDelete(null);
      } catch (error) {
        console.error('Error al eliminar la venta:', error);
      }
    } else {
      console.error('No se puede eliminar la venta. ID es undefined.');
    }
  };

  const handleRemoveProduct = (id) => {
    setProductos(productos.filter(producto => producto.id !== id));
  };

  const handleProductSelect = (id, productoId) => {
    const selectedProduct = productosInventario.find(prod => prod._id === productoId);
    if (selectedProduct) {
      const newProduct = {
        id,
        productoId,
        nombre: selectedProduct.name,
        precio: Number(selectedProduct.price),
        precioUnitario: Number(selectedProduct.price),
        cantidad: 1
      };
      setProductos(prevProductos => prevProductos.map(producto => 
        producto.id === id ? newProduct : producto
      ));
      setCarrito(prevCarrito => [...prevCarrito, newProduct]);
    }
  };

  const handleQuantityChange = (id, cantidad) => {
    const cantidadNum = parseInt(cantidad, 10);
    setProductos((prev) => 
      prev.map((producto) => 
        producto.id === id 
          ? { 
              ...producto, 
              cantidad: cantidadNum > 0 ? cantidadNum : 1,
              precio: producto.precioUnitario * (cantidadNum > 0 ? cantidadNum : 1)
            } 
          : producto
      )
    );
  };

  const handleAddProduct = () => {
    setProductos((prev) => [
      ...prev,
      { id: prev.length + 1, productoId: '', cantidad: 1, precio: 0, precioUnitario: 0 },
    ]);
  };

  const total = productos.reduce((acc, producto) => acc + producto.precio, 0);
  
  const totalVentas = ventas.reduce((sum, venta) => sum + venta.total, 0);
  const ventasCompletadas = ventas.filter(venta => venta.estado === 'Completada');
  const promedioVentas = ventasCompletadas.length > 0
    ? ventasCompletadas.reduce((sum, venta) => sum + venta.total, 0) / ventasCompletadas.length
    : 0;

    const handleSubmit = async (e) => {
      e.preventDefault();
      const total = carrito.reduce((sum, producto) => sum + (producto.precio * producto.cantidad), 0);
      const ventaData = {
        productos: carrito,
        fecha: new Date(fechaVenta),
        estado: 'Completada',
        total: total
      };
      
      try {
        const response = await fetch('http://localhost:4000/api/ventas', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(ventaData),
        });
    
        if (!response.ok) {
          const errorDetails = await response.json();
          console.log("Detalles del error:", errorDetails);
          throw new Error('Error en la solicitud de venta');
        }
    
        const data = await response.json();
        console.log("Venta creada con éxito:", data);
        
        // Actualiza el estado local de ventas
        setVentas(prev => [...prev, data]);
    
        // Reiniciar el carrito y los productos
        setCarrito([]); // Limpia el carrito
        setProductos([]); // Limpia la lista de productos
    
        // Cerrar el modal
        setIsOpen(false);
      } catch (error) {
        console.error("Error al crear la venta:", error.message);
        setErrorMessage(error.message);
      }
    };
    

  const handlePreviewVenta = (venta) => {
    setCurrentVenta(venta);
    setIsPreviewOpen(true);
  };

  const truncateId = (id) => {
    return id.slice(0, 10);
  };

  const formatDate = (isoDateString) => {
    const date = new Date(isoDateString);
    return date.toLocaleDateString('es-CO', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
    });
  };

  // Sorting function
  const sortedVentas = React.useMemo(() => {
    let sortableVentas = [...ventas];
    if (sortConfig.key !== null) {
      sortableVentas.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === 'ascending' ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === 'ascending' ? 1 : -1;
        }
        return 0;
      });
    }
    return sortableVentas;
  }, [ventas, sortConfig]);

  // Filtering function
  const filteredVentas = sortedVentas.filter(venta =>
    venta._id.toLowerCase().includes(filterTerm.toLowerCase()) ||
    venta.fecha.toLowerCase().includes(filterTerm.toLowerCase()) ||
    venta.total.toString().includes(filterTerm)
  );

  // Pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentVentas = filteredVentas.slice(indexOfFirstItem, indexOfLastItem);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const requestSort = (key) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold flex items-center">
          <BarChart2 className="mr-2 h-8 w-8" />
          Gestión de Ventas
        </h1>
        <div className="flex items-center space-x-4">
          <Button onClick={handleNewVenta} className="bg-blue-600 text-white hover:bg-blue-700">
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
            <div className="text-2xl font-bold">
              {ventas.length > 0 ? formatDate(ventas[ventas.length - 1].fecha) : 'N/A'}
            </div>
            <p className="text-xs text-muted-foreground">Fecha de la última venta registrada</p>
          </CardContent>
        </Card>
      </div>

      <div className="bg-white shadow-md rounded-lg overflow-hidden mb-6">
        <div className="p-4 flex justify-between items-center">
          <Input
            placeholder="Filtrar ventas..."
            value={filterTerm}
            onChange={(e) => setFilterTerm(e.target.value)}
            className="max-w-sm"
          />
          <Select value={itemsPerPage.toString()} onValueChange={(value) => setItemsPerPage(Number(value))}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Ventas por página" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="5">5 por página</SelectItem>
              <SelectItem value="10">10 por página</SelectItem>
              <SelectItem value="20">20 por página</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="cursor-pointer" onClick={() => requestSort('_id')}>
                ID {sortConfig.key === '_id' && (sortConfig.direction === 'ascending' ? '↑' : '↓')}
              </TableHead>
              <TableHead className="cursor-pointer" onClick={() => requestSort('fecha')}>
                Fecha {sortConfig.key === 'fecha' && (sortConfig.direction === 'ascending' ? '↑' : '↓')}
              </TableHead>
              <TableHead className="cursor-pointer" onClick={() => requestSort('total')}>
                Total {sortConfig.key === 'total' && (sortConfig.direction === 'ascending' ? '↑' : '↓')}
              </TableHead>
              <TableHead className="text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {currentVentas.map((venta) => (
              <TableRow key={venta._id} className="hover:bg-gray-50">
                <TableCell className="font-medium">{truncateId(venta._id)}</TableCell>
                <TableCell>{new Date(venta.fecha).toLocaleString('es-CO')}</TableCell>
                <TableCell>${venta.total.toFixed(2)}</TableCell>
                <TableCell className="text-right">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handlePreviewVenta(venta)}
                    className="bg-blue-500 hover:bg-blue-600 text-white mr-2"
                  >
                    <Eye className="h-4 w-4 mr-1" /> Vista Previa
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDeleteVenta(venta)}
                    className="bg-red-500 hover:bg-red-600 text-white"
                  >
                    <Trash2 className="h-4 w-4 mr-1" /> Eliminar
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <div className="flex items-center justify-between p-4">
          <p className="text-sm text-gray-700">
            Mostrando {indexOfFirstItem + 1} a  {Math.min(indexOfLastItem, filteredVentas.length)} de {filteredVentas.length} ventas
          </p>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => paginate(currentPage - 1)}
              disabled={currentPage === 1}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            {Array.from({ length: Math.ceil(filteredVentas.length / itemsPerPage) }).map((_, index) => (
              <Button
                key={index}
                variant={currentPage === index + 1 ? "default" : "outline"}
                size="sm"
                onClick={() => paginate(index + 1)}
              >
                {index + 1}
              </Button>
            ))}
            <Button
              variant="outline"
              size="sm"
              onClick={() => paginate(currentPage + 1)}
              disabled={currentPage === Math.ceil(filteredVentas.length / itemsPerPage)}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Nueva Venta</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="fecha">Fecha</Label>
              <Input
                id="fecha"
                type="date"
                value={fechaVenta}
                onChange={(e) => setFechaVenta(e.target.value)}
              />
            </div>
            
            <div>
              <h2 className="text-lg font-bold mb-2">Productos:</h2>
              {productos.map((producto) => (
                <div key={producto.id} className="flex items-center space-x-2 mb-2">
                  <Select
                    value={producto.productoId}
                    onValueChange={(value) => handleProductSelect(producto.id, value)}
                  >
                    <SelectTrigger className="w-[200px]">
                      <SelectValue placeholder="Selecciona un producto" />
                    </SelectTrigger>
                    <SelectContent>
                      {productosInventario.map((prod) => (
                        <SelectItem key={prod._id} value={prod._id}>{prod.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Input
                    type="number"
                    min="1"
                    value={producto.cantidad}
                    onChange={(e) => handleQuantityChange(producto.id, e.target.value)}
                    className="w-20"
                  />
                  <span className="w-24 text-right">{producto.precio.toFixed(2)} €</span>
                  <Button type="button" variant="destructive" size="sm" onClick={() => handleRemoveProduct(producto.id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>

            <div className="flex justify-between items-center">
              <Button type="button" onClick={handleAddProduct} variant="outline">
                <Plus className="h-4 w-4 mr-2" /> Agregar Producto
              </Button>
              <span className="font-bold">Total: {total.toFixed(2)} €</span>
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>
                Cancelar
              </Button>
              <Button type="submit">Guardar Venta</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={isPreviewOpen} onOpenChange={setIsPreviewOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Vista Previa de la Venta</DialogTitle>
          </DialogHeader>
          {currentVenta && (
            <div className="space-y-4">
              <h2 className="text-lg font-bold">Detalles de la Venta:</h2>
              <ul className="space-y-2">
                {currentVenta.productos.map((producto) => (
                  <li key={producto.productoId} className="flex justify-between">
                    <span>{producto.nombre} (Cantidad: {producto.cantidad})</span>
                    <span>${(producto.precio * producto.cantidad).toFixed(2)}</span>
                  </li>
                ))}
              </ul>
              <div className="flex justify-between font-bold">
                <span>Total:</span>
                <span>${currentVenta.total.toFixed(2)}</span>
              </div>
              <div>
                <span className="font-bold">Fecha:</span> {new Date(currentVenta.fecha).toLocaleDateString()}
              </div>
              <div>
                <span className="font-bold">Estado:</span> {currentVenta.estado}
              </div>
            </div>
          )}
          <DialogFooter>
            <Button onClick={() => setIsPreviewOpen(false)}>
              Cerrar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isConfirmDeleteOpen} onOpenChange={setIsConfirmDeleteOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmar Eliminación</DialogTitle>
          </DialogHeader>
          <p>¿Estás seguro de que deseas eliminar esta venta?</p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsConfirmDeleteOpen(false)}>
              Cancelar
            </Button>
            <Button variant="destructive" onClick={confirmDelete}>
              Eliminar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}