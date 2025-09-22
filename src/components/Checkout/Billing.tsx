'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { useAuth } from '@/context/AuthContext';
import { User } from 'firebase/auth';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import {
  BillingAddress,
  setBillingAddress,
} from '@/redux/features/billing-slice';
import Select, { SingleValue } from 'react-select';
import { PROVINCIAS_ARGENTINAS } from '@/lib/data';

export interface Localidad {
  idDeProvLocalidad: string;
  localidad: string;
  partido: string;
  provincia: string;
  codigosPostales: string[];
}

// Estilos personalizados para react-selec
export const customSelectStyles = {
  control: (provided: any) => ({
    ...provided,
    backgroundColor: '#f8fafc',
    borderColor: '#cbd5e1',
    borderRadius: '0.375rem',
    padding: '0.25rem',
    '&:hover': {
      borderColor: '#94a3b8',
    },
  }),
  menu: (provided: any) => ({
    ...provided,
    zIndex: 50,
  }),
};

const Billing = () => {
  const { user, loading } = useAuth();
  const dispatch = useDispatch();
  const billingState = useSelector((state: RootState) => state.billingReducer);
  const [localidades, setLocalidades] = useState<Localidad[]>([]);

  // Estado para los selects
  const [selectedProvincia, setSelectedProvincia] = useState<SingleValue<{
    value: string;
    label: string;
  }> | null>(null);
  const [selectedLocalidad, setSelectedLocalidad] = useState<SingleValue<{
    value: string;
    label: string;
  }> | null>(null);
  const [localidadSearch, setLocalidadSearch] = useState('');

  const isLoggedIn = !!user;

  // Initialize form state from Redux (or defaults)
  const [formData, setFormData] = useState({
    firstName: billingState.firstName || user?.billing?.firstName,
    lastName: billingState.lastName || user?.billing?.lastName,
    email: billingState.email || user?.billing?.email,
    phone: billingState.phone || user?.billing?.phone,
    address: billingState.address || user?.billing?.address,
    addressTwo: billingState.addressTwo || user?.billing?.addressTwo,
    city: billingState.city || user?.billing?.city,
    state: billingState.state || user?.billing?.state,
    country: billingState.country || user?.billing?.country || 'Argentina',
  });

  // Sync form with Redux on mount
  useEffect(() => {
    setFormData({
      firstName: billingState.firstName || user?.billing?.firstName,
      lastName: billingState.lastName || user?.billing?.lastName,
      email: billingState.email || user?.billing?.email,
      phone: billingState.phone || user?.billing?.phone,
      address: billingState.address || user?.billing?.address,
      addressTwo: billingState.addressTwo || user?.billing?.addressTwo,
      city: billingState.city || user?.billing?.city,
      state: billingState.state || user?.billing?.state,
      country: billingState.country || user?.billing?.country || 'Argentina',
    });

    // Si ya había provincia guardada, setearla
    if (billingState.state) {
      const matchedProvincia = PROVINCIAS_ARGENTINAS.find(
        (p) => p.value === billingState.state.toUpperCase(),
      );
      if (matchedProvincia) {
        setSelectedProvincia(matchedProvincia);
      }
    }

    // Si ya había ciudad guardada, intentar setearla (solo si provincia ya está)
    if (billingState.city && selectedProvincia) {
      const matchedLocalidad = localidades
        .filter(
          (loc) => loc.provincia.toUpperCase() === selectedProvincia.value,
        )
        .find(
          (loc) =>
            loc.localidad.trim().toUpperCase() ===
            billingState.city.toUpperCase(),
        );
      if (matchedLocalidad) {
        setSelectedLocalidad({
          value: matchedLocalidad.idDeProvLocalidad,
          label: `${matchedLocalidad.localidad.trim()} (${matchedLocalidad.codigosPostales.join(
            ', ',
          )})`,
        });
      }
    }
  }, [billingState, isLoggedIn, user, localidades, selectedProvincia]);

  useEffect(() => {
    fetch('/data/localidades.json')
      .then((res) => res.json())
      .then((data: Localidad[]) => {
        setLocalidades(data);
      })
      .catch((err) => {
        console.error('Error al cargar localidades:', err);
      });
  }, []);

  // Filtrar localidades según provincia seleccionada
  const filteredLocalidades = useMemo(() => {
    if (!selectedProvincia) return [];
    return localidades
      .filter((loc) => loc.provincia.toUpperCase() === selectedProvincia.value)
      .map((loc) => ({
        value: loc.idDeProvLocalidad,
        label: `${loc.localidad.trim()} (${loc.codigosPostales.join(', ')})`,
        raw: loc.localidad.trim(),
      }));
  }, [localidades, selectedProvincia]);

  // Filtrar por búsqueda
  const searchedLocalidades = useMemo(() => {
    if (!localidadSearch) return filteredLocalidades;
    return filteredLocalidades.filter((loc) =>
      loc.raw.toLowerCase().includes(localidadSearch.toLowerCase()),
    );
  }, [filteredLocalidades, localidadSearch]);

  // Manejar cambio de provincia
  const handleProvinciaChange = (
    option: SingleValue<{ value: string; label: string }>,
  ) => {
    setSelectedProvincia(option);
    setSelectedLocalidad(null);
    setLocalidadSearch('');
    updateFormData('state', option?.value || '');
    updateFormData('city', ''); // Limpiar ciudad al cambiar provincia
  };

  // Manejar cambio de localidad
  const handleLocalidadChange = (
    option: SingleValue<{ value: string; label: string }>,
  ) => {
    setSelectedLocalidad(option);
    const selectedLoc = localidades.find(
      (loc) => loc.idDeProvLocalidad === option?.value,
    );
    updateFormData('city', selectedLoc?.localidad.trim() || '');
  };

  // If auth state is still loading, show loader
  if (loading) {
    return <div className='p-8 text-center'>Cargando...</div>;
  }

  // Update form field and dispatch to Redux
  const updateFormData = (field: keyof typeof formData, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));

    dispatch(setBillingAddress({ [field]: value }));
  };

  return (
    <div className='mt-9'>
      <h2 className='font-medium text-dark text-xl sm:text-2xl mb-5.5'>
        Datos de facturación
      </h2>

      <div className='bg-white shadow-1 rounded-[10px] p-4 sm:p-8.5'>
        {/* Campos de nombre y apellido */}
        <div className='flex flex-col lg:flex-row gap-5 sm:gap-8 mb-5'>
          <div className='w-full'>
            <label htmlFor='firstName' className='block mb-2.5'>
              Nombre <span className='text-red'>*</span>
            </label>
            <input
              type='text'
              name='firstName'
              id='firstName'
              value={formData.firstName}
              onChange={(e) => updateFormData('firstName', e.target.value)}
              placeholder='Juan'
              className='rounded-md border border-gray-3 bg-gray-1 placeholder:text-dark-5 w-full py-2.5 px-5 outline-none duration-200 focus:border-transparent focus:shadow-input focus:ring-2 focus:ring-blue/20'
              required
            />
          </div>

          <div className='w-full'>
            <label htmlFor='lastName' className='block mb-2.5'>
              Apellido <span className='text-red'>*</span>
            </label>
            <input
              type='text'
              name='lastName'
              id='lastName'
              value={formData.lastName}
              onChange={(e) => updateFormData('lastName', e.target.value)}
              placeholder='Pérez'
              className='rounded-md border border-gray-3 bg-gray-1 placeholder:text-dark-5 w-full py-2.5 px-5 outline-none duration-200 focus:border-transparent focus:shadow-input focus:ring-2 focus:ring-blue/20'
              required
            />
          </div>
        </div>

        {/* País */}
        <div className='mb-5'>
          <label htmlFor='countryName' className='block mb-2.5'>
            País / Región
            <span className='text-red'>*</span>
          </label>
          <div className='relative'>
            <select
              value={'Argentina'}
              onChange={(e) => updateFormData('country', e.target.value)}
              className='w-full bg-gray-1 rounded-md border border-gray-3 text-dark-4 py-3 pl-5 pr-9 duration-200 appearance-none outline-none focus:border-transparent focus:shadow-input focus:ring-2 focus:ring-blue/20'
              disabled={true}
            >
              <option value='Argentina'>Argentina</option>
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

        {/* Dirección */}
        <div className='mb-5'>
          <label htmlFor='address' className='block mb-2.5'>
            Dirección
            <span className='text-red'>*</span>
          </label>
          <input
            type='text'
            name='address'
            id='address'
            value={formData.address}
            onChange={(e) => updateFormData('address', e.target.value)}
            placeholder='Número de casa y nombre de la calle'
            className='rounded-md border border-gray-3 bg-gray-1 placeholder:text-dark-5 w-full py-2.5 px-5 outline-none duration-200 focus:border-transparent focus:shadow-input focus:ring-2 focus:ring-blue/20'
            required
          />
          <div className='mt-5'>
            <input
              type='text'
              name='addressTwo'
              id='addressTwo'
              value={formData.addressTwo}
              onChange={(e) => updateFormData('addressTwo', e.target.value)}
              placeholder='Apartamento, suite, unidad, etc. (opcional)'
              className='rounded-md border border-gray-3 bg-gray-1 placeholder:text-dark-5 w-full py-2.5 px-5 outline-none duration-200 focus:border-transparent focus:shadow-input focus:ring-2 focus:ring-blue/20'
            />
          </div>
        </div>

        {/* Dropdown de Provincia */}
        <div className='mb-5'>
          <label htmlFor='state' className='block mb-2.5'>
            Provincia <span className='text-red'>*</span>
          </label>
          <Select
            id='state'
            options={PROVINCIAS_ARGENTINAS}
            value={selectedProvincia}
            onChange={handleProvinciaChange}
            placeholder='Selecciona una provincia...'
            isClearable
            styles={customSelectStyles}
            noOptionsMessage={() => 'No se encontraron provincias'}
          />
        </div>

        {/* Dropdown de Localidad */}
        <div className='mb-5'>
          <label htmlFor='city' className='block mb-2.5'>
            Localidad <span className='text-red'>*</span>
          </label>
          <Select
            id='city'
            options={searchedLocalidades}
            value={selectedLocalidad}
            onChange={handleLocalidadChange}
            onInputChange={(value) => setLocalidadSearch(value)}
            inputValue={localidadSearch}
            placeholder={
              !selectedProvincia
                ? 'Selecciona primero una provincia'
                : 'Escribe para buscar localidad...'
            }
            isDisabled={!selectedProvincia}
            isClearable
            styles={customSelectStyles}
            noOptionsMessage={() => 'No se encontraron localidades'}
          />
        </div>

        {/* Teléfono */}
        <div className='mb-5'>
          <label htmlFor='phone' className='block mb-2.5'>
            Teléfono <span className='text-red'>*</span>
          </label>
          <input
            type='text'
            name='phone'
            id='phone'
            value={formData.phone}
            onChange={(e) => updateFormData('phone', e.target.value)}
            placeholder='+54 9 11 1234-5678'
            className='rounded-md border border-gray-3 bg-gray-1 placeholder:text-dark-5 w-full py-2.5 px-5 outline-none duration-200 focus:border-transparent focus:shadow-input focus:ring-2 focus:ring-blue/20'
            required
          />
        </div>

        {/* Email */}
        <div className='mb-5.5'>
          <label htmlFor='email' className='block mb-2.5'>
            Correo electrónico <span className='text-red'>*</span>
          </label>
          <input
            type='email'
            name='email'
            id='email'
            value={formData.email}
            onChange={(e) => updateFormData('email', e.target.value)}
            placeholder='ejemplo@dominio.com'
            className='rounded-md border border-gray-3 bg-gray-1 placeholder:text-dark-5 w-full py-2.5 px-5 outline-none duration-200 focus:border-transparent focus:shadow-input focus:ring-2 focus:ring-blue/20'
            required
          />
        </div>

        {/* Nota informativa si ya está logueado */}
        {isLoggedIn && (
          <div className='mt-4 p-3 bg-blue-50 text-blue-800 text-sm rounded border border-blue-200'>
            📌 Estás logueado. Los datos de facturación se guardarán bajo tu
            cuenta.
          </div>
        )}
      </div>
    </div>
  );
};

export default Billing;
