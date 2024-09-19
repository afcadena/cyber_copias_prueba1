import { useState, useContext, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign, CalendarDays, TrendingUp, Plus, Edit, Trash2 } from 'lucide-react';
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
      deleteData(compraToDelete.id);
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
    const selectedProduct = productosInventario.find(prod => prod.id === productoId);
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

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const proveedorId = formData.get('proveedor');
    const fecha = formData.get('fecha');
    const total = productos.reduce((sum, p) => sum + p.cantidad * p.precio, 0);

    if (proveedorId && fecha && total > 0) {
      const compraData = { proveedorId, fecha, total, productos, estado: 'Completada' };
      if (currentCompra) {
        updateData({ ...currentCompra, ...compraData });
      } else {
        createData(compraData);
      }
      setIsOpen(false);
      setErrorMessage('');
    } else {
      setErrorMessage('Por favor, seleccione un proveedor, ingrese una fecha y al menos un producto.');
    }
  };

  return (
    <div className="container mx-auto p-6 overflow-hidden">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-extrabold flex items-center">
          <DollarSign className="mr-3 h-9 w-9" />
          Gestión de Compras
        </h1>
        <div className="flex items-center space-x-6">
          <Button onClick={handleNewCompra} className="bg-blue-600 text-white hover:bg-blue-700">
            <Plus className="mr-2 h-5 w-5" /> Nueva Compra
          </Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3 mb-8">
        <Card className="bg-white shadow-lg border border-gray-200 overflow-hidden">
          <CardHeader className="flex items-center justify-between space-y-0 pb-3">
            <CardTitle className="text-md font-semibold">Compras Totales</CardTitle>
            <DollarSign className="h-5 w-5 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-xl font-bold">${totalCompras.toFixed(2)}</div>
          </CardContent>
        </Card>

        <Card className="bg-white shadow-lg border border-gray-200 overflow-hidden">
          <CardHeader className="flex items-center justify-between space-y-0 pb-3">
            <CardTitle className="text-md font-semibold">Promedio de Compras</CardTitle>
            <TrendingUp className="h-5 w-5 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-xl font-bold">${promedioCompras.toFixed(2)}</div>
          </CardContent>
        </Card>

        <Card className="bg-white shadow-lg border border-gray-200 overflow-hidden">
          <CardHeader className="flex items-center justify-between space-y-0 pb-3">
            <CardTitle className="text-md font-semibold">Última Compra</CardTitle>
            <CalendarDays className="h-5 w-5 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-xl font-bold">{compras[compras.length - 1]?.fecha || 'N/A'}</div>
          </CardContent>
        </Card>
      </div>

      <div className="bg-white shadow-lg rounded-lg overflow-hidden border border-gray-200">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Fecha</TableHead>
              <TableHead>Proveedor</TableHead>
              <TableHead>Total</TableHead>
              <TableHead className="text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {compras.map((compra) => {
              const proveedor = proveedores.find(p => p.id === compra.proveedorId);
              return (
                <TableRow key={compra.id} className="hover:bg-gray-50">
                  <TableCell className="font-medium">{compra.id}</TableCell>
                  <TableCell>{compra.fecha}</TableCell>
                  <TableCell>{proveedor ? proveedor.nombre : 'Desconocido'}</TableCell>
                  <TableCell>${compra.total.toFixed(2)}</TableCell>
                  <TableCell className="text-right">
                    <Button onClick={() => handleEditCompra(compra)} className="bg-blue-600 text-white hover:bg-blue-700 mr-2">
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button onClick={() => handleDeleteCompra(compra)} className="bg-red-600 text-white hover:bg-red-700">
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>

      {/* Modal de Confirmación de Eliminación */}
      <Dialog open={isConfirmDeleteOpen} onOpenChange={setIsConfirmDeleteOpen}>
        <DialogContent className="flex flex-col justify-center items-center p-6">
          <DialogHeader>
            <DialogTitle>Confirmar Eliminación</DialogTitle>
          </DialogHeader>
          <p className="text-lg mb-4">¿Estás seguro de que deseas eliminar esta compra?</p>
          <div className="flex space-x-4">
            <Button onClick={confirmDelete} className="bg-red-600 text-white hover:bg-red-700">
              Eliminar
            </Button>
            <Button onClick={() => setIsConfirmDeleteOpen(false)} className="bg-gray-600 text-white hover:bg-gray-700">
              Cancelar
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Modal de Compra */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="w-full max-w-4xl p-6">
          <DialogHeader>
            <DialogTitle>{currentCompra ? 'Editar Compra' : 'Nueva Compra'}</DialogTitle>
          </DialogHeader>
          {errorMessage && <p className="text-red-600 mb-4">{errorMessage}</p>}
          <form onSubmit={handleSubmit}>
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <Label htmlFor="proveedor" className="block mb-2">Proveedor</Label>
                <select name="proveedor" id="proveedor" className="border border-gray-300 rounded-lg p-2 w-full" defaultValue={currentCompra?.proveedorId || ''}>
                  <option value="">Seleccionar Proveedor</option>
                  {proveedores.map(proveedor => (
                    <option key={proveedor.id} value={proveedor.id}>{proveedor.nombre}</option>
                  ))}
                </select>
              </div>
              <div>
                <Label htmlFor="fecha" className="block mb-2">Fecha</Label>
                <Input type="date" name="fecha" id="fecha" defaultValue={currentCompra?.fecha || ''} />
              </div>
            </div>
            <div className="my-6">
              <h2 className="text-lg font-bold mb-4">Productos</h2>
              <div className="space-y-4">
                {productos.map(producto => (
                  <div key={producto.id} className="flex items-center space-x-4 border-b border-gray-200 pb-4">
                    <select
                      value={producto.productoId}
                      onChange={(e) => handleProductSelect(producto.id, e.target.value)}
                      className="border border-gray-300 rounded-lg p-2 w-1/3"
                    >
                      <option value="">Seleccionar Producto</option>
                      {productosInventario.map(prod => (
                        <option key={prod.id} value={prod.id}>{prod.name}</option>
                      ))}
                    </select>
                    <Input
                      type="number"
                      value={producto.cantidad}
                      onChange={(e) => handleQuantityChange(producto.id, e.target.value)}
                      className="border border-gray-300 rounded-lg p-2 w-1/4"
                      min="1"
                    />
                    <div className="w-1/4 text-center">
                      ${producto.precio.toFixed(2)}
                    </div>
                    <Button onClick={() => handleRemoveProduct(producto.id)} className="bg-red-600 text-white hover:bg-red-700">
                      Eliminar
                    </Button>
                  </div>
                ))}
                <Button onClick={handleAddProduct} className="bg-green-600 text-white hover:bg-green-700 mt-4">
                  Añadir Producto
                </Button>
              </div>
            </div>
            <div className="text-right mt-6">
              <Button type="submit" className="bg-blue-600 text-white hover:bg-blue-700">
                {currentCompra ? 'Actualizar Compra' : 'Guardar Compra'}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
