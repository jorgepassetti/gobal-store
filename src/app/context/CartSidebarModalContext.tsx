'use client';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { CartItem, hydrateCart } from '@/redux/features/cart-slice';

interface CartModalContextType {
  isCartModalOpen: boolean;
  openCartModal: () => void;
  closeCartModal: () => void;
}

const CartModalContext = createContext<CartModalContextType | undefined>(
  undefined,
);

export const useCartModalContext = () => {
  const context = useContext(CartModalContext);
  if (!context) {
    throw new Error('useModalContext must be used within a ModalProvider');
  }
  return context;
};

export const CartModalProvider = ({ children }) => {
  const dispatch = useDispatch();
  useEffect(() => {
    // Este código solo se ejecuta en el cliente
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      try {
        const parsedCart: CartItem[] = JSON.parse(savedCart);
        dispatch(hydrateCart(parsedCart));
      } catch (e) {
        console.error('Error al hidratar el carrito:', e);
        // Opcional: limpiar localStorage si está corrupto
        localStorage.removeItem('cart');
      }
    }
  }, [dispatch]); // El dispatch casi nunca cambia, pero es buena práctica incluirlo

  const [isCartModalOpen, setIsCartModalOpen] = useState(false);

  const openCartModal = () => {
    setIsCartModalOpen(true);
  };

  const closeCartModal = () => {
    setIsCartModalOpen(false);
  };

  return (
    <CartModalContext.Provider
      value={{ isCartModalOpen, openCartModal, closeCartModal }}
    >
      {children}
    </CartModalContext.Provider>
  );
};
