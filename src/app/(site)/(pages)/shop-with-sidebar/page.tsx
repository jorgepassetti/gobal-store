import React from 'react';
import ShopWithSidebar from '@/components/ShopWithSidebar';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Tienda Online | GobalStore Tecnología de Importación',
  description:
    'Explorá el catálogo completo de GobalStore: smartphones, notebooks, accesorios y más productos tecnológicos de importación. Comprá online con envío seguro en Argentina.',
  keywords: [
    'tienda online tecnología',
    'comprar smartphones importados',
    'notebooks importadas',
    'accesorios tech',
    'productos tecnológicos Argentina',
    'GobalStore catálogo',
  ],
  openGraph: {
    title: 'Tienda Online | GobalStore',
    description:
      'Descubrí la tienda online de GobalStore con productos tecnológicos importados: smartphones, notebooks y accesorios al mejor precio.',
    url: 'https://gobal-store.vercel.app/shop',
    siteName: 'GobalStore',
    images: [
      {
        url: '/og-shop.jpg', // ideal una imagen de tu catálogo
        width: 1200,
        height: 630,
        alt: 'Catálogo GobalStore - Tecnología de Importación',
      },
    ],
    locale: 'es_AR',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'GobalStore | Catálogo de Tecnología de Importación',
    description:
      'Explorá smartphones, notebooks y accesorios tecnológicos importados en nuestra tienda online. Envíos rápidos y seguros en Argentina.',
    images: ['/og-shop.jpg'],
    creator: '@gobalstore',
  },
};

const ShopWithSidebarPage = () => {
  return (
    <main>
      <ShopWithSidebar />
    </main>
  );
};

export default ShopWithSidebarPage;
