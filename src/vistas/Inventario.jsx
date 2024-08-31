import { useState } from 'react'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { PencilIcon, TrashIcon, PlusIcon, SearchIcon } from 'lucide-react'

// Simulated product data
const initialProducts = [
  { id: 1, name: "Laptop", category: "Electronics", price: 999.99, stock: 50, status: "active" },
  { id: 2, name: "Desk Chair", category: "Furniture", price: 199.99, stock: 30, status: "active" },
  { id: 3, name: "Coffee Maker", category: "Appliances", price: 79.99, stock: 20, status: "inactive" },
  { id: 4, name: "Wireless Mouse", category: "Electronics", price: 29.99, stock: 100, status: "active" },
  { id: 5, name: "Bookshelf", category: "Furniture", price: 149.99, stock: 15, status: "active" },
]

export default function InventoryManagement() {
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
        ? { ...product, status: product.status === "active" ? "inactive" : "active" } 
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
    <div className="container mx-auto p-6 space-y-8">
      <h1 className="text-3xl font-bold">Inventory Management</h1>
      
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="flex items-center w-full sm:w-auto">
          <Input 
            placeholder="Search products..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-sm"
          />
          <SearchIcon className="w-5 h-5 -ml-8 text-gray-500" />
        </div>
        <div className="flex gap-2 w-full sm:w-auto">
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              <SelectItem value="Electronics">Electronics</SelectItem>
              <SelectItem value="Furniture">Furniture</SelectItem>
              <SelectItem value="Appliances">Appliances</SelectItem>
            </SelectContent>
          </Select>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Price</TableHead>
            <TableHead>Stock</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Actions</TableHead>
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
                <Badge variant={product.status === "active" ? "success" : "destructive"}>
                  {product.status}
                </Badge>
              </TableCell>
              <TableCell>
                <div className="flex space-x-2">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="outline" size="sm" onClick={() => handleEdit(product)}>
                        <PencilIcon className="w-4 h-4 mr-1" /> Edit
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Edit Product</DialogTitle>
                      </DialogHeader>
                      <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="name" className="text-right">Name</Label>
                          <Input 
                            id="name" 
                            value={editingProduct?.name || ''} 
                            onChange={(e) => setEditingProduct({...editingProduct, name: e.target.value})}
                            className="col-span-3"
                          />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="price" className="text-right">Price</Label>
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
                      <Button onClick={() => handleSaveEdit(editingProduct)}>Save Changes</Button>
                    </DialogContent>
                  </Dialog>
                  <Button 
                    variant={product.status === "active" ? "destructive" : "default"}
                    size="sm"
                    onClick={() => handleStatusToggle(product.id)}
                  >
                    <TrashIcon className="w-4 h-4 mr-1" /> 
                    {product.status === "active" ? "Disable" : "Enable"}
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <Dialog>
        <DialogTrigger asChild>
          <Button>
            <PlusIcon className="w-4 h-4 mr-2" /> Add New Product
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Product</DialogTitle>
          </DialogHeader>
          {/* Add form fields for new product here */}
        </DialogContent>
      </Dialog>
    </div>
  )
}