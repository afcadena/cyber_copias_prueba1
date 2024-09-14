import React, { createContext, useState, useContext, useEffect } from 'react';

// Crear el contexto del carrito
const CartContext = createContext();

export const CartProvider = ({ children }) => {
  // Estado del carrito inicial, cargando desde localStorage si existe
  const [cart, setCart] = useState(() => {
    const storedCart = localStorage.getItem('cart');
    return storedCart ? JSON.parse(storedCart) : [];
  });

  // Efecto para actualizar el localStorage cada vez que cambie el carrito
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  // Función para agregar productos al carrito
  const addToCart = (product) => {
    setCart((prevCart) => {
      const productExists = prevCart.find((p) => p.id === product.id);

      if (productExists) {
        // Si el producto ya existe, incrementa su cantidad
        return prevCart.map((p) =>
          p.id === product.id ? { ...p, quantity: p.quantity + 1 } : p
        );
      } else {
        // Si no existe, agrégalo con cantidad 1
        return [...prevCart, { ...product, quantity: 1 }];
      }
    });
  };

  // Función para eliminar productos del carrito
  const removeFromCart = (productId) => {
    setCart((prevCart) => prevCart.filter((p) => p.id !== productId));
  };

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart }}>
      {children}
    </CartContext.Provider>
  );
};

// Hook para acceder al contexto del carrito
export const useCart = () => useContext(CartContext);
