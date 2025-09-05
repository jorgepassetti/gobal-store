import React from 'react';
import Cart from '@/components/Cart';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Carrito de Compras | GobalStore',
  description:
    'Revisá tu carrito en GobalStore y completá tu compra de productos tecnológicos importados. Confirmá tus productos favoritos con envío rápido en Argentina.',
  keywords: [
    'carrito de compras',
    'checkout tecnología',
    'comprar online',
    'productos tecnológicos importados',
    'GobalStore Argentina',
  ],
  openGraph: {
    title: 'Carrito de Compras | GobalStore',
    description:
      'Confirmá y gestioná tu compra de productos tecnológicos importados en GobalStore. Fácil, rápido y seguro.',
    url: 'https://gobal-store.vercel.app/cart',
    siteName: 'GobalStore',
    images: [
      {
        url: '/og-cart.jpg', // te conviene tener una img genérica de carrito
        width: 1200,
        height: 630,
        alt: 'Carrito de Compras GobalStore',
      },
    ],
    locale: 'es_AR',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Carrito de Compras | GobalStore',
    description:
      'Revisá tus productos en el carrito de GobalStore y completá tu compra online de tecnología importada.',
    images: ['/og-cart.jpg'],
    creator: '@gobalstore',
  },
};

const CartPage = () => {
  return (
    <>
      <Cart />
    </>
  );
};

export default CartPage;
