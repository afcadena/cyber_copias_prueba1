// src/context/CartContext.jsx
import React, { createContext, useState, useContext, useEffect } from 'react';

// Crear el contexto del carrito
const CartContext = createContext();

// Hook para acceder al contexto del carrito
export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  // Estado del carrito inicial, cargando desde localStorage si existe
  const [cart, setCart] = useState(() => {
    const storedCart = localStorage.getItem('cart');
    return storedCart ? JSON.parse(storedCart) : [];
  });

  // Estado para controlar si el carrito está abierto
  const [isCartOpen, setIsCartOpen] = useState(false);

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
    setIsCartOpen(true); // Abrir el carrito automáticamente al agregar un producto
  };

  // Función para eliminar productos del carrito
  const removeFromCart = (productId) => {
    setCart((prevCart) => prevCart.filter((p) => p.id !== productId));
  };

  // Función para vaciar el carrito
  const clearCart = () => {
    setCart([]);
  };

  // Función para actualizar la cantidad de un producto
  const updateQuantity = (productId, newQuantity) => {
    setCart((prevCart) => {
      return prevCart.map((p) =>
        p.id === productId ? { ...p, quantity: newQuantity } : p
      );
    });
  };

  // Proveer todas las funciones y estados
  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, clearCart, updateQuantity, isCartOpen, setIsCartOpen }}>
      {children}
    </CartContext.Provider>
  );
};
