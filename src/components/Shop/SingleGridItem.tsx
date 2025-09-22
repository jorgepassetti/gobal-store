import React from 'react';
import { Product } from '@/types/product';
import Image from 'next/image';

const SingleGridItem = ({ item }: { item: Product }) => {
  return (
    <div
      className='group cursor-pointer relative rounded-lg overflow-hidden bg-white shadow-md hover:shadow-xl transition-shadow duration-200 ease-in-out'
      onClick={() => {
        window.location.href = `/products/${item.id}`;
      }}
    >
      {/* Image Section */}
      <div className='relative h-[270px] overflow-hidden border-b border-gray-3'>
        <Image
          src={item.media?.[0]?.url || '/images/placeholder.jpg'}
          alt={item.title || 'Product image'}
          width={250}
          height={250}
          className='w-full h-full object-cover'
        />
      </div>

      {/* Info Section */}
      <div className='p-4'>
        {/* Price */}
        <div className='mb-2'>
          <div className='text-gray-8 text-sm font-light line-through'>
            ${item.price_before_discount}
          </div>
          <div className='flex items-center gap-2 mb-1'>
            <div className='text-2xl font-medium text-dark'>${item.price}</div>
            <div className='text-green-discount text-sm mt-1'>
              {Math.round(
                ((item.price_before_discount - item.price) /
                  item.price_before_discount) *
                  100,
              )}
              % OFF
            </div>
          </div>
        </div>

        {/* Free shipping (optional) */}
        {/* <div className='text-green-600 text-sm font-medium mb-2'>
          Envío gratis
        </div> */}

        {/* Title */}
        <h3 className='font-light text-dark-6 text-sm leading-tight line-clamp-2'>
          {item.title}
        </h3>
      </div>
    </div>
  );
};

export default SingleGridItem;
