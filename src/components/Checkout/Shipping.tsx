'use client';

import {
  setShippingAddress,
  ShippingAddress,
} from '@/redux/features/shipping-slice';
import { RootState } from '@/redux/store';
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

const Shipping = () => {
  const dispatch = useDispatch();
  const shippingState = useSelector(
    (state: RootState) => state.shippingReducer,
  );
  const [dropdown, setDropdown] = useState(false);

  // Local state for controlled inputs (optional, but helps avoid re-renders)
  const [formData, setFormData] = useState<ShippingAddress>({
    country: shippingState.country || '',
    addressLine1: shippingState.addressLine1 || '',
    addressLine2: shippingState.addressLine2 || '',
    city: shippingState.city || '',
    state: shippingState.state || '',
  });

  // Sync form state with Redux on mount or when Redux updates
  React.useEffect(() => {
    setFormData({
      country: shippingState.country || '',
      addressLine1: shippingState.addressLine1 || '',
      addressLine2: shippingState.addressLine2 || '',
      city: shippingState.city || '',
      state: shippingState.state || '',
    });
  }, [shippingState]);

  // Handle input change + dispatch to Redux
  const updateFormField = (field: keyof ShippingAddress, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
    dispatch(setShippingAddress({ [field]: value }));
  };

  return (
    <div className='bg-white shadow-1 rounded-[10px] mt-7.5'>
      <div
        onClick={() => setDropdown(!dropdown)}
        className='cursor-pointer flex items-center gap-2.5 font-medium text-lg text-dark py-5 px-5.5'
      >
        ¿Enviar a una dirección diferente?
        <svg
          className={`fill-current ease-out duration-200 ${
            dropdown && 'rotate-180'
          }`}
          width='22'
          height='22'
          viewBox='0 0 22 22'
          fill='none'
          xmlns='http://www.w3.org/2000/svg'
        >
          <path
            fillRule='evenodd'
            clipRule='evenodd'
            d='M4.06103 7.80259C4.30813 7.51431 4.74215 7.48092 5.03044 7.72802L10.9997 12.8445L16.9689 7.72802C17.2572 7.48092 17.6912 7.51431 17.9383 7.80259C18.1854 8.09088 18.1521 8.5249 17.8638 8.772L11.4471 14.272C11.1896 14.4927 10.8097 14.4927 10.5523 14.272L4.1356 8.772C3.84731 8.5249 3.81393 8.09088 4.06103 7.80259Z'
            fill=''
          />
        </svg>
      </div>

      {/* <!-- menú desplegable --> */}
      <div className={`p-4 sm:p-8.5 ${dropdown ? 'block' : 'hidden'}`}>
        {/* País / Región */}
        <div className='mb-5'>
          <label htmlFor='countryName' className='block mb-2.5'>
            País / Región
            <span className='text-red'>*</span>
          </label>

          <div className='relative'>
            <select
              value={formData.country}
              onChange={(e) => updateFormField('country', e.target.value)}
              className='w-full bg-gray-1 rounded-md border border-gray-3 text-dark-4 py-3 pl-5 pr-9 duration-200 appearance-none outline-none focus:border-transparent focus:shadow-input focus:ring-2 focus:ring-blue/20'
            >
              <option value=''>Selecciona un país</option>
              <option value='Argentina'>Argentina</option>
              <option value='México'>México</option>
              <option value='Colombia'>Colombia</option>
              <option value='Chile'>Chile</option>
            </select>

            <span className='absolute right-4 top-1/2 -translate-y-1/2 text-dark-4'>
              <svg
                className='fill-current'
                width='16'
                height='16'
                viewBox='0 0 16 16'
                fill='none'
                xmlns='http://www.w3.org/2000/svg'
              >
                <path
                  d='M2.41469 5.03569L2.41467 5.03571L2.41749 5.03846L7.76749 10.2635L8.0015 10.492L8.23442 10.2623L13.5844 4.98735L13.5844 4.98735L13.5861 4.98569C13.6809 4.89086 13.8199 4.89087 13.9147 4.98569C14.0092 5.08024 14.0095 5.21864 13.9155 5.31345C13.9152 5.31373 13.915 5.31401 13.9147 5.31429L8.16676 10.9622L8.16676 10.9622L8.16469 10.9643C8.06838 11.0606 8.02352 11.0667 8.00039 11.0667C7.94147 11.0667 7.89042 11.0522 7.82064 10.9991L2.08526 5.36345C1.99127 5.26865 1.99154 5.13024 2.08609 5.03569C2.18092 4.94086 2.31986 4.94086 2.41469 5.03569Z'
                  fill=''
                  stroke=''
                  strokeWidth='0.666667'
                />
              </svg>
            </span>
          </div>
        </div>

        {/* Dirección completa (addressLine1) */}
        <div className='mb-5'>
          <label htmlFor='addressLine1' className='block mb-2.5'>
            Dirección completa
            <span className='text-red'>*</span>
          </label>

          <input
            type='text'
            id='addressLine1'
            name='addressLine1'
            value={formData.addressLine1}
            onChange={(e) => updateFormField('addressLine1', e.target.value)}
            placeholder='Número de casa y nombre de la calle'
            className='rounded-md border border-gray-3 bg-gray-1 placeholder:text-dark-5 w-full py-2.5 px-5 outline-none duration-200 focus:border-transparent focus:shadow-input focus:ring-2 focus:ring-blue/20'
          />

          {/* Apartamento, suite... (addressLine2) */}
          <div className='mt-5'>
            <input
              type='text'
              id='addressLine2'
              name='addressLine2'
              value={formData.addressLine2}
              onChange={(e) => updateFormField('addressLine2', e.target.value)}
              placeholder='Apartamento, suite, unidad, etc. (opcional)'
              className='rounded-md border border-gray-3 bg-gray-1 placeholder:text-dark-5 w-full py-2.5 px-5 outline-none duration-200 focus:border-transparent focus:shadow-input focus:ring-2 focus:ring-blue/20'
            />
          </div>
        </div>

        {/* Provincia (state) */}
        <div className='mb-5'>
          <label htmlFor='state' className='block mb-2.5'>
            Provincia
          </label>

          <input
            type='text'
            id='state'
            name='state'
            value={formData.state}
            onChange={(e) => updateFormField('state', e.target.value)}
            className='rounded-md border border-gray-3 bg-gray-1 placeholder:text-dark-5 w-full py-2.5 px-5 outline-none duration-200 focus:border-transparent focus:shadow-input focus:ring-2 focus:ring-blue/20'
          />
        </div>

        {/* Ciudad (city) */}
        <div className='mb-5'>
          <label htmlFor='city' className='block mb-2.5'>
            Ciudad
            <span className='text-red'>*</span>
          </label>

          <input
            type='text'
            id='city'
            name='city'
            value={formData.city}
            onChange={(e) => updateFormField('city', e.target.value)}
            className='rounded-md border border-gray-3 bg-gray-1 placeholder:text-dark-5 w-full py-2.5 px-5 outline-none duration-200 focus:border-transparent focus:shadow-input focus:ring-2 focus:ring-blue/20'
          />
        </div>

        {/* Teléfono (phone) — Optional: Add if needed */}
        {/* Uncomment if you want to collect phone in shipping too */}
        {/* 
        <div className='mb-5'>
          <label htmlFor='phone' className='block mb-2.5'>
            Teléfono
            <span className='text-red'>*</span>
          </label>

          <input
            type='text'
            id='phone'
            name='phone'
            value={formData.phone}
            onChange={(e) => updateFormField('phone', e.target.value)}
            className='rounded-md border border-gray-3 bg-gray-1 placeholder:text-dark-5 w-full py-2.5 px-5 outline-none duration-200 focus:border-transparent focus:shadow-input focus:ring-2 focus:ring-blue/20'
          />
        </div>
        */}

        {/* Correo electrónico (email) — Optional */}
        {/* 
        <div>
          <label htmlFor='email' className='block mb-2.5'>
            Correo electrónico
            <span className='text-red'>*</span>
          </label>

          <input
            type='email'
            id='email'
            name='email'
            value={formData.email}
            onChange={(e) => updateFormField('email', e.target.value)}
            className='rounded-md border border-gray-3 bg-gray-1 placeholder:text-dark-5 w-full py-2.5 px-5 outline-none duration-200 focus:border-transparent focus:shadow-input focus:ring-2 focus:ring-blue/20'
          />
        </div>
        */}
      </div>
    </div>
  );
};

export default Shipping;
