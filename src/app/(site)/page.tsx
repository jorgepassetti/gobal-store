import Home from '@/components/Home';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'GobalStore | Tecnología de Importación al Mejor Precio',
  description:
    'Descubrí en GobalStore los últimos productos tecnológicos de importación: smartphones, notebooks, accesorios y más. Envíos rápidos y seguros en Argentina.',
  keywords: [
    'GobalStore',
    'tienda online tecnología',
    'productos importados',
    'smartphones',
    'notebooks',
    'accesorios tech',
    'comprar tecnología Argentina',
  ],
  openGraph: {
    title: 'GobalStore | Tu Tienda de Tecnología de Importación',
    description:
      'GobalStore ofrece smartphones, notebooks y accesorios importados con envío rápido y seguro en Argentina.',
    url: 'https://gobal-store.vercel.app',
    siteName: 'GobalStore',
    images: [
      {
        url: '/og-image.jpg', // poné una imagen 1200x630 en /public
        width: 1200,
        height: 630,
        alt: 'GobalStore - Tecnología de Importación',
      },
    ],
    locale: 'es_AR',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'GobalStore | Tecnología de Importación',
    description:
      'Comprá online smartphones, notebooks y accesorios tecnológicos importados en Argentina. Envíos rápidos y seguros.',
    images: ['/og-image.jpg'],
    creator: '@gobalstore', // si tenés cuenta de Twitter/X
  },
};

export default function HomePage() {
  return (
    <>
      <Home />
    </>
  );
}
