// homecli.jsx
import React from 'react';
import Footer from './footer';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import AutoPlay from "embla-carousel-autoplay";
import { ChevronRight } from 'lucide-react';
// Importar el hook correcto
import { useCrudContextForms } from "../context/CrudContextForms";
// Importación de imagenes
import escrituraImage from '../assets/images/escritura.jpg';
import arteImage from '../assets/images/arte.jpg';
import accesoriosImage from '../assets/images/accesorios.jpg';
import cuadernosImage from '../assets/images/cuadernos.jpg';
import papelImage from '../assets/images/papel.jpg';
import coleccionablesImage from '../assets/images/coleccionables.jpg';
// Importación de imágenes para Hero Carousel
import heroImage1 from '../assets/images/hero1.jpg';
import heroImage2 from '../assets/images/hero2.jpg';
import heroImage3 from '../assets/images/hero3.jpg';

import Header from "./headercli";  // Importamos el nuevo componente

const HomePage = () => {
  const { logoutUser } = useCrudContextForms();  // Usa el hook correctamente

  const categories = [
    { name: "Escritura", icon: "✏️", image: escrituraImage },
    { name: "Arte", icon: "🎨", image: arteImage },
    { name: "Accesorios", icon: "👜", image: accesoriosImage },
    { name: "Cuadernos", icon: "📓", image: cuadernosImage },
    { name: "Papel", icon: "📃", image: papelImage },
    { name: "Coleccionables", icon: "🧸", image: coleccionablesImage} 
  ];
  
  const heroOffers = [
    { title: "", image: heroImage1 },
    { title: "", image: heroImage2 },
    { title: "", image: heroImage3 },
  ];

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col overflow-x-hidden">
      <Header />  {/* Usamos el componente Header */}
      
      {/* Hero Carousel */}
      <div className="w-full max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 mt-4">
        <Carousel 
          opts={{ align: "start", loop: true }} 
          plugins={[AutoPlay({ delay: 5000 })]}
          className="w-full"
        >
          <CarouselContent>
            {heroOffers.map((offer, index) => (
              <CarouselItem key={index}>
                <div className="p-1">
                  <Card className="relative">
                  <CardContent className="flex items-center justify-center p-0 h-[500px] w-[1380px]">
                      <img 
                        src={offer.image} 
                        alt={offer.title} 
                        className="w-full h-full object-cover" 
                      />
                      <span className="absolute bottom-4 left-4 text-4xl font-semibold text-white bg-black bg-opacity-50 p-2 rounded">
                        {offer.title}
                      </span>
                    </CardContent>
                  </Card>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
      </div>

      {/* Main Content */}
      <main className="flex-grow">
        {/* Carrusel de Categorías */}
        <section className="bg-white py-8">
          <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-bold mb-4">Nuestras Categorías</h2>
            <Carousel 
              opts={{ align: "start", loop: true }} 
              plugins={[AutoPlay({ delay: 3000 })]}
            >
              <CarouselContent>
                {categories.map((category, index) => (
                  <CarouselItem key={index} className="md:basis-1/3 lg:basis-1/4">
                    <Card>
                      <CardContent className="p-4 flex flex-col items-center">
                        <img src={category.image} alt={category.name} className="w-32 h-32 object-cover mb-2" />
                        <h3 className="font-semibold text-center">{category.name}</h3>
                      </CardContent>
                    </Card>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious />
              <CarouselNext />
            </Carousel>
          </div>
        </section>

        {/* Categoría Destacada: Escritura */}
        <section className="bg-white py-8">
          <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-3xl font-bold text-primary">ESCRITURA</h2>
              <Button variant="link" className="text-primary">
                Ver todo <ChevronRight className="ml-1 h-4 w-4" />
              </Button>
            </div>
            <Carousel 
              opts={{ align: "start", loop: true }} 
              plugins={[AutoPlay({ delay: 3000 })]}
            >
              <CarouselContent>
                {[1, 2, 3, 4, 5].map((_, productIndex) => (
                  <CarouselItem key={productIndex} className="md:basis-1/3 lg:basis-1/4">
                    <Card>
                      <CardContent className="p-4">
                        <div className="aspect-square bg-gray-200 rounded-md mb-2"></div>
                        <h4 className="font-semibold">Producto {productIndex + 1}</h4>
                        <p className="text-sm text-gray-500">$10.00</p>
                      </CardContent>
                    </Card>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious />
              <CarouselNext />
            </Carousel>
          </div>
        </section>
      </main>

      <Footer />  {/* Usamos el componente Footer */}
    </div>
  );
};

export default HomePage;
