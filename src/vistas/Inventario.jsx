import { useState, useContext, useMemo } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PencilIcon, PlusIcon, SearchIcon, ChevronUpIcon, ChevronDownIcon, ChevronsUpDown } from 'lucide-react';
import CrudContext from '../context/CrudContextInventario';

export default function Inventory() {
  const { db: products, createData, updateData } = useContext(CrudContext);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [editingProduct, setEditingProduct] = useState(null);
  const [isSuccessDialogOpen, setIsSuccessDialogOpen] = useState(false);
  const [isErrorDialogOpen, setIsErrorDialogOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [newProduct, setNewProduct] = useState({
    name: "",
    category: "",
    price: "",
    stock: "",
    status: "active",
    imageUrl: "",
  });

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Sorting state
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'ascending' });

  const filteredProducts = useMemo(() => {
    return products?.filter(product =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (categoryFilter === "all" || product.category === categoryFilter) &&
      (statusFilter === "all" || product.status === statusFilter)
    ).sort((a, b) => {
      if (sortConfig.key !== null) {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === 'ascending' ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === 'ascending' ? 1 : -1;
        }
      }
      return 0;
    });
  }, [products, searchTerm, categoryFilter, statusFilter, sortConfig]);

  const paginatedProducts = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredProducts?.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredProducts, currentPage, itemsPerPage]);

  const pageCount = Math.ceil((filteredProducts?.length || 0) / itemsPerPage);

  const handleEdit = (product) => {
    setEditingProduct({ ...product });
  };

  const handleStatusToggle = (id) => {
    const product = products.find(product => product.id === id);
    if (product) {
      const updatedProduct = { ...product, status: product.status === "active" ? "low" : "active" };
      updateData(updatedProduct);
    }
  };

  const handleAddProduct = () => {
    if (!newProduct.name || !newProduct.category || !newProduct.price || !newProduct.stock || !newProduct.imageUrl) {
      setErrorMessage("Todos los campos deben ser completados.");
      setIsErrorDialogOpen(true);
      return;
    }
  
    const price = parseFloat(newProduct.price);
    let stock = parseInt(newProduct.stock);
  
    if (isNaN(price) || price < 0) {
      setErrorMessage("El precio debe ser un número positivo.");
      setIsErrorDialogOpen(true);
      return;
    }
  
    if (isNaN(stock) || stock < 0) {
      setErrorMessage("El stock debe ser un número entero positivo.");
      setIsErrorDialogOpen(true);
      return;
    }
  
    const status = stock < 5 ? "low" : "active";
  
    const productToAdd = {
      ...newProduct,
      id: Date.now(),
      price,
      stock,
      status,
      ratings: 0,
      reviews: 0,
    };
  
    createData(productToAdd);
  
    setNewProduct({
      name: "",
      category: "",
      price: "",
      stock: "",
      status: "active",
      imageUrl: "",
    });
  };

  const handleSaveEdit = () => {
    if (editingProduct) {
      if (!editingProduct.name || !editingProduct.category || !editingProduct.price || !editingProduct.stock || !editingProduct.imageUrl) {
        setErrorMessage("Todos los campos deben ser completados.");
        setIsErrorDialogOpen(true);
        return;
      }
  
      const price = parseFloat(editingProduct.price);
      let stock = parseInt(editingProduct.stock);
  
      if (isNaN(price) || price < 0) {
        setErrorMessage("El precio debe ser un número positivo.");
        setIsErrorDialogOpen(true);
        return;
      }
  
      if (isNaN(stock) || stock < 0) {
        setErrorMessage("El stock debe ser un número entero positivo.");
        setIsErrorDialogOpen(true);
        return;
      }
  
      const status = stock < 5 ? "low" : "active";
  
      updateData({ ...editingProduct, price, stock, status });
      setEditingProduct(null);
      setIsSuccessDialogOpen(true);
  
      setTimeout(() => {
        setIsSuccessDialogOpen(false);
      }, 2000);
    }
  };

  const requestSort = (key) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  return (
    <div className="space-y-4 p-4 max-w-6xl mx-auto">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Inventario</h2>
        <Dialog>
          <DialogTrigger asChild>
            <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
              <PlusIcon className="w-4 h-4 mr-2" /> Agregar Producto
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-background">
            <DialogHeader>
              <DialogTitle>Agregar Nuevo Producto</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">Nombre</Label>
                <Input
                  id="name"
                  value={newProduct.name}
                  onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="category" className="text-right">Categoría</Label>
                <Select
                  id="category"
                  value={newProduct.category}
                  onValueChange={(value) => setNewProduct({ ...newProduct, category: value })}
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Seleccionar categoría" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Cuadernos">Cuadernos</SelectItem>
                    <SelectItem value="Escritura">Escritura</SelectItem>
                    <SelectItem value="Accesorios">Accesorios</SelectItem>
                    <SelectItem value="Organización">Organización</SelectItem>
                    <SelectItem value="Papel">Papel</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="price" className="text-right">Precio</Label>
                <Input
                  id="price"
                  type="number"
                  min="0"
                  value={newProduct.price}
                  onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="stock" className="text-right">Stock</Label>
                <Input
                  id="stock"
                  type="number"
                  min="0"
                  value={newProduct.stock}
                  onChange={(e) => setNewProduct({ ...newProduct, stock: e.target.value })}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="imageUrl" className="text-right">Imagen (URL)</Label>
                <Input
                  id="imageUrl"
                  type="text"
                  value={newProduct.imageUrl}
                  onChange={(e) => setNewProduct({ ...newProduct, imageUrl: e.target.value })}
                  className="col-span-3"
                />
              </div>
            </div>
            <DialogFooter>
              <Button onClick={handleAddProduct}>
                Agregar Producto
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between mb-4">
        <div className="flex items-center w-full sm:w-auto">
          <Input 
            placeholder="Buscar productos..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-sm"
          />
          <SearchIcon className="w-5 h-5 -ml-8 text-muted-foreground" />
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

      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[200px] cursor-pointer" onClick={() => requestSort('name')}>
                Nombre {sortConfig.key === 'name' && (sortConfig.direction === 'ascending' ? <ChevronUpIcon className="inline" /> : <ChevronDownIcon className="inline" />)}
              </TableHead>
              <TableHead className="cursor-pointer" onClick={() => requestSort('category')}>
                Categoría {sortConfig.key === 'category' && (sortConfig.direction === 'ascending' ? <ChevronUpIcon className="inline" /> : <ChevronDownIcon className="inline" />)}
              </TableHead>
              <TableHead className="cursor-pointer" onClick={() => requestSort('price')}>
                Precio {sortConfig.key === 'price' && (sortConfig.direction === 'ascending' ? <ChevronUpIcon className="inline" /> : <ChevronDownIcon className="inline" />)}
              </TableHead>
              <TableHead className="cursor-pointer" onClick={() => requestSort('stock')}>
                Stock {sortConfig.key === 'stock' && (sortConfig.direction === 'ascending' ? <ChevronUpIcon className="inline" /> : <ChevronDownIcon className="inline" />)}
              </TableHead>
              <TableHead className="cursor-pointer" onClick={() => requestSort('status')}>
                Estado {sortConfig.key === 'status' && (sortConfig.direction === 'ascending' ? <ChevronUpIcon className="inline" /> : <ChevronDownIcon className="inline" />)}
              </TableHead>
              <TableHead className="text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedProducts?.map((product) => (
              <TableRow key={product.id}>
                <TableCell>{product.name}</TableCell>
                <TableCell>{product.category}</TableCell>
                <TableCell>${Number(product.price).toFixed(2)}</TableCell>
                <TableCell>{product.stock}</TableCell>
                <TableCell>
                  <Badge 
                    variant={product.status === "active" ? "success" : "warning"}
                    className={product.status === "active" ? "bg-green-500 text-white" : "bg-yellow-500 text-black"}
                  >
                    {product.status === "active" ? "Activo" : "Bajo stock"}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end space-x-2">
                    <Button 
                      onClick={() => handleEdit(product)}
                      variant="outline"
                      size="sm"
                      disabled={product.status === "low"}  
                    >
                      <PencilIcon className="w-4 h-4 mr-2" />
                      Editar
                    </Button>
                    <Button 
                      onClick={() => handleStatusToggle(product.id)}
                      variant={product.status === "active" ? "destructive" : "default"}
                      size="sm"
                    >
                      {product.status ===   "active" ? "Marcar Bajo stock" : "Marcar Activo"}
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          Mostrando {Math.min((currentPage - 1) * itemsPerPage + 1, filteredProducts?.length || 0)} a {Math.min(currentPage * itemsPerPage, filteredProducts?.length || 0)} de {filteredProducts?.length || 0} productos
        </p>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
          >
            Anterior
          </Button>
          {Array.from({ length: pageCount }, (_, i) => i + 1).map((page) => (
            <Button
              key={page}
              variant={currentPage === page ? "default" : "outline"}
              size="sm"
              onClick={() => setCurrentPage(page)}
            >
              {page}
            </Button>
          ))}
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, pageCount))}
            disabled={currentPage === pageCount}
          >
            Siguiente
          </Button>
        </div>
      </div>

      <Dialog open={!!editingProduct} onOpenChange={(open) => !open && setEditingProduct(null)}>
        <DialogContent className="bg-background">
          <DialogHeader>
            <DialogTitle>Editar Producto</DialogTitle>
          </DialogHeader>
          {editingProduct && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-name" className="text-right">Nombre</Label>
                <Input
                  id="edit-name"
                  value={editingProduct.name}
                  onChange={(e) => setEditingProduct({ ...editingProduct, name: e.target.value })}
                  className="col-span-3"
                  disabled={editingProduct.status === "low"}
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-category" className="text-right">Categoría</Label>
                <Select
                  id="edit-category"
                  value={editingProduct.category}
                  onValueChange={(value) => setEditingProduct({ ...editingProduct, category: value })}
                  disabled={editingProduct.status === "low"}
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Cuadernos">Cuadernos</SelectItem>
                    <SelectItem value="Escritura">Escritura</SelectItem>
                    <SelectItem value="Accesorios">Accesorios</SelectItem>
                    <SelectItem value="Organización">Organización</SelectItem>
                    <SelectItem value="Papel">Papel</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-price" className="text-right">Precio</Label>
                <Input
                  id="edit-price"
                  type="number"
                  value={editingProduct.price}
                  onChange={(e) => setEditingProduct({ ...editingProduct, price: e.target.value })}
                  className="col-span-3"
                  disabled={editingProduct.status === "low"}
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-stock" className="text-right">Stock</Label>
                <Input
                  id="edit-stock"
                  type="number"
                  value={editingProduct.stock}
                  onChange={(e) => setEditingProduct({ ...editingProduct, stock: e.target.value })}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-image" className="text-right">Imagen (URL)</Label>
                <Input
                  id="edit-image"
                  type="text"
                  value={editingProduct.imageUrl}
                  onChange={(e) => setEditingProduct({ ...editingProduct, imageUrl: e.target.value })}
                  className="col-span-3"
                />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button onClick={handleSaveEdit}>
              Guardar Cambios
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isSuccessDialogOpen} onOpenChange={() => setIsSuccessDialogOpen(false)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Éxito</DialogTitle>
          </DialogHeader>
          <p className="text-green-600">Los cambios se han guardado exitosamente.</p>
        </DialogContent>
      </Dialog>

      <Dialog open={isErrorDialogOpen} onOpenChange={() => setIsErrorDialogOpen(false)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Error</DialogTitle>
          </DialogHeader>
          <p className="text-red-600">{errorMessage}</p>
        </DialogContent>
      </Dialog>
    </div>
  );
}