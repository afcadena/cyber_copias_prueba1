import { useState, useEffect } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { Checkbox } from "@/components/ui/checkbox";
import { SearchIcon, ShoppingCartIcon, HeartIcon, StarIcon } from 'lucide-react';
import ProductDetail from './producto'; // Asegúrate de importar el componente ProductDetail

const categories = ["Todos", "Escritura", "Cuadernos", "Papel", "Arte", "Accesorios", "Coleccionables"];

export default function Catalog() {
  const [products, setProducts] = useState([]);  // Estado para los productos
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("Todos");
  const [sortOrder, setSortOrder] = useState("recommended");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedProduct, setSelectedProduct] = useState(null);  // Estado para el producto seleccionado
  const productsPerPage = 12;

  // Obtener productos desde la API
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch("http://localhost:3000/products");
        const data = await response.json();
        setProducts(data);  // Almacenar los productos en el estado
      } catch (error) {
        console.error("Error al cargar productos:", error);
      }
    };
    fetchProducts();
  }, []);

  const filteredProducts = products.filter(product => 
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
    (categoryFilter === "Todos" || product.category === categoryFilter)
  ).sort((a, b) => {
    if (sortOrder === "priceLowToHigh") return a.price - b.price;
    if (sortOrder === "priceHighToLow") return b.price - a.price;
    return 0; // Para "recommended", simplemente usamos el orden original
  });

  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const handleProductClick = (product) => {
    setSelectedProduct(product);  // Establecer el producto seleccionado
  };

  return (
    <div className="flex flex-col md:flex-row gap-8 p-6 bg-gray-100">
      {/* Category sidebar */}
      <aside className="md:w-64">
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h3 className="text-lg font-semibold mb-4">Categorías</h3>
          <ul className="space-y-2">
            {categories.map((category) => (
              <li key={category}>
                <div className="flex items-center">
                  <Checkbox
                    id={category}
                    checked={categoryFilter === category}
                    onCheckedChange={() => setCategoryFilter(category)}
                  />
                  <label htmlFor={category} className="ml-2 text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                    {category}
                  </label>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1">
        <div className="bg-white p-6 rounded-lg shadow-sm">
          {/* Filtering and sorting options */}
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-between mb-6">
            <div className="flex items-center w-full sm:w-auto">
              <Input 
                placeholder="Buscar productos..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="max-w-sm"
              />
              <SearchIcon className="w-5 h-5 -ml-8 text-gray-500" />
            </div>
            <Select value={sortOrder} onValueChange={setSortOrder}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Ordenar por" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="recommended">Recomendados</SelectItem>
                <SelectItem value="priceLowToHigh">Precio: Menor a Mayor</SelectItem>
                <SelectItem value="priceHighToLow">Precio: Mayor a Menor</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Product grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {currentProducts.map((product) => (
              <Card 
                key={product.id} 
                className="flex flex-col justify-between cursor-pointer"
                onClick={() => handleProductClick(product)} // Manejar el clic en el producto
              >
                <CardHeader className="p-4">
                  <img src={product.image} alt={product.name} className="w-full h-48 object-contain" />
                </CardHeader>
                <CardContent className="p-4">
                  <CardTitle className="text-sm font-medium line-clamp-2 mb-2">{product.name}</CardTitle>
                  <div className="flex items-center mb-2">
                    {[...Array(5)].map((_, i) => (
                      <StarIcon key={i} className={`w-4 h-4 ${i < Math.floor(product.rating) ? 'text-yellow-400' : 'text-gray-300'}`} />
                    ))}
                    <span className="ml-1 text-sm text-gray-600">({product.reviews})</span>
                  </div>
                  <p className="text-lg font-bold">${product.price.toLocaleString()}</p>
                  <Badge variant="secondary" className="mt-2">{product.category}</Badge>
                </CardContent>
                <CardFooter className="p-4 pt-0">
                  <Button className="w-full">
                    <ShoppingCartIcon className="w-4 h-4 mr-2" />
                    Agregar al carrito
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>

          {/* Pagination */}
          <Pagination className="mt-8">
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious 
                  href="#" 
                  onClick={() => paginate(currentPage - 1)}
                  className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}
                />
              </PaginationItem>
              {[...Array(Math.ceil(filteredProducts.length / productsPerPage))].map((_, index) => (
                <PaginationItem key={index}>
                  <PaginationLink 
                    href="#" 
                    onClick={() => paginate(index + 1)}
                    isActive={currentPage === index + 1}
                  >
                    {index + 1}
                  </PaginationLink>
                </PaginationItem>
              ))}
              <PaginationItem>
                <PaginationNext 
                  href="#" 
                  onClick={() => paginate(currentPage + 1)}
                  className={currentPage === Math.ceil(filteredProducts.length / productsPerPage) ? "pointer-events-none opacity-50" : ""}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>

        {/* Mostrar detalles del producto seleccionado */}
        {selectedProduct && (
          <div className="mt-8">
            <ProductDetail product={selectedProduct} />
          </div>
        )}
      </main>
    </div>
  );
}
