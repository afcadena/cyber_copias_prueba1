import { useState } from 'react'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { PencilIcon, TrashIcon, PlusIcon, SearchIcon } from 'lucide-react'

// Simulated product data for a stationery store
const initialProducts = [
  { id: 1, name: "Cuaderno espiral", category: "Cuadernos", price: 3.99, stock: 100, status: "active" },
  { id: 2, name: "Bolígrafo azul", category: "Escritura", price: 0.99, stock: 500, status: "active" },
  { id: 3, name: "Goma de borrar", category: "Accesorios", price: 0.50, stock: 200, status: "active" },
  { id: 4, name: "Carpeta archivadora", category: "Organización", price: 4.99, stock: 50, status: "active" },
  { id: 5, name: "Papel de impresora", category: "Papel", price: 7.99, stock: 30, status: "low" },
]

export default function Inventory() {
  const [products, setProducts] = useState(initialProducts)
  const [searchTerm, setSearchTerm] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")
  const [editingProduct, setEditingProduct] = useState(null)

  const filteredProducts = products.filter(product => 
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
    (categoryFilter === "all" || product.category === categoryFilter) &&
    (statusFilter === "all" || product.status === statusFilter)
  )

  const handleEdit = (product) => {
    setEditingProduct(product)
  }

  const handleStatusToggle = (id) => {
    setProducts(products.map(product => 
      product.id === id 
        ? { ...product, status: product.status === "active" ? "low" : "active" } 
        : product
    ))
  }

  const handleSaveEdit = (editedProduct) => {
    setProducts(products.map(product => 
      product.id === editedProduct.id ? editedProduct : product
    ))
    setEditingProduct(null)
  }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold mb-4">Inventario</h2>
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between mb-4">
        <div className="flex items-center w-full sm:w-auto">
          <Input 
            placeholder="Buscar productos..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-sm"
          />
          <SearchIcon className="w-5 h-5 -ml-8 text-gray-500" />
        </div>
        <div className="flex gap-2 w-full sm:w-auto">
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Categoría" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas las categorías</SelectItem>
              <SelectItem value="Cuadernos">Cuadernos</SelectItem>
              <SelectItem value="Escritura">Escritura</SelectItem>
              <SelectItem value="Accesorios">Accesorios</SelectItem>
              <SelectItem value="Organización">Organización</SelectItem>
              <SelectItem value="Papel">Papel</SelectItem>
            </SelectContent>
          </Select>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Estado" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos los estados</SelectItem>
              <SelectItem value="active">Activo</SelectItem>
              <SelectItem value="low">Bajo stock</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nombre</TableHead>
            <TableHead>Categoría</TableHead>
            <TableHead>Precio</TableHead>
            <TableHead>Stock</TableHead>
            <TableHead>Estado</TableHead>
            <TableHead>Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredProducts.map((product) => (
            <TableRow key={product.id}>
              <TableCell>{product.name}</TableCell>
              <TableCell>{product.category}</TableCell>
              <TableCell>${product.price.toFixed(2)}</TableCell>
              <TableCell>{product.stock}</TableCell>
              <TableCell>
                <Badge variant={product.status === "active" ? "success" : "warning"}>
                  {product.status === "active" ? "Activo" : "Bajo stock"}
                </Badge>
              </TableCell>
              <TableCell>
                <div className="flex space-x-2">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="outline" size="sm" onClick={() => handleEdit(product)}>
                        <PencilIcon className="w-4 h-4 mr-1" /> Editar
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Editar Producto</DialogTitle>
                      </DialogHeader>
                      <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="name" className="text-right">Nombre</Label>
                          <Input 
                            id="name" 
                            value={editingProduct?.name || ''} 
                            onChange={(e) => setEditingProduct({...editingProduct, name: e.target.value})}
                            className="col-span-3"
                          />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="price" className="text-right">Precio</Label>
                          <Input 
                            id="price" 
                            type="number"
                            value={editingProduct?.price || ''} 
                            onChange={(e) => setEditingProduct({...editingProduct, price: parseFloat(e.target.value)})}
                            className="col-span-3"
                          />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="stock" className="text-right">Stock</Label>
                          <Input 
                            id="stock" 
                            type="number"
                            value={editingProduct?.stock || ''} 
                            onChange={(e) => setEditingProduct({...editingProduct, stock: parseInt(e.target.value)})}
                            className="col-span-3"
                          />
                        </div>
                      </div>
                      <Button onClick={() => handleSaveEdit(editingProduct)}>Guardar Cambios</Button>
                    </DialogContent>
                  </Dialog>
                  <Button 
                    variant={product.status === "active" ? "warning" : "default"}
                    size="sm"
                    onClick={() => handleStatusToggle(product.id)}
                  >
                    <TrashIcon className="w-4 h-4 mr-1" /> 
                    {product.status === "active" ? "Marcar bajo stock" : "Marcar activo"}
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <Dialog>
        <DialogTrigger asChild>
          <Button className="mt-4">
            <PlusIcon className="w-4 h-4 mr-2" /> Agregar Nuevo Producto
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Agregar Nuevo Producto</DialogTitle>
          </DialogHeader>
          {/* Add form fields for new product here */}
        </DialogContent>
      </Dialog>
    </div>
  )
}