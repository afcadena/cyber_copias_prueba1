import React, { useState } from 'react'
import Logo from "../assets/images/Logo.png"
import { Link } from 'react-router-dom'
import { Menu, ShoppingCart, FileText, Palette, Book, Tag, Grid, User, ShoppingBag } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"

export default function Component() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <div className="flex flex-col min-h-screen">
      <header className="flex items-center justify-between p-4 bg-background shadow-md">
        <div className="flex items-center">
          <img src={Logo} alt="Logo" className="w-10 h-10 mr-2" />
          <h1 className="text-xl font-bold">CyberCopias</h1>
        </div>
        <nav className="hidden md:flex space-x-4">
          <Link to="#ofertas" className="text-foreground hover:text-primary">
            <Tag className='h-6 w-6' />
            </Link>
          <Link to="/catalogo" className="text-foreground hover:text-primary">
            <Grid  className='h-6 w-6' />
          </Link>
          <Link to="#" className="text-foreground hover:text-primary">
            <User  className='h-6 w-6' />
          </Link>
          <Link to="/carrito" className="text-foreground hover:text-primary">
            <ShoppingCart className='h-6 w-6' />
          </Link>
          <Link to="#" className="text-foreground hover:text-primary">
            <ShoppingBag className='h-6 w-6' />
          </Link>
        </nav>
        <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon" className="mr-2">
              <Menu className="h-6 w-6" />
              <span className="sr-only">Toggle menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="right">
            <SheetHeader>
              <SheetTitle>Menú</SheetTitle>
              <SheetDescription>
                Explora nuestras categorías
              </SheetDescription>
            </SheetHeader>
            <div className="grid gap-4 py-4">
              <Button variant="ghost" className="w-full justify-start">
                <FileText className="mr-2 h-4 w-4" />
                Libros de dibujo
              </Button>
              <Button variant="ghost" className="w-full justify-start">
                <Palette className="mr-2 h-4 w-4" />
                Arte y manualidades
              </Button>
              <Button variant="ghost" className="w-full justify-start">
                <Book className="mr-2 h-4 w-4" />
                Cuadernos
              </Button>
            </div>
          </SheetContent>
        </Sheet>
      </header>

      <main className="flex-grow">
        <Carousel className="w-full max-w-xs mx-auto">
          <CarouselContent>
            {Array.from({ length: 5 }).map((_, index) => (
              <CarouselItem key={index}>
                <div className="p-1">
                  <Card>
                    <CardContent className="flex aspect-square items-center justify-center p-6">
                      <img src={`/placeholder.svg?text=Slide+${index + 1}`} alt={`Slide ${index + 1}`} className="w-full h-full object-cover" />
                    </CardContent>
                  </Card>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>

        <section className="p-4">
          <h2 className="text-2xl font-bold mb-4">Ofertas</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {Array.from({ length: 3 }).map((_, index) => (
              <Card key={index}>
                <CardContent className="p-4">
                  <h3 className="font-bold mb-2">Oferta {index + 1}</h3>
                  <p>Descripción de la oferta...</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        <section className="p-4">
          <h2 className="text-2xl font-bold mb-4">Productos Destacados</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {Array.from({ length: 4 }).map((_, index) => (
              <Card key={index}>
                <CardContent className="p-4">
                  <img src="/placeholder.svg" alt={`Producto ${index + 1}`} className="w-full h-40 object-cover mb-2" />
                  <h3 className="font-bold mb-2">Producto {index + 1}</h3>
                  <p>Descripción del producto...</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      </main>
    </div>
  )
}