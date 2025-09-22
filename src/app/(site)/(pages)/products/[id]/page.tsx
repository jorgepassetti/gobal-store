'use client';
import { db } from '@/lib/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { Product } from '@/types/product';
import ProductClient from '../../../../../components/products/ProductClient';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function ProductPage({ params }) {
  const { id } = useParams();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (id) {
      loadProduct();
    }
  }, [id]);

  const loadProduct = async () => {
    try {
      setLoading(true);
      const ref = doc(db, 'products', id as string);
      const snapshot = await getDoc(ref);
      const product = {
        id: snapshot.id,
        ...snapshot.data(),
        createdAt: snapshot.data().createdAt?.toDate().toISOString() || null,
      } as unknown as Product;

      setProduct(product);
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  if (!product && !loading) {
    return (
      <div className='flex items-center justify-center h-screen'>
        <h1 className='text-2xl font-bold text-gray-800'>
          Producto no encontrado
        </h1>
      </div>
    );
  }

  if (loading) {
    <div className='flex items-center justify-center py-16'>
      <div className='inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]'></div>
      <span className='ml-3 text-gray-500'>Cargando productos...</span>
    </div>;
  }

  return (
    <>
      {/* JSON-LD for SEO */}
      <script
        type='application/ld+json'
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org/',
            '@type': 'Product',
            name: product?.title,
            image: product?.media.map((m) => m.url),
            description: product?.title,
            offers: {
              '@type': 'Offer',
              priceCurrency: 'ARS',
              price: product?.price,
              availability: 'https://schema.org/InStock',
            },
          }),
        }}
      />

      {/* Componente client con interacciones */}
      <ProductClient product={product} />
    </>
  );
}

// export async function generateMetadata({ params }: { params: { id: string } }) {
//   const ref = doc(db, 'products', params.id);
//   const snapshot = await getDoc(ref);
//   const product = snapshot.exists() ? snapshot.data() : null;

//   return {
//     title: product ? product.title : 'Producto no encontrado',
//     description: product?.title || 'Compra productos de calidad',
//     openGraph: {
//       title: product?.title,
//       description: product?.title,
//       images: product?.media?.map((m: any) => m.url) || [],
//     },
//   };
// }
