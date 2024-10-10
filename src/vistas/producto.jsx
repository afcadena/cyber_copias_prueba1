import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { StarIcon, ShoppingCartIcon } from 'lucide-react';
import Header from "./header";
import HeaderCliente from "./headerCli";
import Footer from "./footer";
import { useCart } from '../context/CartContext';
import { useCrudContextForms } from "../context/CrudContextForms";

export default function ProductDetail() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [mainImage, setMainImage] = useState(null);
  const [error, setError] = useState(null);
  const { addToCart } = useCart();
  const [message, setMessage] = useState('');
  const [userRating, setUserRating] = useState(null);
  const [ratingMessage, setRatingMessage] = useState('');
  const { currentUser } = useCrudContextForms();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/products/${id}`);
        const product = response.data;
        setProduct(product);
        
        if (product.imageUrl && product.imageUrl.length > 0) {
          setMainImage(product.imageUrl[0]);
        } else {
          setMainImage("/placeholder.svg");
        }
      } catch (error) {
        console.error("Error al cargar el producto:", error);
        setError("No se pudo cargar el producto. Inténtalo de nuevo más tarde.");
      }
    };

    fetchProduct();
  }, [id]);

  const handleAddToCart = () => {
    if (product) {
      addToCart(product);
      setMessage('Producto agregado al carrito');
      setTimeout(() => setMessage(''), 3000);
    }
  };

  const handleRatingSubmit = async (newRating) => {
    if (!product) return;

    const updatedReviews = product.reviews + 1;
    const updatedRating = ((product.rating * product.reviews) + newRating) / updatedReviews;

    const updatedProduct = {
      ...product,
      rating: updatedRating,
      reviews: updatedReviews
    };

    try {
      const response = await axios.put(`http://localhost:3000/products/${id}`, updatedProduct);
      setProduct(response.data);
      setRatingMessage('¡Gracias por tu reseña!');
      setTimeout(() => setRatingMessage(''), 3000);
    } catch (error) {
      console.error("Error al actualizar la puntuación:", error);
      setError("No se pudo actualizar la puntuación. Inténtalo de nuevo más tarde.");
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      {currentUser ? <HeaderCliente /> : <Header />}
      
      <main className="flex-grow container mx-auto px-4 py-8">
        {product ? (
          <div className="flex flex-col lg:flex-row gap-8">
            <div className="lg:w-1/2 space-y-4">
              <div className="relative">
                <img src={mainImage} alt={product.name} className="w-full h-auto rounded-lg shadow-md" />
              </div>
              <div className="flex gap-4 overflow-x-auto py-2">
                {product.imageUrl && product.imageUrl.length > 0 ? (
                  product.imageUrl.map((img, index) => (
                    <img 
                      key={index} 
                      src={img} 
                      alt={`${product.name} - Image ${index + 1}`} 
                      className={`w-20 h-20 object-cover rounded-md cursor-pointer transition ${mainImage === img ? 'ring-2 ring-primary' : 'hover:opacity-75'}`}
                      onClick={() => setMainImage(img)}
                    />
                  ))
                ) : (
                  <p className="text-gray-500 italic">No hay imágenes disponibles.</p>
                )}
              </div>
            </div>

            <div className="lg:w-1/2 space-y-6">
              <h1 className="text-3xl font-bold">{product.name || "Producto sin nombre"}</h1>
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <StarIcon key={i} className={`w-5 h-5 ${i < Math.floor(product.rating || 0) ? 'text-yellow-400' : 'text-gray-300'}`} />
                ))}
                <span className="ml-2 text-sm text-gray-600">{product.rating?.toFixed(1) || 0} ({product.reviews || 0} opiniones)</span>
              </div>
              <p className="text-3xl font-bold">${product.price ? product.price.toLocaleString() : "Precio no disponible"}</p>
              <p className="text-gray-700">{product.description || "Descripción no disponible."}</p>
              <div className="flex gap-4">
                <Button className="flex-1" onClick={handleAddToCart}>
                  <ShoppingCartIcon className="w-4 h-4 mr-2" />
                  Agregar al carrito
                </Button>
              </div>
              <Badge variant="outline" className="text-sm">Envío gratis</Badge>

              {currentUser ? (
                <div className="border-t pt-6">
                  <h3 className="text-lg font-semibold mb-2">Califica este producto</h3>
                  <div className="flex items-center space-x-4">
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <StarIcon 
                          key={i} 
                          className={`w-6 h-6 ${i < userRating ? 'text-yellow-400' : 'text-gray-300'} cursor-pointer`} 
                          onClick={() => setUserRating(i + 1)}
                        />
                      ))}
                    </div>
                    <Button onClick={() => handleRatingSubmit(userRating)} disabled={!userRating}>
                      Enviar reseña
                    </Button>
                  </div>
                  {ratingMessage && <p className="text-green-600 mt-2">{ratingMessage}</p>}
                </div>
              ) : (
                <p className="text-red-500 mt-6">Debes iniciar sesión para dejar una reseña.</p>
              )}
            </div>
          </div>
        ) : (
          <p className="text-center text-xl">{error ? error : "Cargando..."}</p>
        )}
        {message && (
          <div className="fixed bottom-4 right-4 mt-4 p-4 bg-green-100 text-green-800 rounded shadow-lg">
            {message}
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}
