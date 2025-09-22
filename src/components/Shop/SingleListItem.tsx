import React from 'react';
import { Product } from '@/types/product';
import Image from 'next/image';

const SingleListItem = ({ item }: { item: Product }) => {
  return (
    <div
      className='group cursor-pointer rounded-lg bg-white shadow-1 hover:shadow-xl transition-shadow duration-200 ease-in-out'
      onClick={() => {
        window.location.href = `/products/${item.id}`;
      }}
    >
      <div className='flex flex-col sm:flex-row'>
        {/* Image Section */}
        <div className='relative overflow-hidden flex items-center justify-center max-w-[270px] w-full sm:min-h-[270px] p-4 border-b sm:border-b-0 sm:border-r border-gray-3'>
          <Image
            src={item.media?.[0]?.url || '/images/placeholder.jpg'}
            alt={item.title || 'Product image'}
            width={250}
            height={250}
            className='w-full h-full object-cover'
          />
        </div>

        {/* Info Section */}
        <div className='flex-1 flex flex-col justify-center p-4 sm:p-6 lg:px-8'>
          {/* Price */}
          <div className='mb-3'>
            <div className='text-gray-8 text-sm font-light line-through'>
              ${item.price_before_discount}
            </div>
            <div className='flex items-center gap-2 mb-1'>
              <div className='text-2xl font-medium text-dark'>
                ${item.price}
              </div>
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
          {/* <div className='text-green-600 text-sm font-medium mb-3'>
            Envío gratis
          </div> */}

          {/* Title */}
          <h3 className='font-light text-dark-6 text-sm leading-tight line-clamp-2'>
            {item.title}
          </h3>
        </div>
      </div>
    </div>
  );
};

export default SingleListItem;
