'use client';

import { useCartModalContext } from '@/app/context/CartSidebarModalContext';
import Breadcrumb from '@/components/Common/Breadcrumb';
import Newsletter from '@/components/Common/Newsletter';
import { useAuth } from '@/context/AuthContext';
import { addItemToCart, CartItem } from '@/redux/features/cart-slice';
import { AppDispatch } from '@/redux/store';
import { Product } from '@/types/product';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useDispatch } from 'react-redux';

export default function ProductClient({ product }: { product: Product }) {
  const { user } = useAuth();
  const { openCartModal } = useCartModalContext();
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();

  const handleBuyNow = () => {
    const cartItem: CartItem = {
      price: product.price_before_discount,
      discountedPrice: product.price,
      id: parseInt(product.id),
      title: product.title,
      quantity: 1,
      imgs: {
        thumbnails: product.media.map((img) => img.url),
        previews: product.media.map((img) => img.url),
      },
    };

    dispatch(addItemToCart(cartItem));
    router.push(!!user ? '/checkout' : '/signup');
  };

  const handleAddToCart = () => {
    console.log('Agregar al carrito');
    const cartItem: CartItem = {
      price: product.price_before_discount,
      discountedPrice: product.price,
      id: parseInt(product.id),
      title: product.title,
      quantity: 1,
      imgs: {
        thumbnails: product.media.map((img) => img.url),
        previews: product.media.map((img) => img.url),
      },
    };

    dispatch(addItemToCart(cartItem));
    openCartModal();
  };

  const [activeTab, setActiveTab] = useState('tabOne');
  const tabs = [
    {
      id: 'tabOne',
      title: 'Descripcion',
    },
    // {
    //   id: 'tabTwo',
    //   title: 'Additional Information',
    // },
    // {
    //   id: 'tabThree',
    //   title: 'Reviews',
    // },
  ];

  if (!product && !loading) {
    return (
      <div className='flex items-center justify-center h-screen'>
        <h1 className='text-2xl font-bold text-gray-800'>
          Producto no encontrado
        </h1>
      </div>
    );
  }

  const handleThumbnailClick = (index: number) => {
    setSelectedImageIndex(index);
  };

  return (
    <>
      <section>
        <Breadcrumb title={''} pages={['Carrito']} />
      </section>

      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
        {/* Grid principal */}
        <div className='flex gap-10'>
          {/* Sección de imágenes */}
          {/* Sección de imágenes */}
          <div className='flex flex-1 gap-4'>
            {/* Miniaturas en columna */}

            {product.media.length > 1 && (
              <div className='flex flex-col space-y-3'>
                {product.media.map((item, index) => (
                  <button
                    key={index}
                    onMouseEnter={() => handleThumbnailClick(index)}
                    className={`w-20 h-20 border-dark rounded transition-all duration-200 ${
                      selectedImageIndex === index
                        ? 'border-blue ring-2 ring-blue'
                        : 'border-gray hover:border-gray-400'
                    }`}
                  >
                    <Image
                      src={item.url}
                      alt={`Thumbnail ${index + 1}`}
                      width={80}
                      height={80}
                      className='w-full h-full object-cover rounded'
                      sizes='80px'
                    />
                  </button>
                ))}
              </div>
            )}

            {/* Imagen principal */}
            <div className='relative w-full h-[600px] bg-white rounded-lg shadow-md overflow-hidden flex-1'>
              <div className='group relative w-full h-full overflow-hidden'>
                <Image
                  src={product.media[selectedImageIndex].url}
                  alt={product.title}
                  fill
                  className='object-contain transition-transform duration-300 group-hover:scale-110'
                  sizes='(max-width: 768px) 100vw, 800px'
                  priority
                />
              </div>
            </div>
          </div>

          {/* Detalles del producto */}
          <div className='w-[400px] flex-shrink-0 border border-gray rounded-lg'>
            <div className='flex flex-col justify-start p-6'>
              <h1 className='text-3xl font-normal text-dark mb-4'>
                {product.title}
              </h1>

              <div className='flex flex-col items-start mb-6'>
                <span className='text text-gray-6 line-through'>
                  ${(product.price * 1.1).toLocaleString()}
                </span>

                <div className='flex items-center  space-x-4'>
                  <span className='text-4xl font-extralight text-dark-6'>
                    ${product.price.toLocaleString()}
                  </span>

                  <div className='text-xl text-green-discount'>
                    {Math.round(
                      ((product.price - product.price * 1.1) / product.price) *
                        100,
                    )}
                    % OFF
                  </div>
                </div>
              </div>

              <div className='flex flex-col space-y-4 mb-8'>
                <button
                  onClick={handleBuyNow}
                  className='bg-blue hover:bg-blue-dark text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-5 focus:ring-offset-2'
                >
                  Comprar ahora
                </button>
                <button
                  onClick={handleAddToCart}
                  className='bg-gray hover:bg-gray-3 text-gray-8 font-medium py-3 px-6 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-gray-4 focus:ring-offset-2'
                >
                  Añadir al carrito
                </button>
              </div>

              {/* <div className='border-t border-gray-3 pt-6'>
                <h2 className='text-lg font-semibold text-gray-800 mb-3'>
                  Detalles del producto
                </h2>
                <p className='text-gray-700 leading-relaxed whitespace-pre-line'>
                  {product.descriptionHTML ||
                    'Descripción no disponible. Este producto es de alta calidad y cumple con todos los estándares del mercado.'}
                </p>
              </div> */}
            </div>
          </div>
        </div>
      </div>
      <section className='overflow-hidden bg-gray-2 py-20'>
        <div className='max-w-[1170px] w-full mx-auto px-4 sm:px-8 xl:px-0'>
          {/* <!--== tab header start ==--> */}
          <div className='flex flex-wrap items-center bg-white rounded-[10px] shadow-1 gap-5 xl:gap-12.5 py-4.5 px-4 sm:px-6'>
            {tabs.map((item, key) => (
              <button
                key={key}
                onClick={() => setActiveTab(item.id)}
                className={`font-medium lg:text-lg ease-out duration-200 hover:text-blue relative before:h-0.5 before:bg-blue before:absolute before:left-0 before:bottom-0 before:ease-out before:duration-200 hover:before:w-full ${
                  activeTab === item.id
                    ? 'text-blue before:w-full'
                    : 'text-dark before:w-0'
                }`}
              >
                {item.title}
              </button>
            ))}
          </div>
          {/* <!--== tab header end ==--> */}

          {/* <!--== tab content start ==--> */}
          {/* <!-- tab content one start --> */}
          <div>
            <div
              className={`flex-col sm:flex-row gap-7.5 xl:gap-12.5 mt-12.5 ${
                activeTab === 'tabOne' ? 'flex' : 'hidden'
              }`}
            >
              <div className='max-w-[670px] w-full'>
                <div
                  dangerouslySetInnerHTML={{ __html: product.descriptionHTML }}
                />
              </div>
            </div>
          </div>
          {/* <!-- tab content one end --> */}

          {/* <!-- tab content two start --> */}
          <div>
            <div
              className={`rounded-xl bg-white shadow-1 p-4 sm:p-6 mt-10 ${
                activeTab === 'tabTwo' ? 'block' : 'hidden'
              }`}
            >
              {/* <!-- info item --> */}
              <div className='rounded-md even:bg-gray-1 flex py-4 px-4 sm:px-5'>
                <div className='max-w-[450px] min-w-[140px] w-full'>
                  <p className='text-sm sm:text-base text-dark'>Brand</p>
                </div>
                <div className='w-full'>
                  <p className='text-sm sm:text-base text-dark'>Apple</p>
                </div>
              </div>

              {/* <!-- info item --> */}
              <div className='rounded-md even:bg-gray-1 flex py-4 px-4 sm:px-5'>
                <div className='max-w-[450px] min-w-[140px] w-full'>
                  <p className='text-sm sm:text-base text-dark'>Model</p>
                </div>
                <div className='w-full'>
                  <p className='text-sm sm:text-base text-dark'>
                    iPhone 14 Plus
                  </p>
                </div>
              </div>

              {/* <!-- info item --> */}
              <div className='rounded-md even:bg-gray-1 flex py-4 px-4 sm:px-5'>
                <div className='max-w-[450px] min-w-[140px] w-full'>
                  <p className='text-sm sm:text-base text-dark'>Display Size</p>
                </div>
                <div className='w-full'>
                  <p className='text-sm sm:text-base text-dark'>6.7 inches</p>
                </div>
              </div>

              {/* <!-- info item --> */}
              <div className='rounded-md even:bg-gray-1 flex py-4 px-4 sm:px-5'>
                <div className='max-w-[450px] min-w-[140px] w-full'>
                  <p className='text-sm sm:text-base text-dark'>Display Type</p>
                </div>
                <div className='w-full'>
                  <p className='text-sm sm:text-base text-dark'>
                    Super Retina XDR OLED, HDR10, Dolby Vision, 800 nits (HBM),
                    1200 nits (peak)
                  </p>
                </div>
              </div>

              {/* <!-- info item --> */}
              <div className='rounded-md even:bg-gray-1 flex py-4 px-4 sm:px-5'>
                <div className='max-w-[450px] min-w-[140px] w-full'>
                  <p className='text-sm sm:text-base text-dark'>
                    Display Resolution
                  </p>
                </div>
                <div className='w-full'>
                  <p className='text-sm sm:text-base text-dark'>
                    1284 x 2778 pixels, 19.5:9 ratio
                  </p>
                </div>
              </div>

              {/* <!-- info item --> */}
              <div className='rounded-md even:bg-gray-1 flex py-4 px-4 sm:px-5'>
                <div className='max-w-[450px] min-w-[140px] w-full'>
                  <p className='text-sm sm:text-base text-dark'>Chipset</p>
                </div>
                <div className='w-full'>
                  <p className='text-sm sm:text-base text-dark'>
                    Apple A15 Bionic (5 nm)
                  </p>
                </div>
              </div>

              {/* <!-- info item --> */}
              <div className='rounded-md even:bg-gray-1 flex py-4 px-4 sm:px-5'>
                <div className='max-w-[450px] min-w-[140px] w-full'>
                  <p className='text-sm sm:text-base text-dark'>Memory</p>
                </div>
                <div className='w-full'>
                  <p className='text-sm sm:text-base text-dark'>
                    128GB 6GB RAM | 256GB 6GB RAM | 512GB 6GB RAM
                  </p>
                </div>
              </div>

              {/* <!-- info item --> */}
              <div className='rounded-md even:bg-gray-1 flex py-4 px-4 sm:px-5'>
                <div className='max-w-[450px] min-w-[140px] w-full'>
                  <p className='text-sm sm:text-base text-dark'>Main Camera</p>
                </div>
                <div className='w-full'>
                  <p className='text-sm sm:text-base text-dark'>
                    12MP + 12MP | 4K@24/25/30/60fps, stereo sound rec.
                  </p>
                </div>
              </div>

              {/* <!-- info item --> */}
              <div className='rounded-md even:bg-gray-1 flex py-4 px-4 sm:px-5'>
                <div className='max-w-[450px] min-w-[140px] w-full'>
                  <p className='text-sm sm:text-base text-dark'>
                    Selfie Camera
                  </p>
                </div>
                <div className='w-full'>
                  <p className='text-sm sm:text-base text-dark'>
                    12 MP | 4K@24/25/30/60fps, 1080p@25/30/60/120fps, gyro-EIS
                  </p>
                </div>
              </div>

              {/* <!-- info item --> */}
              <div className='rounded-md even:bg-gray-1 flex py-4 px-4 sm:px-5'>
                <div className='max-w-[450px] min-w-[140px] w-full'>
                  <p className='text-sm sm:text-base text-dark'>Battery Info</p>
                </div>
                <div className='w-full'>
                  <p className='text-sm sm:text-base text-dark'>
                    Li-Ion 4323 mAh, non-removable | 15W wireless (MagSafe),
                    7.5W wireless (Qi)
                  </p>
                </div>
              </div>
            </div>
          </div>
          {/* <!-- tab content two end --> */}

          {/* <!-- tab content three start --> */}
          <div>
            <div
              className={`flex-col sm:flex-row gap-7.5 xl:gap-12.5 mt-12.5 ${
                activeTab === 'tabThree' ? 'flex' : 'hidden'
              }`}
            >
              <div className='max-w-[570px] w-full'>
                <h2 className='font-medium text-2xl text-dark mb-9'>
                  03 Review for this product
                </h2>

                <div className='flex flex-col gap-6'>
                  {/* <!-- review item --> */}
                  <div className='rounded-xl bg-white shadow-1 p-4 sm:p-6'>
                    <div className='flex items-center justify-between'>
                      <a href='#' className='flex items-center gap-4'>
                        <div className='w-12.5 h-12.5 rounded-full overflow-hidden'>
                          <Image
                            src='/images/users/user-01.jpg'
                            alt='author'
                            className='w-12.5 h-12.5 rounded-full overflow-hidden'
                            width={50}
                            height={50}
                          />
                        </div>

                        <div>
                          <h3 className='font-medium text-dark'>
                            Davis Dorwart
                          </h3>
                          <p className='text-custom-sm'>Serial Entrepreneur</p>
                        </div>
                      </a>

                      <div className='flex items-center gap-1'>
                        <span className='cursor-pointer text-[#FBB040]'>
                          <svg
                            className='fill-current'
                            width='15'
                            height='16'
                            viewBox='0 0 15 16'
                            fill='none'
                            xmlns='http://www.w3.org/2000/svg'
                          >
                            <path
                              d='M14.6604 5.90785L9.97461 5.18335L7.85178 0.732874C7.69645 0.422375 7.28224 0.422375 7.12691 0.732874L5.00407 5.20923L0.344191 5.90785C0.0076444 5.9596 -0.121797 6.39947 0.137085 6.63235L3.52844 10.1255L2.72591 15.0158C2.67413 15.3522 3.01068 15.6368 3.32134 15.4298L7.54112 13.1269L11.735 15.4298C12.0198 15.5851 12.3822 15.3263 12.3046 15.0158L11.502 10.1255L14.8934 6.63235C15.1005 6.39947 14.9969 5.9596 14.6604 5.90785Z'
                              fill=''
                            />
                          </svg>
                        </span>

                        <span className='cursor-pointer text-[#FBB040]'>
                          <svg
                            className='fill-current'
                            width='15'
                            height='16'
                            viewBox='0 0 15 16'
                            fill='none'
                            xmlns='http://www.w3.org/2000/svg'
                          >
                            <path
                              d='M14.6604 5.90785L9.97461 5.18335L7.85178 0.732874C7.69645 0.422375 7.28224 0.422375 7.12691 0.732874L5.00407 5.20923L0.344191 5.90785C0.0076444 5.9596 -0.121797 6.39947 0.137085 6.63235L3.52844 10.1255L2.72591 15.0158C2.67413 15.3522 3.01068 15.6368 3.32134 15.4298L7.54112 13.1269L11.735 15.4298C12.0198 15.5851 12.3822 15.3263 12.3046 15.0158L11.502 10.1255L14.8934 6.63235C15.1005 6.39947 14.9969 5.9596 14.6604 5.90785Z'
                              fill=''
                            />
                          </svg>
                        </span>

                        <span className='cursor-pointer text-[#FBB040]'>
                          <svg
                            className='fill-current'
                            width='15'
                            height='16'
                            viewBox='0 0 15 16'
                            fill='none'
                            xmlns='http://www.w3.org/2000/svg'
                          >
                            <path
                              d='M14.6604 5.90785L9.97461 5.18335L7.85178 0.732874C7.69645 0.422375 7.28224 0.422375 7.12691 0.732874L5.00407 5.20923L0.344191 5.90785C0.0076444 5.9596 -0.121797 6.39947 0.137085 6.63235L3.52844 10.1255L2.72591 15.0158C2.67413 15.3522 3.01068 15.6368 3.32134 15.4298L7.54112 13.1269L11.735 15.4298C12.0198 15.5851 12.3822 15.3263 12.3046 15.0158L11.502 10.1255L14.8934 6.63235C15.1005 6.39947 14.9969 5.9596 14.6604 5.90785Z'
                              fill=''
                            />
                          </svg>
                        </span>

                        <span className='cursor-pointer text-[#FBB040]'>
                          <svg
                            className='fill-current'
                            width='15'
                            height='16'
                            viewBox='0 0 15 16'
                            fill='none'
                            xmlns='http://www.w3.org/2000/svg'
                          >
                            <path
                              d='M14.6604 5.90785L9.97461 5.18335L7.85178 0.732874C7.69645 0.422375 7.28224 0.422375 7.12691 0.732874L5.00407 5.20923L0.344191 5.90785C0.0076444 5.9596 -0.121797 6.39947 0.137085 6.63235L3.52844 10.1255L2.72591 15.0158C2.67413 15.3522 3.01068 15.6368 3.32134 15.4298L7.54112 13.1269L11.735 15.4298C12.0198 15.5851 12.3822 15.3263 12.3046 15.0158L11.502 10.1255L14.8934 6.63235C15.1005 6.39947 14.9969 5.9596 14.6604 5.90785Z'
                              fill=''
                            />
                          </svg>
                        </span>

                        <span className='cursor-pointer text-[#FBB040]'>
                          <svg
                            className='fill-current'
                            width='15'
                            height='16'
                            viewBox='0 0 15 16'
                            fill='none'
                            xmlns='http://www.w3.org/2000/svg'
                          >
                            <path
                              d='M14.6604 5.90785L9.97461 5.18335L7.85178 0.732874C7.69645 0.422375 7.28224 0.422375 7.12691 0.732874L5.00407 5.20923L0.344191 5.90785C0.0076444 5.9596 -0.121797 6.39947 0.137085 6.63235L3.52844 10.1255L2.72591 15.0158C2.67413 15.3522 3.01068 15.6368 3.32134 15.4298L7.54112 13.1269L11.735 15.4298C12.0198 15.5851 12.3822 15.3263 12.3046 15.0158L11.502 10.1255L14.8934 6.63235C15.1005 6.39947 14.9969 5.9596 14.6604 5.90785Z'
                              fill=''
                            />
                          </svg>
                        </span>
                      </div>
                    </div>

                    <p className='text-dark mt-6'>
                      “Lorem ipsum dolor sit amet, adipiscing elit. Donec
                      malesuada justo vitaeaugue suscipit beautiful vehicula’’
                    </p>
                  </div>

                  {/* <!-- review item --> */}
                  <div className='rounded-xl bg-white shadow-1 p-4 sm:p-6'>
                    <div className='flex items-center justify-between'>
                      <a href='#' className='flex items-center gap-4'>
                        <div className='w-12.5 h-12.5 rounded-full overflow-hidden'>
                          <Image
                            src='/images/users/user-01.jpg'
                            alt='author'
                            className='w-12.5 h-12.5 rounded-full overflow-hidden'
                            width={50}
                            height={50}
                          />
                        </div>

                        <div>
                          <h3 className='font-medium text-dark'>
                            Davis Dorwart
                          </h3>
                          <p className='text-custom-sm'>Serial Entrepreneur</p>
                        </div>
                      </a>

                      <div className='flex items-center gap-1'>
                        <span className='cursor-pointer text-[#FBB040]'>
                          <svg
                            className='fill-current'
                            width='15'
                            height='16'
                            viewBox='0 0 15 16'
                            fill='none'
                            xmlns='http://www.w3.org/2000/svg'
                          >
                            <path
                              d='M14.6604 5.90785L9.97461 5.18335L7.85178 0.732874C7.69645 0.422375 7.28224 0.422375 7.12691 0.732874L5.00407 5.20923L0.344191 5.90785C0.0076444 5.9596 -0.121797 6.39947 0.137085 6.63235L3.52844 10.1255L2.72591 15.0158C2.67413 15.3522 3.01068 15.6368 3.32134 15.4298L7.54112 13.1269L11.735 15.4298C12.0198 15.5851 12.3822 15.3263 12.3046 15.0158L11.502 10.1255L14.8934 6.63235C15.1005 6.39947 14.9969 5.9596 14.6604 5.90785Z'
                              fill=''
                            />
                          </svg>
                        </span>

                        <span className='cursor-pointer text-[#FBB040]'>
                          <svg
                            className='fill-current'
                            width='15'
                            height='16'
                            viewBox='0 0 15 16'
                            fill='none'
                            xmlns='http://www.w3.org/2000/svg'
                          >
                            <path
                              d='M14.6604 5.90785L9.97461 5.18335L7.85178 0.732874C7.69645 0.422375 7.28224 0.422375 7.12691 0.732874L5.00407 5.20923L0.344191 5.90785C0.0076444 5.9596 -0.121797 6.39947 0.137085 6.63235L3.52844 10.1255L2.72591 15.0158C2.67413 15.3522 3.01068 15.6368 3.32134 15.4298L7.54112 13.1269L11.735 15.4298C12.0198 15.5851 12.3822 15.3263 12.3046 15.0158L11.502 10.1255L14.8934 6.63235C15.1005 6.39947 14.9969 5.9596 14.6604 5.90785Z'
                              fill=''
                            />
                          </svg>
                        </span>

                        <span className='cursor-pointer text-[#FBB040]'>
                          <svg
                            className='fill-current'
                            width='15'
                            height='16'
                            viewBox='0 0 15 16'
                            fill='none'
                            xmlns='http://www.w3.org/2000/svg'
                          >
                            <path
                              d='M14.6604 5.90785L9.97461 5.18335L7.85178 0.732874C7.69645 0.422375 7.28224 0.422375 7.12691 0.732874L5.00407 5.20923L0.344191 5.90785C0.0076444 5.9596 -0.121797 6.39947 0.137085 6.63235L3.52844 10.1255L2.72591 15.0158C2.67413 15.3522 3.01068 15.6368 3.32134 15.4298L7.54112 13.1269L11.735 15.4298C12.0198 15.5851 12.3822 15.3263 12.3046 15.0158L11.502 10.1255L14.8934 6.63235C15.1005 6.39947 14.9969 5.9596 14.6604 5.90785Z'
                              fill=''
                            />
                          </svg>
                        </span>

                        <span className='cursor-pointer text-[#FBB040]'>
                          <svg
                            className='fill-current'
                            width='15'
                            height='16'
                            viewBox='0 0 15 16'
                            fill='none'
                            xmlns='http://www.w3.org/2000/svg'
                          >
                            <path
                              d='M14.6604 5.90785L9.97461 5.18335L7.85178 0.732874C7.69645 0.422375 7.28224 0.422375 7.12691 0.732874L5.00407 5.20923L0.344191 5.90785C0.0076444 5.9596 -0.121797 6.39947 0.137085 6.63235L3.52844 10.1255L2.72591 15.0158C2.67413 15.3522 3.01068 15.6368 3.32134 15.4298L7.54112 13.1269L11.735 15.4298C12.0198 15.5851 12.3822 15.3263 12.3046 15.0158L11.502 10.1255L14.8934 6.63235C15.1005 6.39947 14.9969 5.9596 14.6604 5.90785Z'
                              fill=''
                            />
                          </svg>
                        </span>

                        <span className='cursor-pointer text-[#FBB040]'>
                          <svg
                            className='fill-current'
                            width='15'
                            height='16'
                            viewBox='0 0 15 16'
                            fill='none'
                            xmlns='http://www.w3.org/2000/svg'
                          >
                            <path
                              d='M14.6604 5.90785L9.97461 5.18335L7.85178 0.732874C7.69645 0.422375 7.28224 0.422375 7.12691 0.732874L5.00407 5.20923L0.344191 5.90785C0.0076444 5.9596 -0.121797 6.39947 0.137085 6.63235L3.52844 10.1255L2.72591 15.0158C2.67413 15.3522 3.01068 15.6368 3.32134 15.4298L7.54112 13.1269L11.735 15.4298C12.0198 15.5851 12.3822 15.3263 12.3046 15.0158L11.502 10.1255L14.8934 6.63235C15.1005 6.39947 14.9969 5.9596 14.6604 5.90785Z'
                              fill=''
                            />
                          </svg>
                        </span>
                      </div>
                    </div>

                    <p className='text-dark mt-6'>
                      “Lorem ipsum dolor sit amet, adipiscing elit. Donec
                      malesuada justo vitaeaugue suscipit beautiful vehicula’’
                    </p>
                  </div>

                  {/* <!-- review item --> */}
                  <div className='rounded-xl bg-white shadow-1 p-4 sm:p-6'>
                    <div className='flex items-center justify-between'>
                      <a href='#' className='flex items-center gap-4'>
                        <div className='w-12.5 h-12.5 rounded-full overflow-hidden'>
                          <Image
                            src='/images/users/user-01.jpg'
                            alt='author'
                            className='w-12.5 h-12.5 rounded-full overflow-hidden'
                            width={50}
                            height={50}
                          />
                        </div>

                        <div>
                          <h3 className='font-medium text-dark'>
                            Davis Dorwart
                          </h3>
                          <p className='text-custom-sm'>Serial Entrepreneur</p>
                        </div>
                      </a>

                      <div className='flex items-center gap-1'>
                        <span className='cursor-pointer text-[#FBB040]'>
                          <svg
                            className='fill-current'
                            width='15'
                            height='16'
                            viewBox='0 0 15 16'
                            fill='none'
                            xmlns='http://www.w3.org/2000/svg'
                          >
                            <path
                              d='M14.6604 5.90785L9.97461 5.18335L7.85178 0.732874C7.69645 0.422375 7.28224 0.422375 7.12691 0.732874L5.00407 5.20923L0.344191 5.90785C0.0076444 5.9596 -0.121797 6.39947 0.137085 6.63235L3.52844 10.1255L2.72591 15.0158C2.67413 15.3522 3.01068 15.6368 3.32134 15.4298L7.54112 13.1269L11.735 15.4298C12.0198 15.5851 12.3822 15.3263 12.3046 15.0158L11.502 10.1255L14.8934 6.63235C15.1005 6.39947 14.9969 5.9596 14.6604 5.90785Z'
                              fill=''
                            />
                          </svg>
                        </span>

                        <span className='cursor-pointer text-[#FBB040]'>
                          <svg
                            className='fill-current'
                            width='15'
                            height='16'
                            viewBox='0 0 15 16'
                            fill='none'
                            xmlns='http://www.w3.org/2000/svg'
                          >
                            <path
                              d='M14.6604 5.90785L9.97461 5.18335L7.85178 0.732874C7.69645 0.422375 7.28224 0.422375 7.12691 0.732874L5.00407 5.20923L0.344191 5.90785C0.0076444 5.9596 -0.121797 6.39947 0.137085 6.63235L3.52844 10.1255L2.72591 15.0158C2.67413 15.3522 3.01068 15.6368 3.32134 15.4298L7.54112 13.1269L11.735 15.4298C12.0198 15.5851 12.3822 15.3263 12.3046 15.0158L11.502 10.1255L14.8934 6.63235C15.1005 6.39947 14.9969 5.9596 14.6604 5.90785Z'
                              fill=''
                            />
                          </svg>
                        </span>

                        <span className='cursor-pointer text-[#FBB040]'>
                          <svg
                            className='fill-current'
                            width='15'
                            height='16'
                            viewBox='0 0 15 16'
                            fill='none'
                            xmlns='http://www.w3.org/2000/svg'
                          >
                            <path
                              d='M14.6604 5.90785L9.97461 5.18335L7.85178 0.732874C7.69645 0.422375 7.28224 0.422375 7.12691 0.732874L5.00407 5.20923L0.344191 5.90785C0.0076444 5.9596 -0.121797 6.39947 0.137085 6.63235L3.52844 10.1255L2.72591 15.0158C2.67413 15.3522 3.01068 15.6368 3.32134 15.4298L7.54112 13.1269L11.735 15.4298C12.0198 15.5851 12.3822 15.3263 12.3046 15.0158L11.502 10.1255L14.8934 6.63235C15.1005 6.39947 14.9969 5.9596 14.6604 5.90785Z'
                              fill=''
                            />
                          </svg>
                        </span>

                        <span className='cursor-pointer text-[#FBB040]'>
                          <svg
                            className='fill-current'
                            width='15'
                            height='16'
                            viewBox='0 0 15 16'
                            fill='none'
                            xmlns='http://www.w3.org/2000/svg'
                          >
                            <path
                              d='M14.6604 5.90785L9.97461 5.18335L7.85178 0.732874C7.69645 0.422375 7.28224 0.422375 7.12691 0.732874L5.00407 5.20923L0.344191 5.90785C0.0076444 5.9596 -0.121797 6.39947 0.137085 6.63235L3.52844 10.1255L2.72591 15.0158C2.67413 15.3522 3.01068 15.6368 3.32134 15.4298L7.54112 13.1269L11.735 15.4298C12.0198 15.5851 12.3822 15.3263 12.3046 15.0158L11.502 10.1255L14.8934 6.63235C15.1005 6.39947 14.9969 5.9596 14.6604 5.90785Z'
                              fill=''
                            />
                          </svg>
                        </span>

                        <span className='cursor-pointer text-[#FBB040]'>
                          <svg
                            className='fill-current'
                            width='15'
                            height='16'
                            viewBox='0 0 15 16'
                            fill='none'
                            xmlns='http://www.w3.org/2000/svg'
                          >
                            <path
                              d='M14.6604 5.90785L9.97461 5.18335L7.85178 0.732874C7.69645 0.422375 7.28224 0.422375 7.12691 0.732874L5.00407 5.20923L0.344191 5.90785C0.0076444 5.9596 -0.121797 6.39947 0.137085 6.63235L3.52844 10.1255L2.72591 15.0158C2.67413 15.3522 3.01068 15.6368 3.32134 15.4298L7.54112 13.1269L11.735 15.4298C12.0198 15.5851 12.3822 15.3263 12.3046 15.0158L11.502 10.1255L14.8934 6.63235C15.1005 6.39947 14.9969 5.9596 14.6604 5.90785Z'
                              fill=''
                            />
                          </svg>
                        </span>
                      </div>
                    </div>

                    <p className='text-dark mt-6'>
                      “Lorem ipsum dolor sit amet, adipiscing elit. Donec
                      malesuada justo vitaeaugue suscipit beautiful vehicula’’
                    </p>
                  </div>
                </div>
              </div>

              <div className='max-w-[550px] w-full'>
                <form>
                  <h2 className='font-medium text-2xl text-dark mb-3.5'>
                    Add a Review
                  </h2>

                  <p className='mb-6'>
                    Your email address will not be published. Required fields
                    are marked *
                  </p>

                  <div className='flex items-center gap-3 mb-7.5'>
                    <span>Your Rating*</span>

                    <div className='flex items-center gap-1'>
                      <span className='cursor-pointer text-[#FBB040]'>
                        <svg
                          className='fill-current'
                          width='15'
                          height='16'
                          viewBox='0 0 15 16'
                          fill='none'
                          xmlns='http://www.w3.org/2000/svg'
                        >
                          <path
                            d='M14.6604 5.90785L9.97461 5.18335L7.85178 0.732874C7.69645 0.422375 7.28224 0.422375 7.12691 0.732874L5.00407 5.20923L0.344191 5.90785C0.0076444 5.9596 -0.121797 6.39947 0.137085 6.63235L3.52844 10.1255L2.72591 15.0158C2.67413 15.3522 3.01068 15.6368 3.32134 15.4298L7.54112 13.1269L11.735 15.4298C12.0198 15.5851 12.3822 15.3263 12.3046 15.0158L11.502 10.1255L14.8934 6.63235C15.1005 6.39947 14.9969 5.9596 14.6604 5.90785Z'
                            fill=''
                          />
                        </svg>
                      </span>

                      <span className='cursor-pointer text-[#FBB040]'>
                        <svg
                          className='fill-current'
                          width='15'
                          height='16'
                          viewBox='0 0 15 16'
                          fill='none'
                          xmlns='http://www.w3.org/2000/svg'
                        >
                          <path
                            d='M14.6604 5.90785L9.97461 5.18335L7.85178 0.732874C7.69645 0.422375 7.28224 0.422375 7.12691 0.732874L5.00407 5.20923L0.344191 5.90785C0.0076444 5.9596 -0.121797 6.39947 0.137085 6.63235L3.52844 10.1255L2.72591 15.0158C2.67413 15.3522 3.01068 15.6368 3.32134 15.4298L7.54112 13.1269L11.735 15.4298C12.0198 15.5851 12.3822 15.3263 12.3046 15.0158L11.502 10.1255L14.8934 6.63235C15.1005 6.39947 14.9969 5.9596 14.6604 5.90785Z'
                            fill=''
                          />
                        </svg>
                      </span>

                      <span className='cursor-pointer text-[#FBB040]'>
                        <svg
                          className='fill-current'
                          width='15'
                          height='16'
                          viewBox='0 0 15 16'
                          fill='none'
                          xmlns='http://www.w3.org/2000/svg'
                        >
                          <path
                            d='M14.6604 5.90785L9.97461 5.18335L7.85178 0.732874C7.69645 0.422375 7.28224 0.422375 7.12691 0.732874L5.00407 5.20923L0.344191 5.90785C0.0076444 5.9596 -0.121797 6.39947 0.137085 6.63235L3.52844 10.1255L2.72591 15.0158C2.67413 15.3522 3.01068 15.6368 3.32134 15.4298L7.54112 13.1269L11.735 15.4298C12.0198 15.5851 12.3822 15.3263 12.3046 15.0158L11.502 10.1255L14.8934 6.63235C15.1005 6.39947 14.9969 5.9596 14.6604 5.90785Z'
                            fill=''
                          />
                        </svg>
                      </span>

                      <span className='cursor-pointer text-gray-5'>
                        <svg
                          className='fill-current'
                          width='15'
                          height='16'
                          viewBox='0 0 15 16'
                          fill='none'
                          xmlns='http://www.w3.org/2000/svg'
                        >
                          <path
                            d='M14.6604 5.90785L9.97461 5.18335L7.85178 0.732874C7.69645 0.422375 7.28224 0.422375 7.12691 0.732874L5.00407 5.20923L0.344191 5.90785C0.0076444 5.9596 -0.121797 6.39947 0.137085 6.63235L3.52844 10.1255L2.72591 15.0158C2.67413 15.3522 3.01068 15.6368 3.32134 15.4298L7.54112 13.1269L11.735 15.4298C12.0198 15.5851 12.3822 15.3263 12.3046 15.0158L11.502 10.1255L14.8934 6.63235C15.1005 6.39947 14.9969 5.9596 14.6604 5.90785Z'
                            fill=''
                          />
                        </svg>
                      </span>

                      <span className='cursor-pointer text-gray-5'>
                        <svg
                          className='fill-current'
                          width='15'
                          height='16'
                          viewBox='0 0 15 16'
                          fill='none'
                          xmlns='http://www.w3.org/2000/svg'
                        >
                          <path
                            d='M14.6604 5.90785L9.97461 5.18335L7.85178 0.732874C7.69645 0.422375 7.28224 0.422375 7.12691 0.732874L5.00407 5.20923L0.344191 5.90785C0.0076444 5.9596 -0.121797 6.39947 0.137085 6.63235L3.52844 10.1255L2.72591 15.0158C2.67413 15.3522 3.01068 15.6368 3.32134 15.4298L7.54112 13.1269L11.735 15.4298C12.0198 15.5851 12.3822 15.3263 12.3046 15.0158L11.502 10.1255L14.8934 6.63235C15.1005 6.39947 14.9969 5.9596 14.6604 5.90785Z'
                            fill=''
                          />
                        </svg>
                      </span>
                    </div>
                  </div>

                  <div className='rounded-xl bg-white shadow-1 p-4 sm:p-6'>
                    <div className='mb-5'>
                      <label htmlFor='comments' className='block mb-2.5'>
                        Comments
                      </label>

                      <textarea
                        name='comments'
                        id='comments'
                        rows={5}
                        placeholder='Your comments'
                        className='rounded-md border border-gray-3 bg-gray-1 placeholder:text-dark-5 w-full p-5 outline-none duration-200 focus:border-transparent focus:shadow-input focus:ring-2 focus:ring-blue/20'
                      ></textarea>

                      <span className='flex items-center justify-between mt-2.5'>
                        <span className='text-custom-sm text-dark-4'>
                          Maximum
                        </span>
                        <span className='text-custom-sm text-dark-4'>
                          0/250
                        </span>
                      </span>
                    </div>

                    <div className='flex flex-col lg:flex-row gap-5 sm:gap-7.5 mb-5.5'>
                      <div>
                        <label htmlFor='name' className='block mb-2.5'>
                          Name
                        </label>

                        <input
                          type='text'
                          name='name'
                          id='name'
                          placeholder='Your name'
                          className='rounded-md border border-gray-3 bg-gray-1 placeholder:text-dark-5 w-full py-2.5 px-5 outline-none duration-200 focus:border-transparent focus:shadow-input focus:ring-2 focus:ring-blue/20'
                        />
                      </div>

                      <div>
                        <label htmlFor='email' className='block mb-2.5'>
                          Email
                        </label>

                        <input
                          type='email'
                          name='email'
                          id='email'
                          placeholder='Your email'
                          className='rounded-md border border-gray-3 bg-gray-1 placeholder:text-dark-5 w-full py-2.5 px-5 outline-none duration-200 focus:border-transparent focus:shadow-input focus:ring-2 focus:ring-blue/20'
                        />
                      </div>
                    </div>

                    <button
                      type='submit'
                      className='inline-flex font-medium text-white bg-blue py-3 px-7 rounded-md ease-out duration-200 hover:bg-blue-dark'
                    >
                      Submit Reviews
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
          {/* <!-- tab content three end --> */}
          {/* <!--== tab content end ==--> */}
        </div>
      </section>

      {/* <RecentlyViewdItems /> */}

      {!user && <Newsletter />}
    </>
  );
}
