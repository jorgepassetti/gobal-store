'use client';
import React from 'react';
import Image from 'next/image';
import { Product } from '@/types/product';
import { useModalContext } from '@/app/context/QuickViewModalContext';
import { updateQuickView } from '@/redux/features/quickView-slice';
import { updateproductDetails } from '@/redux/features/product-details';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '@/redux/store';
import Link from 'next/link';
import { useCartModalContext } from '@/app/context/CartSidebarModalContext';

const ProductItem = ({ item }: { item: Product }) => {
  const { openModal } = useModalContext();
  const { openCartModal } = useCartModalContext();

  const dispatch = useDispatch<AppDispatch>();

  // Update QuickView state
  const handleQuickViewUpdate = () => {
    dispatch(updateQuickView({ ...item }));
  };

  // Add to cart
  const handleAddToCart = () => {
    openCartModal();
  };

  const handleProductDetails = () => {
    dispatch(updateproductDetails({ ...item }));
  };

  return (
    <div
      className='group cursor-pointer relative rounded-lg overflow-hidden bg-white shadow-md hover:shadow-xl transition-shadow duration-200 ease-in-out'
      onClick={() => {
        // Redirigir a /products/:id
        window.location.href = `/products/${item.id}`;
      }}
    >
      {/* Image Section */}
      <div className='relative h-[270px] overflow-hidden border-b border-gray-3'>
        <Image
          src={item.media?.[0]?.url}
          alt={item.title}
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
                ((item.price_before_discount - item.price) / item.price) * 100,
              )}
              % OFF
            </div>
          </div>
        </div>

        {/* Free shipping */}
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

export default ProductItem;
