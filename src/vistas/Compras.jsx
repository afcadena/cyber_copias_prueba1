import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { ShoppingCart, Filter, Plus, Edit, Trash2, Search } from 'lucide-react'

export default function GestionCompras() {
  const [compras, setCompras] = useState([
    { id: 1, proveedor: 'Papelería Mayorista', fecha: '2023-06-01', total: 1500.00, estado: 'Recibido' },
    { id: 2, proveedor: 'Distribuidora de Útiles', fecha: '2023-06-05', total: 2000.50, estado: 'Pendiente' },
    { id: 3, proveedor: 'Importadora de Artículos', fecha: '2023-06-10', total: 750.25, estado: 'En tránsito' },
  ])

  const [isOpen, setIsOpen] = useState(false)
  const [currentCompra, setCurrentCompra] = useState(null)

  const handleNewCompra = () => {
    setCurrentCompra(null)
    setIsOpen(true)
  }

  const handleEditCompra = (compra) => {
    setCurrentCompra(compra)
    setIsOpen(true)
  }

  const handleDeleteCompra = (id) => {
    setCompras(compras.filter(compra => compra.id !== id))
  }

  const getStatusBadge = (status) => {
    const statusStyles = {
      'Recibido': 'bg-green-100 text-green-800',
      'Pendiente': 'bg-yellow-100 text-yellow-800',
      'En tránsito': 'bg-blue-100 text-blue-800'
    }
    return <Badge className={statusStyles[status]}>{status}</Badge>
  }

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
            <Input className="pl-8" placeholder="Buscar compras..." />
          </div>
          <Select>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filtrar por estado" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todos">Todos</SelectItem>
              <SelectItem value="recibido">Recibido</SelectItem>
              <SelectItem value="pendiente">Pendiente</SelectItem>
              <SelectItem value="en-transito">En tránsito</SelectItem>
            </SelectContent>
          </Select>
          <Button onClick={handleNewCompra}>
            <Plus className="mr-2 h-4 w-4" /> Nueva Compra
          </Button>
        </div>
      </div>
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Proveedor</TableHead>
              <TableHead>Fecha</TableHead>
              <TableHead>Total</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead className="text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {compras.map((compra) => (
              <TableRow key={compra.id}>
                <TableCell className="font-medium">{compra.id}</TableCell>
                <TableCell>{compra.proveedor}</TableCell>
                <TableCell>{compra.fecha}</TableCell>
                <TableCell>${compra.total.toFixed(2)}</TableCell>
                <TableCell>{getStatusBadge(compra.estado)}</TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="sm" onClick={() => handleEditCompra(compra)}>
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => handleDeleteCompra(compra.id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{currentCompra ? 'Editar Compra' : 'Nueva Compra'}</DialogTitle>
          </DialogHeader>
          <form className="space-y-4">
            <div>
              <Label htmlFor="proveedor">Proveedor</Label>
              <Select defaultValue={currentCompra?.proveedor}>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar proveedor" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Papelería Mayorista">Papelería Mayorista</SelectItem>
                  <SelectItem value="Distribuidora de Útiles">Distribuidora de Útiles</SelectItem>
                  <SelectItem value="Importadora de Artículos">Importadora de Artículos</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="fecha">Fecha</Label>
              <Input id="fecha" type="date" defaultValue={currentCompra?.fecha} />
            </div>
            <div>
              <Label htmlFor="total">Total</Label>
              <Input id="total" type="number" step="0.01" defaultValue={currentCompra?.total} />
            </div>
            <div>
              <Label htmlFor="estado">Estado</Label>
              <Select defaultValue={currentCompra?.estado}>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar estado" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Pendiente">Pendiente</SelectItem>
                  <SelectItem value="En tránsito">En tránsito</SelectItem>
                  <SelectItem value="Recibido">Recibido</SelectItem>
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