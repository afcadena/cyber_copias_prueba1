import { useState } from 'react'
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination"
import { Checkbox } from "@/components/ui/checkbox"
import { SearchIcon, ShoppingCartIcon, HeartIcon, StarIcon } from 'lucide-react'

const products = [
  { id: 1, name: "Sobres x 5 Fifa Copa América 2024 PANINI 23204", category: "Coleccionables", price: 3200, image: "/placeholder.svg?height=200&width=200", rating: 5, reviews: 1 },
  { id: 2, name: "Resma tamaño carta x500 hojas DISPAPELES", category: "Papel", price: 16990, image: "/placeholder.svg?height=200&width=200", rating: 4.7, reviews: 139 },
  { id: 3, name: "ALBUM RETAIL COPA AMERICA 2024 PANINI", category: "Coleccionables", price: 10300, image: "/placeholder.svg?height=200&width=200", rating: 5, reviews: 2 },
  { id: 4, name: "Plumígrafos punta media 0.7mm vintage x24 unds PAPER MATE", category: "Escritura", price: 70190, image: "/placeholder.svg?height=200&width=200", rating: 5, reviews: 1 },
  { id: 5, name: "Marcadores Dobles Set De 80 Colores Base De Alcohol", category: "Arte", price: 119900, image: "/placeholder.svg?height=200&width=200", rating: 4.9, reviews: 70 },
  { id: 6, name: "Cuaderno MICKEY CUERO Rayado 80 hojas Argollado tamaño grande", category: "Cuadernos", price: 24900, image: "/placeholder.svg?height=200&width=200", rating: 5, reviews: 2 },
  { id: 7, name: "Album Jet Colsalpindiente JET 2023-24", category: "Coleccionables", price: 12900, image: "/placeholder.svg?height=200&width=200", rating: 4.9, reviews: 14 },
  { id: 8, name: "Cuaderno Cuadriculado 100 hojas Multimateria SCRIBE", category: "Cuadernos", price: 8900, image: "/placeholder.svg?height=200&width=200", rating: 4.7, reviews: 3 },
  { id: 9, name: "Bolígrafo Kilométrico 100 Negro", category: "Escritura", price: 1200, image: "/placeholder.svg?height=200&width=200", rating: 4.8, reviews: 245 },
  { id: 10, name: "Lápiz Mirado N°2 x12 PAPER MATE", category: "Escritura", price: 18900, image: "/placeholder.svg?height=200&width=200", rating: 5, reviews: 7 },
  { id: 11, name: "Colores Norma Hexagonales x12", category: "Arte", price: 14900, image: "/placeholder.svg?height=200&width=200", rating: 4.9, reviews: 18 },
  { id: 12, name: "Borrador Nata Grande PELIKAN", category: "Accesorios", price: 1100, image: "/placeholder.svg?height=200&width=200", rating: 4.7, reviews: 89 },
  { id: 13, name: "Tijeras Escolares 5'' MAPED", category: "Accesorios", price: 4500, image: "/placeholder.svg?height=200&width=200", rating: 4.8, reviews: 32 },
  { id: 14, name: "Pegante en Barra 40g PEGASTICK", category: "Accesorios", price: 3900, image: "/placeholder.svg?height=200&width=200", rating: 4.6, reviews: 54 },
  { id: 15, name: "Cartulina Iris 1/8 50x70cm Surtida x10", category: "Papel", price: 9900, image: "/placeholder.svg?height=200&width=200", rating: 4.9, reviews: 27 },
  { id: 16, name: "Block Iris Carta Surtido x30", category: "Papel", price: 7900, image: "/placeholder.svg?height=200&width=200", rating: 4.8, reviews: 41 },
]

const categories = ["Todos", "Escritura", "Cuadernos", "Papel", "Arte", "Accesorios", "Coleccionables"]

export default function Catalog() {
  const [searchTerm, setSearchTerm] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("Todos")
  const [sortOrder, setSortOrder] = useState("recommended")
  const [currentPage, setCurrentPage] = useState(1)
  const productsPerPage = 12

  const filteredProducts = products.filter(product => 
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
    (categoryFilter === "Todos" || product.category === categoryFilter)
  ).sort((a, b) => {
    if (sortOrder === "priceLowToHigh") return a.price - b.price
    if (sortOrder === "priceHighToLow") return b.price - a.price
    return 0 // For "recommended", we'll just use the original order
  })

  const indexOfLastProduct = currentPage * productsPerPage
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage
  const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct)

  const paginate = (pageNumber) => setCurrentPage(pageNumber)

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
              <Card key={product.id} className="flex flex-col justify-between">
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
      </main>
    </div>
  )
}