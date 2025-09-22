'use client';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination } from 'swiper/modules';

// Import Swiper styles
import 'swiper/css/pagination';
import 'swiper/css';

import Image from 'next/image';
import { Product } from '@/types/product';

const HeroCarousal = ({ product }: { product: Product }) => {
  return (
    <Swiper
      spaceBetween={30}
      centeredSlides={true}
      autoplay={{
        delay: 2500,
        disableOnInteraction: false,
      }}
      pagination={{
        clickable: true,
      }}
      modules={[Autoplay, Pagination]}
      className='hero-carousel'
    >
      <SwiperSlide>
        <div className='flex items-center pt-6 sm:pt-0 flex-col-reverse sm:flex-row'>
          <div className='max-w-[394px] py-10 sm:py-15 lg:py-24.5 pl-4 sm:pl-7.5 lg:pl-12.5'>
            <div className='flex items-center gap-4 mb-7.5 sm:mb-10'>
              <span className='block font-semibold text-heading-3 sm:text-heading-1 text-blue'>
                30%
              </span>
              <span className='block text-dark text-sm sm:text-custom-1 sm:leading-[24px]'>
                <br />
                Off
              </span>
            </div>

            <h1 className='font-semibold text-dark text-xl sm:text-3xl mb-3'>
              <a href='#'>{product.title}</a>
            </h1>

            {/* <p>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi at
              ipsum at risus euismod lobortis in
            </p> */}

            <a
              href={`/products/${product.id}`}
              className='inline-flex font-medium text-white text-custom-sm rounded-md bg-dark py-3 px-9 ease-out duration-200 hover:bg-blue mt-10'
            >
              Comprar Ahora
            </a>
          </div>

          <div>
            <Image
              src={product.media[0].url}
              alt='headphone'
              className='rounded'
              width={351}
              height={358}
            />
          </div>
        </div>
      </SwiperSlide>
      <SwiperSlide>
        {' '}
        <div className='flex items-center pt-6 sm:pt-0 flex-col-reverse sm:flex-row'>
          <div className='max-w-[394px] py-10 sm:py-15 lg:py-26 pl-4 sm:pl-7.5 lg:pl-12.5'>
            <div className='flex items-center gap-4 mb-7.5 sm:mb-10'>
              <span className='block font-semibold text-heading-3 sm:text-heading-1 text-blue'>
                30%
              </span>
              <span className='block text-dark text-sm sm:text-custom-1 sm:leading-[24px]'>
                <br />
                Off
              </span>
            </div>

            <h1 className='font-semibold text-dark text-xl sm:text-3xl mb-3'>
              <a href='#'>{product.title}</a>
            </h1>

            {/* <p>
              Lorem ipsum dolor sit, consectetur elit nunc suscipit non ipsum
              nec suscipit.
            </p> */}

            <a
              href={`/products/${product.id}`}
              className='inline-flex font-medium text-white text-custom-sm rounded-md bg-dark py-3 px-9 ease-out duration-200 hover:bg-blue mt-10'
            >
              Comprar Ahora
            </a>
          </div>

          <div>
            <Image
              src={product.media[1].url}
              alt='headphone'
              className='rounded'
              width={351}
              height={358}
            />
          </div>
        </div>
      </SwiperSlide>
    </Swiper>
  );
};

export default HeroCarousal;
