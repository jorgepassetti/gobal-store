'use client';
import { db } from '@/lib/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { Product } from '@/types/product';
import ProductClient from '../../../../../components/products/ProductClient';

export default async function ProductPage({ params }) {
  const params2: any = Object.assign({}, params);
  console.log(params2.id);

  const ref = doc(db, 'products', params.id);
  const snapshot = await getDoc(ref);

  if (!snapshot.exists()) {
    return (
      <div className='flex items-center justify-center h-screen'>
        <h1 className='text-2xl font-bold text-gray-800'>
          Producto no encontrado
        </h1>
      </div>
    );
  }

  const product = {
    id: snapshot.id,
    ...snapshot.data(),
    createdAt: snapshot.data().createdAt?.toDate().toISOString() || null,
  } as unknown as Product;

  return (
    <>
      {/* JSON-LD for SEO */}
      <script
        type='application/ld+json'
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org/',
            '@type': 'Product',
            name: product.title,
            image: product.media.map((m) => m.url),
            description: product.title,
            offers: {
              '@type': 'Offer',
              priceCurrency: 'ARS',
              price: product.price,
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
