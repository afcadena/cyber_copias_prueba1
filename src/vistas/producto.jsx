import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { StarIcon, HeartIcon, ShareIcon, ShoppingCartIcon } from 'lucide-react';
import Header from "./header";
import Footer from "./footer";
import { useCart } from '../context/CartContext';  // Importa el useCart

export default function ProductDetail() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [mainImage, setMainImage] = useState(null);
  const [error, setError] = useState(null);
  const { addToCart } = useCart();  // Obtén la función addToCart
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/products/${id}`);
        const product = response.data;
        setProduct(product);
        if (product.imageUrls && product.imageUrls.length > 0) {
          setMainImage(product.imageUrls[0]);
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
      addToCart(product);  // Agrega el producto al carrito
      setMessage('Producto agregado al carrito');
      setTimeout(() => setMessage(''), 3000); // Elimina el mensaje después de 3 segundos
    }
  };

  return (
    <>
      <Header />
      <div className="container mx-auto px-4 py-8">
        {product ? (
          <div className="flex flex-col md:flex-row gap-8">
            <div className="md:w-1/2">
              <img src={mainImage} alt={product.name} className="w-full h-auto rounded-lg shadow-md mb-4" />
              <div className="flex gap-4 overflow-x-auto">
                {product.imageUrl && product.imageUrl.length > 0 ? (
                  product.imageUrl.map((img, index) => (
                    <img 
                      key={index} 
                      src={img} 
                      alt={`${product.name} - Image ${index + 1}`} 
                      className="w-20 h-20 object-cover rounded-md cursor-pointer hover:opacity-75 transition"
                      onClick={() => setMainImage(img)}
                    />
                  ))
                ) : (
                  <p>No hay imágenes disponibles.</p>
                )}
              </div>
            </div>

            <div className="md:w-1/2">
              <h1 className="text-3xl font-bold mb-4">{product.name || "Producto sin nombre"}</h1>
              <div className="flex items-center mb-4">
                {[...Array(5)].map((_, i) => (
                  <StarIcon key={i} className={`w-5 h-5 ${i < Math.floor(product.rating || 0) ? 'text-yellow-400' : 'text-gray-300'}`} />
                ))}
                <span className="ml-2 text-sm text-gray-600">{product.rating || 0} ({product.reviews || 0} opiniones)</span>
              </div>
              <p className="text-3xl font-bold mb-4">${product.price ? product.price.toLocaleString() : "Precio no disponible"}</p>
              <p className="mb-4">{product.description || "Descripción no disponible."}</p>
              <div className="flex gap-4 mb-6">
                <Button className="flex-1" onClick={handleAddToCart}>
                  <ShoppingCartIcon className="w-4 h-4 mr-2" />
                  Agregar al carrito
                </Button>
                <Button variant="outline">
                  <HeartIcon className="w-4 h-4 mr-2" />
                  Guardar
                </Button>
                <Button variant="outline">
                  <ShareIcon className="w-4 h-4" />
                </Button>
              </div>
              <Badge variant="outline" className="mb-4">Envío gratis</Badge>
            </div>
          </div>
        ) : (
          <p>{error ? error : "Cargando..."}</p>
        )}
        {message && <div className="mt-4 p-4 bg-green-100 text-green-800 rounded">{message}</div>}
      </div>
      <Footer />
    </>
  );
}
  