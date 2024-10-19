import { useState, useEffect, useContext } from 'react';
import { useParams } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { StarIcon, ShoppingCartIcon } from 'lucide-react';
import Header from "./header";
import HeaderCliente from "./headerCli";
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
  const { db: products, updateData } = useContext(CrudContext); // Asegúrate de obtener updateData

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
      // Aquí llamas a updateData
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
      {currentUser ? <HeaderCliente /> : <Header />}
      <main className="flex-1 p-6">
        {error ? <p className="text-red-500">{error}</p> : null}
        {product && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="flex flex-col">
              <img src={mainImage} alt={product.name} className="w-full h-96 object-contain mb-4" />
            </div>
            <div>
              <h1 className="text-2xl font-bold mb-2">{product.name}</h1>
              <p className="text-gray-700 mb-2">{product.author}</p>
              <div className="flex items-center mb-2">
                {[...Array(5)].map((_, i) => (
                  <StarIcon key={i} className={`w-4 h-4 ${i < Math.floor(product.rating) ? 'text-yellow-400' : 'text-gray-300'}`} />
                ))}
                <span className="ml-2 text-sm">({product.reviews} reseña{product.reviews !== 1 ? 's' : ''})</span>
              </div>
              <p className="text-xl font-bold mb-4">${product.price.toLocaleString()}</p>
              <Badge variant="secondary" className="mb-4">{product.category}</Badge>
              <Button className="w-full mb-4" onClick={handleAddToCart}>
                <ShoppingCartIcon className="w-4 h-4 mr-2" />
                Agregar al carrito
              </Button>
              {message && <p className="text-green-500 mb-4">{message}</p>}
              <div className="mt-6">
                <h3 className="text-lg font-semibold mb-2">Dejar una reseña</h3>
                {currentUser ? (
                  <div>
                    <div className="flex items-center mb-4">
                      {[...Array(5)].map((_, i) => (
                        <StarIcon
                          key={i}
                          className={`w-6 h-6 cursor-pointer ${i < userRating ? 'text-yellow-400' : 'text-gray-300'}`}
                          onClick={() => setUserRating(i + 1)}
                        />
                      ))}
                    </div>
                    <textarea
                      value={reviewText}
                      onChange={(e) => setReviewText(e.target.value)}
                      className="w-full border border-gray-300 p-2 rounded-md mb-4"
                      placeholder="Escribe tu reseña aquí..."
                      rows={4}
                    ></textarea>
                    <Button onClick={handleRatingSubmit}>
                      Enviar reseña
                    </Button>
                    {ratingMessage && <p className="text-green-500 mt-2">{ratingMessage}</p>}
                  </div>
                ) : (
                  <p className="text-red-500">Por favor, inicia sesión para dejar una reseña.</p>
                )}
              </div>
            </div>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}
