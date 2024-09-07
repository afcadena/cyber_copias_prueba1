import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Package, Edit, Trash2, Plus, Search } from 'lucide-react'

export default function GestionPedidos() {
  const [pedidos, setPedidos] = useState([
    { id: 1, cliente: 'Juan Pérez', fecha: '2023-06-01', estado: 'Pendiente', total: 150.00 },
    { id: 2, cliente: 'María García', fecha: '2023-06-02', estado: 'Entregado', total: 200.50 },
    { id: 3, cliente: 'Carlos López', fecha: '2023-06-03', estado: 'En proceso', total: 75.25 },
  ])

  const [isOpen, setIsOpen] = useState(false)
  const [currentPedido, setCurrentPedido] = useState(null)

  const handleNewPedido = () => {
    setCurrentPedido(null)
    setIsOpen(true)
  }

  const handleEditPedido = (pedido) => {
    setCurrentPedido(pedido)
    setIsOpen(true)
  }

  const handleDeletePedido = (id) => {
    setPedidos(pedidos.filter(pedido => pedido.id !== id))
  }

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Gestión de Pedidos</h1>
        <div className="flex items-center space-x-4">
          <div className="relative">
            <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <Input className="pl-8" placeholder="Buscar pedidos..." />
          </div>
          <Button onClick={handleNewPedido}>
            <Plus className="mr-2 h-4 w-4" /> Nuevo Pedido
          </Button>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {pedidos.map((pedido) => (
          <Card key={pedido.id} className="overflow-hidden">
            <CardHeader className="bg-primary text-primary-foreground">
              <CardTitle className="flex justify-between items-center">
                <span>Pedido #{pedido.id}</span>
                <Package className="h-6 w-6" />
              </CardTitle>
              <CardDescription className="text-primary-foreground/80">{pedido.fecha}</CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <p><strong>Cliente:</strong> {pedido.cliente}</p>
              <p><strong>Estado:</strong> {pedido.estado}</p>
              <p><strong>Total:</strong> ${pedido.total.toFixed(2)}</p>
            </CardContent>
            <CardFooter className="bg-muted">
              <div className="flex justify-between w-full">
                <Button variant="outline" size="sm" onClick={() => handleEditPedido(pedido)}>
                  <Edit className="mr-2 h-4 w-4" /> Editar
                </Button>
                <Button variant="destructive" size="sm" onClick={() => handleDeletePedido(pedido.id)}>
                  <Trash2 className="mr-2 h-4 w-4" /> Eliminar
                </Button>
              </div>
            </CardFooter>
          </Card>
        ))}
      </div>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{currentPedido ? 'Editar Pedido' : 'Nuevo Pedido'}</DialogTitle>
          </DialogHeader>
          <form className="space-y-4">
            <div>
              <Label htmlFor="cliente">Cliente</Label>
              <Input id="cliente" defaultValue={currentPedido?.cliente} />
            </div>
            <div>
              <Label htmlFor="fecha">Fecha</Label>
              <Input id="fecha" type="date" defaultValue={currentPedido?.fecha} />
            </div>
            <div>
              <Label htmlFor="estado">Estado</Label>
              <Select defaultValue={currentPedido?.estado}>
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
              <Label htmlFor="total">Total</Label>
              <Input id="total" type="number" step="0.01" defaultValue={currentPedido?.total} />
            </div>
            <Button type="submit">Guardar</Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}