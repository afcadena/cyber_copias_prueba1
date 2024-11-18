import { useState, useEffect, useContext } from 'react';
import { useParams } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { StarIcon, ShoppingCartIcon, ImageIcon } from 'lucide-react';
import Header from "./header";
import headercliente from "./headercli";
import Footer from "./footer";
import { useCart } from '../context/CartContext';
import { useCrudContextForms } from "../context/CrudContextForms";
import CrudContext from '../context/CrudContextInventario';

export default function ProductDetail() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [mainImage, setMainImage] = useState(null);
  const [error, setError] = useState(null);
  const { addToCart } = useCart();
  const [message, setMessage] = useState('');
  const [userRating, setUserRating] = useState(null);
  const [ratingMessage, setRatingMessage] = useState('');
  const [reviewText, setReviewText] = useState('');
  const { currentUser } = useCrudContextForms();
  const { db: products, updateData } = useContext(CrudContext);

  useEffect(() => {
    const fetchProduct = () => {
      const foundProduct = products?.find((product) => product._id === id);
      if (foundProduct) {
        setProduct(foundProduct);
        setMainImage(foundProduct.imageUrl?.[0] || "/placeholder.svg");
      } else {
        setError("Producto no encontrado.");
      }
    };

    fetchProduct();
  }, [id, products]);

  const handleAddToCart = () => {
    if (product) {
      addToCart(product);
      setMessage('Producto agregado al carrito');
      setTimeout(() => setMessage(''), 3000);
    }
  };

  const handleRatingSubmit = async () => {
    if (!userRating || !reviewText || !product) {
      setRatingMessage('Por favor, agrega una calificación y una reseña.');
      return;
    }

    const updatedReviews = product.reviews + 1;
    const updatedRating = ((product.rating * product.reviews) + userRating) / updatedReviews;

    const updatedProduct = {
      ...product,
      rating: updatedRating,
      reviews: updatedReviews,
      userReviews: [...(product.userReviews || []), { user: currentUser.name, rating: userRating, review: reviewText }]
    };

    try {
      await updateData(updatedProduct);
      setRatingMessage('Gracias por tu reseña.');
      setUserRating(null);
      setReviewText('');
    } catch (error) {
      console.error("Error al actualizar la puntuación:", error);
      setError("No se pudo actualizar la puntuación. Inténtalo de nuevo más tarde.");
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      {currentUser ? <headercliente /> : <Header />}
      <main className="flex-1 px-4 py-6 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        {error ? (
          <div className="rounded-lg bg-red-50 p-4 text-red-500">{error}</div>
        ) : null}
        {product && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="flex flex-col space-y-4">
              <div className="relative aspect-square w-full rounded-lg overflow-hidden bg-gray-100">
                {mainImage ? (
                  <img 
                    src={mainImage} 
                    alt={product.name} 
                    className="w-full h-full object-contain"
                    onError={(e) => {
                      e.currentTarget.src = "/placeholder.svg";
                      e.currentTarget.onerror = null;
                    }}
                  />
                ) : (
                  <div className="flex items-center justify-center w-full h-full">
                    <ImageIcon className="w-12 h-12 text-gray-400" />
                  </div>
                )}
              </div>
              {product.imageUrl && product.imageUrl.length > 1 && (
                <div className="grid grid-cols-4 gap-2">
                  {product.imageUrl.map((img, index) => (
                    <button
                      key={index}
                      onClick={() => setMainImage(img)}
                      className={`aspect-square rounded-md overflow-hidden border-2 ${
                        mainImage === img ? 'border-indigo-500' : 'border-transparent'
                      }`}
                    >
                      <img 
                        src={img} 
                        alt={`${product.name} - Vista ${index + 1}`} 
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="flex flex-col space-y-6">
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold mb-2">{product.name}</h1>
                <p className="text-gray-600 mb-4">{product.author}</p>
                <div className="flex items-center mb-4">
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <StarIcon 
                        key={i} 
                        className={`w-5 h-5 ${
                          i < Math.floor(product.rating) ? 'text-yellow-400' : 'text-gray-300'
                        }`} 
                      />
                    ))}
                  </div>
                  <span className="ml-2 text-sm text-gray-600">
                    ({product.reviews} reseña{product.reviews !== 1 ? 's' : ''})
                  </span>
                </div>
                <p className="text-2xl sm:text-3xl font-bold mb-4">
                  ${product.price.toLocaleString()}
                </p>
                <Badge variant="secondary" className="mb-6">{product.category}</Badge>
              </div>

              <div className="space-y-4">
                <Button 
                  className="w-full py-6 text-lg" 
                  onClick={handleAddToCart}
                >
                  <ShoppingCartIcon className="w-5 h-5 mr-2" />
                  Agregar al carrito
                </Button>
                {message && (
                  <p className="text-green-500 text-center animate-fade-in-down">
                    {message}
                  </p>
                )}
              </div>

              <div className="pt-6 border-t">
                <h3 className="text-lg font-semibold mb-4">Dejar una reseña</h3>
                {currentUser ? (
                  <div className="space-y-4">
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <button
                          key={i}
                          onClick={() => setUserRating(i + 1)}
                          className="focus:outline-none"
                        >
                          <StarIcon
                            className={`w-8 h-8 transition-colors ${
                              i < userRating ? 'text-yellow-400' : 'text-gray-300'
                            }`}
                          />
                        </button>
                      ))}
                    </div>
                    <textarea
                      value={reviewText}
                      onChange={(e) => setReviewText(e.target.value)}
                      className="w-full min-h-[100px] p-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      placeholder="Escribe tu reseña aquí..."
                    />
                    <Button 
                      onClick={handleRatingSubmit}
                      className="w-full sm:w-auto"
                    >
                      Enviar reseña
                    </Button>
                    {ratingMessage && (
                      <p className="text-green-500">{ratingMessage}</p>
                    )}
                  </div>
                ) : (
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-gray-600">
                      Por favor, inicia sesión para dejar una reseña.
                    </p>
                  </div>
                )}
              </div>

              {product.userReviews && product.userReviews.length > 0 && (
                <div className="pt-6 border-t">
                  <h3 className="text-lg font-semibold mb-4">Reseñas de usuarios</h3>
                  <div className="space-y-4">
                    {product.userReviews.map((review, index) => (
                      <div key={index} className="border-b pb-4">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="font-medium">{review.user}</span>
                          <div className="flex">
                            {[...Array(5)].map((_, i) => (
                              <StarIcon
                                key={i}
                                className={`w-4 h-4 ${
                                  i < review.rating ? 'text-yellow-400' : 'text-gray-300'
                                }`}
                              />
                            ))}
                          </div>
                        </div>
                        <p className="text-gray-600">{review.review}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}