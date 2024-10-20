import React, { useState, useContext, useEffect, useMemo } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DollarSign, CalendarDays, TrendingUp, Plus, Edit, Trash2, ChevronLeft, ChevronRight } from 'lucide-react';
import CrudContextInventario from '../context/CrudContextInventario'; 
import CrudContextCompras from '../context/CrudContextCompras'; 
import CrudContextProveedores from '../context/CrudContextProveedores'; 

export default function GestionCompras() {
  const { db: productosInventario } = useContext(CrudContextInventario); 
  const { db: proveedores } = useContext(CrudContextProveedores); 
  const { db: compras, createData, updateData, deleteData } = useContext(CrudContextCompras); 

  const [isOpen, setIsOpen] = useState(false);
  const [isConfirmDeleteOpen, setIsConfirmDeleteOpen] = useState(false);
  const [currentCompra, setCurrentCompra] = useState(null);
  const [productos, setProductos] = useState([]);
  const [compraToDelete, setCompraToDelete] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [filterTerm, setFilterTerm] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'ascending' });

  useEffect(() => {
    console.log('Productos Inventario:', productosInventario);
    console.log('Proveedores:', proveedores);
  }, [productosInventario, proveedores]);

  const handleNewCompra = () => {
    setCurrentCompra(null);
    setProductos([]);
    setIsOpen(true);
  };

  const handleEditCompra = (compra) => {
    setCurrentCompra(compra);
    setProductos(compra.productos || []);
    setIsOpen(true);
  };

  const handleDeleteCompra = (compra) => {
    setCompraToDelete(compra);
    setIsConfirmDeleteOpen(true);
  };

  const confirmDelete = () => {
    if (compraToDelete) {
      deleteData(compraToDelete._id);
      setIsConfirmDeleteOpen(false);
    }
  };

  const handleAddProduct = () => {
    setProductos([...productos, { id: Date.now().toString(), productoId: '', cantidad: 1, precio: 0 }]);
  };

  const handleRemoveProduct = (id) => {
    setProductos(productos.filter(producto => producto.id !== id));
  };

  const handleProductSelect = (id, productoId) => {
    const selectedProduct = productosInventario.find(prod => prod._id === productoId);
    if (selectedProduct) {
      setProductos(productos.map(producto =>
        producto.id === id
          ? { ...producto, productoId, nombre: selectedProduct.name, precio: Number(selectedProduct.price) }
          : producto
      ));
    }
  };

  const handleQuantityChange = (id, cantidad) => {
    const cantidadNumerica = Math.max(Number(cantidad), 1); 
    setProductos(productos.map(producto =>
      producto.id === id ? { ...producto, cantidad: cantidadNumerica } : producto
    ));
  };

  const totalCompras = compras.reduce((sum, compra) => sum + compra.total, 0);
  const comprasCompletadas = compras.filter(compra => compra.estado === 'Completada');
  const promedioCompras = comprasCompletadas.length > 0
    ? comprasCompletadas.reduce((sum, compra) => sum + compra.total, 0) / comprasCompletadas.length
    : 0;

  const totalProductos = useMemo(() => {
    return productos.reduce((sum, producto) => sum + (producto.cantidad * producto.precio), 0);
  }, [productos]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const proveedorId = formData.get('proveedor');
    const fecha = formData.get('fecha');

    if (proveedorId && fecha && totalProductos > 0) {
      const compraData = {
        proveedor: proveedorId,
        fecha: new Date(fecha).toISOString(),
        total: totalProductos,
        productos,
        estado: 'Completada'
      };

      if (currentCompra) {
        updateData({ ...currentCompra, ...compraData, _id: currentCompra._id });
      } else {
        createData(compraData);
      }
      setIsOpen(false);
      setErrorMessage('');
    } else {
      setErrorMessage('Por favor, seleccione un proveedor, ingrese una fecha y al menos un producto.');
    }
  };

  const sortedCompras = React.useMemo(() => {
    let sortableCompras = [...compras];
    if (sortConfig.key !== null) {
      sortableCompras.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === 'ascending' ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === 'ascending' ? 1 : -1;
        }
        return 0;
      });
    }
    return sortableCompras;
  }, [compras, sortConfig]);

  const filteredCompras = sortedCompras.filter(compra =>
    compra._id.toLowerCase().includes(filterTerm.toLowerCase()) ||
    compra.fecha.toLowerCase().includes(filterTerm.toLowerCase()) ||
    compra.total.toString().includes(filterTerm)
  );

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentCompras = filteredCompras.slice(indexOfFirstItem, indexOfLastItem);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const requestSort = (key) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  return (
    <div className="container mx-auto p-6 space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold flex items-center">
          <DollarSign className="mr-2 h-8 w-8" />
          Gestión de Compras
        </h1>
        <Button onClick={handleNewCompra} className="bg-primary text-primary-foreground hover:bg-primary/90">
          <Plus className="mr-2 h-4 w-4" /> Nueva Compra
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Compras Totales</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalCompras.toFixed(2)}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Promedio de Compras</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${promedioCompras.toFixed(2)}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Última Compra</CardTitle>
            <CalendarDays className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {compras.length > 0 ? new Date(compras[compras.length - 1].fecha).toLocaleDateString() : 'N/A'}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="bg-background rounded-md border">
        <div className="p-4 flex items-center justify-between">
          <Input
            type="text"
            placeholder="Filtrar Compras..."
            value={filterTerm}
            onChange={(e) => setFilterTerm(e.target.value)}
            className="max-w-sm"
          />
          <Select value={itemsPerPage.toString()} onValueChange={(value) => setItemsPerPage(Number(value))}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Compras por página" />
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
              <TableHead className="cursor-pointer" onClick={() => requestSort('_id')}>ID</TableHead>
              <TableHead className="cursor-pointer" onClick={() => requestSort('fecha')}>Fecha</TableHead>
              <TableHead className="cursor-pointer" onClick={() => requestSort('total')}>Total</TableHead>
              <TableHead>Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {currentCompras.map(compra => (
              <TableRow key={compra._id}>
                <TableCell className="font-medium">{compra._id}</TableCell>
                <TableCell>{new Date(compra.fecha).toLocaleDateString()}</TableCell>
                <TableCell>${compra.total.toFixed(2)}</TableCell>
                <TableCell>
                  <Button onClick={() => handleEditCompra(compra)} variant="ghost" size="sm" className="mr-2">
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button onClick={() => handleDeleteCompra(compra)} variant="ghost" size="sm">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <div className="flex items-center justify-between p-4">
          <p className="text-sm text-muted-foreground">
            Mostrando {indexOfFirstItem + 1} a {Math.min(indexOfLastItem, filteredCompras.length)} de {filteredCompras.length} compras
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
            {Array.from({ length: Math.ceil(filteredCompras.length / itemsPerPage) }).map((_, index) => (
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
              disabled={currentPage === Math.ceil(filteredCompras.length / itemsPerPage)}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>{currentCompra ? 'Editar Compra' : 'Nueva Compra'}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="proveedor">Proveedor</Label>
              <Select name="proveedor" defaultValue={currentCompra ? currentCompra.proveedor : ''}>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccione un proveedor" />
                </SelectTrigger>
                <SelectContent>
                  {proveedores.map(proveedor => (
                    <SelectItem key={proveedor._id} value={proveedor._id}>{proveedor.nombre}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="fecha">Fecha</Label>
              <Input 
                type="date" 
                id="fecha" 
                name="fecha" 
                defaultValue={currentCompra ? new Date(currentCompra.fecha).toISOString().slice(0, 10) : ''} 
              />
            </div>

            <div className="space-y-2">
              <Label>Productos</Label>
              {productos.map(producto => (
                <div key={producto.id} className="flex items-center space-x-2 mb-2">
                  <Select value={producto.productoId} onValueChange={(value) => handleProductSelect(producto.id, value)}>
                    <SelectTrigger className="w-[200px]">
                      <SelectValue placeholder="Seleccione un producto" />
                    </SelectTrigger>
                    <SelectContent>
                      
                      {productosInventario.map(prod => (
                        <SelectItem key={prod._id} value={prod._id}>{prod.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Input
                    type="number"
                    value={producto.cantidad}
                    onChange={(e) => handleQuantityChange(producto.id, e.target.value)}
                    min="1"
                    className="w-20"
                  />
                  <span className="w-24 text-right">${(producto.cantidad * producto.precio).toFixed(2)}</span>
                  <Button type="button" variant="destructive" size="sm" onClick={() => handleRemoveProduct(producto.id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
              <Button type="button" onClick={handleAddProduct} variant="outline" size="sm">
                <Plus className="h-4 w-4 mr-2" /> Agregar Producto
              </Button>
            </div>

            <div className="flex justify-between items-center pt-4 border-t">
              <span className="font-semibold">Total:</span>
              <span className="text-xl font-bold">${totalProductos.toFixed(2)}</span>
            </div>

            {errorMessage && <p className="text-red-500">{errorMessage}</p>}

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>
                Cancelar
              </Button>
              <Button type="submit">Guardar</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={isConfirmDeleteOpen} onOpenChange={setIsConfirmDeleteOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmar Eliminación</DialogTitle>
          </DialogHeader>
          <p>¿Estás seguro de que deseas eliminar esta compra?</p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsConfirmDeleteOpen(false)}>Cancelar</Button>
            <Button variant="destructive" onClick={confirmDelete}>Eliminar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}