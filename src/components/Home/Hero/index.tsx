import React from 'react';
import HeroCarousel from './HeroCarousel';
import HeroFeature from './HeroFeature';
import Image from 'next/image';
import { db } from '@/lib/firebase';
import { collection, getDocs, limit, query, where } from 'firebase/firestore';
import { Product } from '@/types/product';
import { formatPrice, truncate } from '@/lib/utils';

const Hero = async () => {
  const productsRef = collection(db, 'products');
  const activeQuery = query(
    productsRef,
    where('highlight', '==', true),
    limit(3),
  );
  const snapshot = await getDocs(activeQuery);

  const products = snapshot.docs.map((doc) => {
    const data = doc.data();
    console.log(data);

    return {
      id: doc.id,
      ...data,
      createdAt: data.createdAt?.toDate
        ? data.createdAt.toDate().toISOString()
        : null,
    } as unknown as Product;
  });
  if (!products?.length) return <></>;

  return (
    <section className='overflow-hidden pb-10 lg:pb-12.5 xl:pb-15 pt-57.5 sm:pt-45 lg:pt-30 xl:pt-51.5 bg-[#E5EAF4]'>
      <div className='max-w-[1170px] w-full mx-auto px-4 sm:px-8 xl:px-0'>
        <div className='flex flex-wrap gap-5'>
          <div className='xl:max-w-[757px] w-full'>
            <div className='relative z-1 rounded-[10px] bg-white overflow-hidden'>
              {/* <!-- bg shapes --> */}
              <Image
                src='/images/hero/hero-bg.png'
                alt='hero bg shapes'
                className='absolute right-0 bottom-0 -z-1'
                width={534}
                height={520}
              />

              <HeroCarousel product={products[0]} />
            </div>
          </div>

          {products.length > 1 && (
            <div className='xl:max-w-[393px] w-full'>
              <div className=''>
                <div className='h-full w-full relative rounded-[10px] bg-white p-4 sm:p-7.5'>
                  <div>
                    <Image
                      src={products[1].media[0].url}
                      alt='mobile image'
                      width={350}
                      height={250}
                      className='rounded'
                    />
                  </div>
                  <h2 className='font-semibold text-dark text-xl mb-8 mt-4'>
                    <a href={`/products/${products[1].id}`}>
                      {truncate(products[1].title, 80)}
                    </a>
                  </h2>
                  <div className='flex items-center gap-14'>
                    <div>
                      <div>
                        <p className='font-medium text-dark text-custom-sm mb-1.5'>
                          Oferta por tiempo limitado
                        </p>
                        <span className='flex items-center gap-3'>
                          <span className='font-light text-heading-5 text-green'>
                            {formatPrice(products[1].price)}
                          </span>
                          <span className='text-xl text-dark line-through'>
                            {formatPrice(products[1].price_before_discount)}
                          </span>
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                {/* <div className='w-full relative rounded-[10px] bg-white p-4 sm:p-7.5'>
                  <div>
                    <Image
                      src={products[2].media[0].url}
                      alt='mobile image'
                      width={123}
                      height={250}
                    />
                  </div>
                  <h2 className='mt-4 font-semibold text-dark text-xl mb-8'>
                    <a href={`/products/${products[2].id}`}>
                      {products[2].title}{' '}
                    </a>
                  </h2>
                  <div className='flex items-center gap-14'>
                    <div>
                      <div>
                        <p className='font-medium text-dark-4 text-custom-sm mb-1.5'>
                          Oferta por tiempo limitado
                        </p>
                        <span className='flex items-center gap-3'>
                          <span className='font-medium text-heading-5 text-red'>
                            {products[2].price}
                          </span>
                          <span className='font-medium text-2xl text-dark-4 line-through'>
                            {products[2].price_before_discount}
                          </span>
                        </span>
                      </div>
                    </div>
                  </div>
                </div> */}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* <!-- Hero features --> */}
      <HeroFeature />
    </section>
  );
};

export default Hero;
