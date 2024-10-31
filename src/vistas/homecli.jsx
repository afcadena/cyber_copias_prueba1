import React, { useState, useEffect } from 'react';
import Header from './headercli';
import Footer from './footer';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import AutoPlay from "embla-carousel-autoplay";
import { SearchIcon, ShoppingCartIcon, StarIcon } from 'lucide-react';
import { ChevronRight } from "heroicons-react";
import { useNavigate } from 'react-router-dom';
import escrituraImage from '../assets/images/escritura.jpg';
import arteImage from '../assets/images/arte.jpg';
import accesoriosImage from '../assets/images/accesorios.jpg';
import cuadernosImage from '../assets/images/cuadernos.jpg';
import papelImage from '../assets/images/papel.jpg';
import coleccionablesImage from '../assets/images/coleccionables.jpg';
import heroImage1 from '../assets/images/hero1.jpg';
import heroImage2 from '../assets/images/hero2.jpg';
import heroImage3 from '../assets/images/hero3.jpg';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';

const API_URL = "http://localhost:4000/api";

const HomePage = () => {
  const categories = [
    { name: "Escritura", icon: "✏️", image: escrituraImage },
    { name: "Arte", icon: "🎨", image: arteImage },
    { name: "Accesorios", icon: "👜", image: accesoriosImage },
    { name: "Cuadernos", icon: "📓", image: cuadernosImage },
    { name: "Papel", icon: "📃", image: papelImage },
    { name: "Coleccionables", icon: "🧸", image: coleccionablesImage }
  ];

  const heroOffers = [
    { 
      title: "Descubre tu creatividad", 
      subtitle: "Encuentra todo lo que necesitas para dar vida a tus ideas",
      image: heroImage1 
    },
    { 
      title: "Organiza tu mundo", 
      subtitle: "Herramientas para mantener tu vida en orden",
      image: heroImage2 
    },
    { 
      title: "Inspira tu día", 
      subtitle: "Productos que hacen especial cada momento",
      image: heroImage3 
    },
  ];

  const [products, setProducts] = useState([]);
  const navigate = useNavigate();
  const { addToCart } = useCart();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch(`${API_URL}/products`);
        const data = await response.json();
        setProducts(data);
      } catch (error) {
        console.error("Error al cargar productos:", error);
      }
    };
    fetchProducts();
  }, []);

  const handleAddToCart = (product, event) => {
    event.stopPropagation();
    addToCart(product);
    console.log(`Added product ${product.name} to cart`);
  };

  const handleProductClick = (product) => {
    console.log(`Navigating to product with ID: ${product._id}`);
    navigate(`/producto/${product._id}`); 
  };

  const handleCategoryClick = (category) => {
    navigate(`/catalogo?category=${category}`);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col overflow-x-hidden">
      <Header />

      {/* Hero Carousel */}
      <div className="w-full">
        <Carousel
          opts={{ align: "start", loop: true }}
          plugins={[AutoPlay({ delay: 5000 })]}
          className="w-full"
        >
          <CarouselContent>
            {heroOffers.map((offer, index) => (
              <CarouselItem key={index} className="w-full">
                <div className="relative w-full h-[50vh] sm:h-[60vh] md:h-[70vh] lg:h-screen">
                  <img
                    src={offer.image}
                    alt={offer.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-40 flex flex-col justify-center items-center text-white text-center px-4">
                    <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-2 sm:mb-4 transition-all duration-300 ease-in-out transform hover:scale-105">
                      {offer.title}
                    </h2>
                    <p className="text-sm sm:text-base md:text-lg lg:text-xl max-w-xs sm:max-w-sm md:max-w-md lg:max-w-2xl transition-all duration-300 ease-in-out transform hover:scale-105">
                      {offer.subtitle}
                    </p>
                  </div>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
      </div>

      {/* Main Content */}
      <main className="flex-grow">
        {/* Carrusel de Categorías */}
        <section className="bg-white py-4 sm:py-6 md:py-8">
          <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-xl sm:text-2xl font-bold mb-2 sm:mb-4">Nuestras Categorías</h2>
            <Carousel
              opts={{ align: "start", loop: true }}
              plugins={[AutoPlay({ delay: 3000 })]}
            >
              <CarouselContent>
                {categories.map((category, index) => (
                  <CarouselItem key={index} className="basis-1/2 sm:basis-1/3 md:basis-1/4 lg:basis-1/6">
                    <Card
                      className="flex flex-col justify-between cursor-pointer h-full"
                      onClick={() => handleCategoryClick(category.name)}
                    >
                      <CardContent className="p-2 sm:p-4 flex flex-col items-center">
                        <img src={category.image} alt={category.name} className="w-16 h-16 sm:w-24 sm:h-24 md:w-32 md:h-32 object-cover mb-2" />
                        <h3 className="text-xs sm:text-sm font-semibold text-center">{category.name}</h3>
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

        {/* Categoría Destacada */}
        <section className="bg-white py-4 sm:py-6 md:py-8">
          <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center mb-2 sm:mb-4">
              <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-primary">Escritura</h2>
              <Link to="/catalogo?category=Escritura" className="text-xs sm:text-sm text-gray-600 hover:text-gray-800">
                <Button variant="link" className="text-primary p-0 h-auto">
                  Ver todo <ChevronRight className="ml-1 h-3 w-3 sm:h-4 sm:w-4" />
                </Button>
              </Link>
            </div>
            <Carousel
              opts={{ align: "start", loop: true }}
              plugins={[AutoPlay({ delay: 3000 })]}
            >
              <CarouselContent>
                {products.filter((product) => product.category === "Escritura").map((product, index) => (
                  <CarouselItem key={index} className="basis-1/2 sm:basis-1/3 md:basis-1/4 lg:basis-1/5">
                    <Card
                      className="flex flex-col justify-between cursor-pointer h-full"
                      onClick={() => handleProductClick(product)}
                    >
                      <CardHeader className="p-2 sm:p-4">
                        <img src={product.imageUrl} alt={product.name} className="w-full h-24 sm:h-32 md:h-40 lg:h-48 object-contain" />
                      </CardHeader>
                      <CardContent className="p-2 sm:p-4">
                        <CardTitle className="text-xs sm:text-sm font-medium line-clamp-2 mb-1 sm:mb-2">{product.name}</CardTitle>
                        <div className="flex items-center mb-1 sm:mb-2">
                          {[...Array(5)].map((_, i) => (
                            <StarIcon key={i} className={`w-3 h-3 sm:w-4 sm:h-4 ${i < Math.floor(product.rating) ? 'text-yellow-400' : 'text-gray-300'}`} />
                          ))}
                          <span className="ml-1 text-xs sm:text-sm text-gray-600">({product.reviews})</span>
                        </div>
                        <p className="text-sm sm:text-base md:text-lg font-bold">${product.price.toLocaleString()}</p>
                      </CardContent>
                      <CardFooter className="p-2 sm:p-4 pt-0">
                        <Button 
                          className="w-full text-xs sm:text-sm" 
                          onClick={(event) => handleAddToCart(product, event)}
                        >
                          <ShoppingCartIcon className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                          Agregar al carrito
                        </Button>
                      </CardFooter>
                    </Card>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious />
              <CarouselNext />
            </Carousel>
          </div>
        </section>

        {/* Puedes agregar más secciones de categorías destacadas aquí siguiendo el mismo patrón */}
      </main>
      <Footer />
    </div>
  );
};

export default HomePage;