// src/components/MobileSideMenu.jsx
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';

const MobileSideMenu = ({ navigationOpen, setNavigationOpen }) => {
  const toggleNavigation = () => {
    setNavigationOpen(!navigationOpen);
  };

  return (
    <>
      {/* Overlay */}
      {navigationOpen && (
        <div
          className='fixed inset-0 bg-white bg-opacity-50 z-30 md:hidden w-full'
          onClick={toggleNavigation}
        ></div>
      )}

      {/* Side Menu — AHORA DESDE LA DERECHA */}
      <div
        className={`fixed shadow-md inset-y-0 right-0 z-40 w-64 bg-white transform transition-transform duration-300 ease-in-out rounded-l-lg ${
          navigationOpen ? 'translate-x-0' : 'translate-x-full'
        } md:hidden`}
      >
        <div className='flex items-center justify-between p-4 border-b border-gray-200'>
          <div className='flex items-center'>
            <Link className='flex-shrink-0 flex justify-center' href='/'>
              <Image
                src='/images/logo/logo.svg'
                alt='Logo'
                className={`h-[90px]`}
                width={219}
                height={36}
              />
            </Link>
          </div>
          <button
            onClick={toggleNavigation}
            className='p-2 text-gray-600 hover:text-gray-800'
            aria-label='Close menu'
          >
            <svg
              className='w-6 h-6'
              fill='none'
              stroke='currentColor'
              viewBox='0 0 24 24'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={2}
                d='M6 18L18 6M6 6l12 12'
              />
            </svg>
          </button>
        </div>

        <nav className='p-4'>
          <ul className='space-y-4'>
            <li>
              <a
                href='/cart'
                className='block py-2 text-gray-700 hover:text-blue-600 transition'
              >
                Carrito
              </a>
            </li>
            <li>
              <a
                href='#'
                className='block py-2 text-gray-700 hover:text-blue-600 transition'
              >
                Contacto
              </a>
            </li>
          </ul>
        </nav>

        <div className='border-t border-gray-200 p-4 mt-auto'>
          <button className='w-full flex items-center py-2 text-gray-700 hover:text-blue-600 transition'>
            <svg
              className='w-5 h-5 mr-2'
              fill='none'
              stroke='currentColor'
              viewBox='0 0 24 24'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={2}
                d='M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z'
              />
            </svg>
            Iniciar Sesión / Crear Cuenta
          </button>
          <button className='w-full flex items-center py-2 text-gray-700 hover:text-blue-600 transition mt-2'>
            <svg
              className='w-5 h-5 mr-2'
              fill='none'
              stroke='currentColor'
              viewBox='0 0 24 24'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={2}
                d='M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z'
              />
            </svg>
            Favoritos
          </button>
        </div>
      </div>
    </>
  );
};

export default MobileSideMenu;
