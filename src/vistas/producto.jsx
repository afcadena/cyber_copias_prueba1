import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { StarIcon, HeartIcon, ShareIcon, ShoppingCartIcon } from 'lucide-react';

export default function ProductDetail() {
  const { id } = useParams(); // Obtiene el ID del producto desde la URL
  const [product, setProduct] = useState(null);
  const [mainImage, setMainImage] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/products/${id}`);
        const product = response.data;
        setProduct(product);  // Almacena los detalles del producto en el estado
        if (product.images && product.images.length > 0) {
          setMainImage(product.images[0]);
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

  return (
    <div className="container mx-auto px-4 py-8">
      {product ? (
        <div className="flex flex-col md:flex-row gap-8">
          {/* Imágenes del producto */}
          <div className="md:w-1/2">
            <img src={mainImage} alt={product.name} className="w-full h-auto rounded-lg shadow-md mb-4" />
            <div className="flex gap-4 overflow-x-auto">
              {product.images && product.images.length > 0 ? (
                product.images.map((img, index) => (
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

          {/* Información del producto */}
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
              <Button className="flex-1">
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
            <div className="space-y-2 mb-6">
              {product.details && product.details.length > 0 ? (
                product.details.map((detail, index) => (
                  <div key={index} className="flex justify-between">
                    <span className="font-semibold">{detail.label}:</span>
                    <span>{detail.value}</span>
                  </div>
                ))
              ) : (
                <p>No hay detalles disponibles.</p>
              )}
            </div>
            <Badge variant="outline" className="mb-4">Envío gratis</Badge>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <img src="/placeholder.svg?height=20&width=20" alt="cybercopias icon" className="w-5 h-5" />
              <span>Vendido por Cybercopias</span>
            </div>
          </div>
        </div>
      ) : (
        <p>{error ? error : "Cargando..."}</p>
      )}
    </div>
  );
}
