import React, { useContext, useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Package, Edit, Trash2, Plus, Search } from 'lucide-react'
import CrudContextPedidos from '../context/CrudContextPedidos'

export default function GestionPedidos() {
  const { db: pedidos, createData, updateData, deleteData, dataToEdit, setDataToEdit } = useContext(CrudContextPedidos)

  const [isOpen, setIsOpen] = useState(false)
  const [currentPedido, setCurrentPedido] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    if (dataToEdit) {
      setCurrentPedido(dataToEdit)
      setIsOpen(true)
    } else {
      setIsOpen(false)
    }
  }, [dataToEdit])

  const handleNewPedido = () => {
    setCurrentPedido(null)
    setIsOpen(true)
  }

  const handleEditPedido = (pedido) => {
    setDataToEdit(pedido)
    setIsOpen(true)
  }

  const handleDeletePedido = (id) => {
    deleteData(id)
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    const form = event.target
    const total = parseFloat(form.total.value) || 0

    const newPedido = {
      id: currentPedido?.id || Date.now().toString(),
      cliente: form.cliente.value,
      fecha: form.fecha.value,
      estado: form.estado.value,
      total,
    }

    if (currentPedido) {
      updateData(newPedido)
    } else {
      createData(newPedido)
    }
    setIsOpen(false)
    setDataToEdit(null)
  }

  // Filtrar pedidos según el término de búsqueda
  const filteredPedidos = pedidos.filter(pedido =>
    (pedido.id && pedido.id.toString().toLowerCase().includes(searchTerm.toLowerCase())) ||
    (pedido.cliente && pedido.cliente.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (pedido.fecha && pedido.fecha.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (pedido.estado && pedido.estado.toLowerCase().includes(searchTerm.toLowerCase()))
  )

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Gestión de Pedidos</h1>
        <div className="flex items-center space-x-4">
          <div className="relative">
            <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <Input 
              className="pl-8" 
              placeholder="Buscar pedidos..." 
              value={searchTerm} 
              onChange={(e) => setSearchTerm(e.target.value)} 
            />
          </div>
          <Button onClick={handleNewPedido}>
            <Plus className="mr-2 h-4 w-4" /> Nuevo Pedido
          </Button>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredPedidos.map((pedido) => (
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
              <p><strong>Total:</strong> ${isNaN(pedido.total) ? 'N/A' : pedido.total.toFixed(2)}</p>
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

      <Dialog open={isOpen} onOpenChange={(open) => {
        if (!open) {
          setDataToEdit(null)
        }
        setIsOpen(open)
      }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{currentPedido ? 'Editar Pedido' : 'Nuevo Pedido'}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="cliente">Cliente</Label>
              <Input id="cliente" name="cliente" defaultValue={currentPedido?.cliente || ''} />
            </div>
            <div>
              <Label htmlFor="fecha">Fecha</Label>
              <Input id="fecha" name="fecha" type="date" defaultValue={currentPedido?.fecha || ''} />
            </div>
            <div>
              <Label htmlFor="estado">Estado</Label>
              <Select id="estado" name="estado" defaultValue={currentPedido?.estado || 'Pendiente'}>
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
              <Input id="total" name="total" type="number" step="0.01" defaultValue={currentPedido?.total || ''} />
            </div>
            <Button type="submit">Guardar</Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
