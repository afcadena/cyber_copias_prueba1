import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { DollarSign, CalendarDays, TrendingUp, Plus, Edit, Trash2, Search, BarChart2 } from 'lucide-react'

export default function GestionVentas() {
  const [ventas, setVentas] = useState([
    { id: 1, cliente: 'Juan Pérez', fecha: '2023-06-01', total: 150.00, estado: 'Completada' },
    { id: 2, cliente: 'María García', fecha: '2023-06-02', total: 200.50, estado: 'Pendiente' },
    { id: 3, cliente: 'Carlos López', fecha: '2023-06-03', total: 75.25, estado: 'Anulada' },
    { id: 4, cliente: 'Ana Martínez', fecha: '2023-06-04', total: 300.00, estado: 'Completada' },
    { id: 5, cliente: 'Pedro Rodríguez', fecha: '2023-06-05', total: 180.75, estado: 'Completada' },
  ])

  const [isOpen, setIsOpen] = useState(false)
  const [currentVenta, setCurrentVenta] = useState(null)
  const [productos, setProductos] = useState([])

  const handleNewVenta = () => {
    setCurrentVenta(null)
    setProductos([])
    setIsOpen(true)
  }

  const handleEditVenta = (venta) => {
    setCurrentVenta(venta)
    setProductos([]) // Aquí deberías cargar los productos de la venta
    setIsOpen(true)
  }

  const handleDeleteVenta = (id) => {
    setVentas(ventas.filter(venta => venta.id !== id))
  }

  const handleAddProduct = () => {
    setProductos([...productos, { id: Date.now(), nombre: '', cantidad: 1, precio: 0 }])
  }

  const handleProductChange = (id, field, value) => {
    setProductos(productos.map(producto => 
      producto.id === id ? { ...producto, [field]: value } : producto
    ))
  }

  const totalVentas = ventas.reduce((sum, venta) => sum + venta.total, 0)
  const ventasCompletadas = ventas.filter(venta => venta.estado === 'Completada')
  const promedioVentas = ventasCompletadas.length > 0 
    ? ventasCompletadas.reduce((sum, venta) => sum + venta.total, 0) / ventasCompletadas.length 
    : 0

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
                    venta.estado === 'Completada' ? 'bg-green-100 text-green-800' :
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
                  <Button variant="ghost" size="sm" onClick={() => handleDeleteVenta(venta.id)}>
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
          <form className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="cliente">Cliente</Label>
                <Input id="cliente" defaultValue={currentVenta?.cliente} />
              </div>
              <div>
                <Label htmlFor="fecha">Fecha</Label>
                <Input id="fecha" type="date" defaultValue={currentVenta?.fecha} />
              </div>
            </div>
            <div>
              <Label>Productos</Label>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Producto</TableHead>
                    <TableHead>Cantidad</TableHead>
                    <TableHead>Precio</TableHead>
                    <TableHead>Subtotal</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {productos.map((producto) => (
                    <TableRow key={producto.id}>
                      <TableCell>
                        <Input 
                          value={producto.nombre} 
                          onChange={(e) => handleProductChange(producto.id, 'nombre', e.target.value)}
                        />
                      </TableCell>
                      <TableCell>
                        <Input 
                          type="number" 
                          value={producto.cantidad} 
                          onChange={(e) => handleProductChange(producto.id, 'cantidad', parseInt(e.target.value))}
                        />
                      </TableCell>
                      <TableCell>
                        <Input 
                          type="number" 
                          value={producto.precio} 
                          onChange={(e) => handleProductChange(producto.id, 'precio', parseFloat(e.target.value))}
                        />
                      </TableCell>
                      <TableCell>${(producto.cantidad * producto.precio).toFixed(2)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              <Button type="button" onClick={handleAddProduct} className="mt-2">Agregar Producto</Button>
            </div>
            <div>
              <Label htmlFor="total">Total</Label>
              <Input id="total" type="number" step="0.01" value={productos.reduce((sum, p) => sum + p.cantidad * p.precio, 0).toFixed(2)} readOnly />
            </div>
            <div>
              <Label htmlFor="estado">Estado</Label>
              <Select defaultValue={currentVenta?.estado}>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar estado" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Pendiente">Pendiente</SelectItem>
                  <SelectItem value="Completada">Completada</SelectItem>
                  <SelectItem value="Anulada">Anulada</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button type="submit">Guardar</Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}