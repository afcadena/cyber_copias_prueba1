import React, { useState, useEffect } from 'react';
import Header from './headercli';
import Footer from './footer';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import AutoPlay from "embla-carousel-autoplay";
import { SearchIcon, ShoppingCartIcon, StarIcon, Badge } from 'lucide-react';
import { ChevronRight } from "heroicons-react";
import { useNavigate } from 'react-router-dom'; // Importar useNavigate
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
    { title: "", image: heroImage1 },
    { title: "", image: heroImage2 },
    { title: "", image: heroImage3 },
  ];

  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const navigate = useNavigate(); // Inicializar useNavigate

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch("http://localhost:3000/products");
        const data = await response.json();
        setProducts(data);
      } catch (error) {
        console.error("Error al cargar productos:", error);
      }
    };
    fetchProducts();
  }, []);

  const handleAddToCart = (product) => {
    const existingProduct = cart.find((item) => item.id === product.id);
    if (existingProduct) {
      setCart(
        cart.map((item) => {
          if (item.id === product.id) {
            return { ...item, quantity: item.quantity + 1 };
          }
          return item;
        })
      );
    } else {
      setCart([...cart, { ...product, quantity: 1 }]);
    }
    console.log(`Added product ${product.name} to cart`);
  };

  const handleProductClick = (product) => {
    // Redirige a la página de producto con el ID del producto como parámetro
    navigate(`/producto/${product.id}`); 
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col overflow-x-hidden">
      <Header />

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

        {/* Categoría Destacada */}
        <section className="bg-white py-8">
          <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-3xl font-bold text-primary">Escritura</h2>
              <Link to="/catalogo" className="text-sm text-gray-600 hover:text-gray-800">
                <Button variant="link" className="text-primary">
                  Ver todo <ChevronRight className="ml-1 h-4 w-4" />
                </Button>
              </Link>
            </div>
            <Carousel
              opts={{ align: "start", loop: true }}
              plugins={[AutoPlay({ delay: 3000 })]}
            >
              <CarouselContent>
                {products.filter((product) => product.category === "Escritura").map((product, index) => (
                  <CarouselItem key={index} className="md:basis-1/3 lg:basis-1/4">
                    <Card
                      className="flex flex-col justify-between cursor-pointer"
                      onClick={() => handleProductClick(product)}
                    >
                      <CardHeader className="p-4">
                        <img src={product.imageUrl} alt={product.name} className="w-full h-48 object-contain" />
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
                      </CardContent>
                      <CardFooter className="p-4 pt-0">
                        <Button className="w-full" onClick={() => handleAddToCart(product)}>
                          <ShoppingCartIcon className="w-4 h-4 mr-2" />
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
      </main>

      <Footer />
    </div>
  );
}

export default HomePage;
