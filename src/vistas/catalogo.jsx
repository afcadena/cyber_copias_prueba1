import React, { useState, useEffect, useRef, useContext } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { Checkbox } from "@/components/ui/checkbox";
import { SearchIcon, ShoppingCartIcon, StarIcon } from 'lucide-react';

import Header from "./header";
import HeaderCliente from "./headerCli";
import Footer from "./footer";

import { useCrudContextForms } from "../context/CrudContextForms";
import { useCart } from '../context/CartContext';

import CrudContext from '../context/CrudContextInventario';


// Define available categories
const categories = ["Todos", "Escritura", "Cuadernos", "Papel", "Arte", "Accesorios", "Coleccionables"];

export default function Catalog() {
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("Todos");
  const [sortOrder, setSortOrder] = useState("recommended");
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 12;

  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const initialCategory = searchParams.get("category") || "Todos";

  const { currentUser } = useCrudContextForms();
  const { addToCart } = useCart();

  const { db: products, loading, error } = useContext(CrudContext);  // Acceder a los productos del contexto
  const categoriesRef = useRef(null);
  const mainContentRef = useRef(null);

  useEffect(() => {
    setCategoryFilter(initialCategory);
    window.scrollTo(0, 0);
  }, [initialCategory]);

  // Filtrar y ordenar productos basados en la búsqueda del usuario
  const filteredProducts = (products || []).filter(product => 
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
    (categoryFilter === "Todos" || product.category === categoryFilter)
).sort((a, b) => {
    if (sortOrder === "priceLowToHigh") return a.price - b.price;
    if (sortOrder === "priceHighToLow") return b.price - a.price;
    if (sortOrder === "bestSellers") return b.sales - a.sales;
    if (sortOrder === "newest") return new Date(b.releaseDate) - new Date(a.releaseDate);
    return 0;
  });

  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = filteredProducts?.slice(indexOfFirstProduct, indexOfLastProduct);

  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
    if (mainContentRef.current) {
      mainContentRef.current.scrollTop = 0;
    }
  };

  const handleProductClick = (product) => {
    navigate(`/producto/${product._id}`);
  };

  const handleCategoryChange = (category) => {
    setCategoryFilter(category);
    setCurrentPage(1);
    if (mainContentRef.current) {
      mainContentRef.current.scrollTop = 0;
    }
  };

  const handleAddToCart = (product) => {
    addToCart(product);
  };

  const getCategoryProductCount = (category) => {
    return products?.filter(product => category === "Todos" || product.category === category).length;
  };
  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      {currentUser ? <HeaderCliente /> : <Header />}
      
      <div className="flex-1 flex flex-col md:flex-row bg-gray-100">
        {/* Sidebar with filters */}
        <aside className="md:w-64 md:sticky md:top-16 md:h-[calc(100vh-4rem)] md:overflow-y-auto bg-white p-6">
          <h3 className="text-lg font-semibold mb-4">Filtros</h3>
          <div className="mb-6">
            <Input 
              placeholder="Buscar productos..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full"
            />
          </div>
          <h4 className="font-medium mb-2">Categorías</h4>
          <ul className="space-y-2">
            {categories.map((category) => (
              <li key={category}>
                <div className="flex items-center">
                  <Checkbox
                    id={category}
                    checked={categoryFilter === category}
                    onCheckedChange={() => handleCategoryChange(category)}
                  />
                  <label htmlFor={category} className="ml-2 text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                    {category} ({getCategoryProductCount(category)})
                  </label>
                </div>
              </li>
            ))}
          </ul>
        </aside>

        {/* Main content area */}
        <main className="flex-1 p-6" ref={mainContentRef}>
          <div className="bg-white rounded-lg shadow-sm">
            {/* Product count and sort options */}
            <div className="p-6 flex justify-between items-center border-b">
              <h2 className="text-lg font-semibold">
                {filteredProducts.length} producto{filteredProducts.length !== 1 ? 's' : ''} encontrado{filteredProducts.length !== 1 ? 's' : ''}
                {categoryFilter !== "Todos" ? ` en ${categoryFilter}` : ''}
              </h2>
              <div className="flex items-center">
                <Select value={sortOrder} onValueChange={setSortOrder}>
                  <SelectTrigger className="w-[200px]">
                    <SelectValue placeholder="Ordenar por" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="recommended">Recomendados</SelectItem>
                    <SelectItem value="priceHighToLow">Mayor precio</SelectItem>
                    <SelectItem value="priceLowToHigh">Menor precio</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Product grid */}
            <div className="p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {currentProducts.map((product) => (
                <Card 
                  key={product.id} 
                  className="flex flex-col justify-between cursor-pointer group transition-transform duration-200 hover:scale-105"
                  onClick={() => handleProductClick(product)} 
                >
                  <div className="relative w-full">
                    <img src={product.imageUrl} alt={product.name} className="w-full h-48 object-contain" />
                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-opacity duration-200" />
                  </div>
                  <CardContent className="p-4 flex-grow">
                    <CardTitle className="text-sm font-medium line-clamp-2 mb-2">{product.name}</CardTitle>
                    <p className="text-sm text-gray-500 mb-2">{product.author}</p>
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
                    <Button className="w-full" onClick={(e) => { e.stopPropagation(); handleAddToCart(product); }}>
                      <ShoppingCartIcon className="w-4 h-4 mr-2" />
                      Agregar al carrito
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>

            {/* Pagination */}
            <div className="p-6 border-t">
              <Pagination>
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
          </div>
        </main>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
}