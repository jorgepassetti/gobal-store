'use client';

import {
  setShippingAddress,
  ShippingAddress,
} from '@/redux/features/shipping-slice';
import { RootState } from '@/redux/store';
import React, { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Select, { SingleValue } from 'react-select';
import { PROVINCIAS_ARGENTINAS } from '@/lib/data';
import { customSelectStyles, Localidad } from './Billing';
import { useAuth } from '@/context/AuthContext';

const Shipping = () => {
  const { user } = useAuth();
  const dispatch = useDispatch();
  const [localidades, setLocalidades] = useState<Localidad[]>([]);
  const shippingState = useSelector(
    (state: RootState) => state.shippingReducer,
  );
  const [dropdown, setDropdown] = useState(false);
  const [selectedProvincia, setSelectedProvincia] = useState<SingleValue<{
    value: string;
    label: string;
  }> | null>(null);
  const [selectedLocalidad, setSelectedLocalidad] = useState<SingleValue<{
    value: string;
    label: string;
  }> | null>(null);
  const [localidadSearch, setLocalidadSearch] = useState('');

  // Local state for controlled inputs (optional, but helps avoid re-renders)
  const [formData, setFormData] = useState<ShippingAddress>({
    country: shippingState.country || user?.shipping?.country || '',
    addressLine1:
      shippingState.addressLine1 || user?.shipping?.addressLine1 || '',
    addressLine2:
      shippingState.addressLine2 || user?.shipping?.addressLine2 || '',
    city: shippingState.city || user?.shipping?.city || '',
    state: shippingState.state || user?.shipping?.state || '',
    zipcode: shippingState.zipcode || user?.shipping?.zipcode || '',
    phone: shippingState.phone || user?.shipping?.phone || '',
  });

  // Sync form state with Redux on mount or when Redux updates
  React.useEffect(() => {
    setFormData({
      country: shippingState.country || user?.shipping?.country || '',
      addressLine1:
        shippingState.addressLine1 || user?.shipping?.addressLine1 || '',
      addressLine2:
        shippingState.addressLine2 || user?.shipping?.addressLine2 || '',
      city: shippingState.city || user?.shipping?.city || '',
      state: shippingState.state || user?.shipping?.state || '',
      zipcode: shippingState.zipcode || user?.shipping?.zipcode || '',
      phone: shippingState.phone || user?.shipping?.phone || '',
    });

    if (shippingState.state) {
      const matchedProvincia = PROVINCIAS_ARGENTINAS.find(
        (p) => p.value === shippingState.state.toUpperCase(),
      );
      if (matchedProvincia) {
        setSelectedProvincia(matchedProvincia);
      }
    }
    console.log(
      'shippingState.city, user?.shipping?.city, selectedProvincia',
      shippingState.city,
      user?.shipping?.city,
      selectedProvincia,
    );

    if (shippingState.state || user?.shipping?.state) {
      const matchedProvincia = PROVINCIAS_ARGENTINAS.find(
        (p) =>
          p.value ===
          (shippingState.state || user?.shipping?.state).toUpperCase(),
      );
      if (matchedProvincia) {
        setSelectedProvincia(matchedProvincia);
      }
    }

    // Si ya había ciudad guardada, intentar setearla (solo si provincia ya está)
    if ((shippingState.city || user?.shipping?.city) && selectedProvincia) {
      const matchedLocalidad = localidades
        .filter(
          (loc) => loc.provincia.toUpperCase() === selectedProvincia.value,
        )
        .find(
          (loc) =>
            loc.localidad.trim().toUpperCase() ===
            (shippingState.city || user?.shipping?.city).toUpperCase(),
        );
      console.log('matchedLocalidad', matchedLocalidad);

      if (matchedLocalidad) {
        setSelectedLocalidad({
          value: matchedLocalidad.idDeProvLocalidad,
          label: matchedLocalidad.localidad.trim(),
        });
      }
    }
  }, [shippingState, user?.shipping]);

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
        label: loc.localidad,
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
    updateFormField('state', option?.value || '');
    updateFormField('city', ''); // Limpiar ciudad al cambiar provincia
  };

  // Manejar cambio de localidad
  const handleLocalidadChange = (
    option: SingleValue<{ value: string; label: string }>,
  ) => {
    setSelectedLocalidad(option);
    const selectedLoc = localidades.find(
      (loc) => loc.idDeProvLocalidad === option?.value,
    );
    updateFormField('city', selectedLoc?.localidad.trim() || '');
    updateFormField(
      'zipcode',
      selectedLoc?.codigosPostales.join().trim() || '',
    );
  };

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
      <div className='border-b border-gray-3 py-5 px-4 sm:px-8.5'>
        <h3 className='font-medium text-xl text-dark'>
          Enviar a esta dirección
        </h3>
      </div>

      {/* <!-- menú desplegable --> */}
      <div className={`p-4 sm:p-8.5`}>
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

        {/* Dropdown de Provincia */}
        <div className='mb-5'>
          <label htmlFor='state' className='block mb-2.5'>
            Provincia <span className='text-red'>*</span>
          </label>
          <Select
            id='state'
            required
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
            required
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

        <div className='mb-5'>
          <label htmlFor='phone' className='block mb-2.5'>
            Código Postal
          </label>

          <input
            type='text'
            disabled
            id='zipcode'
            name='zipcode'
            value={formData.zipcode}
            onChange={(e) => updateFormField('zipcode', e.target.value)}
            className='rounded-md border border-gray-3 bg-gray-1 placeholder:text-dark-5 w-full py-2.5 px-5 outline-none duration-200 focus:border-transparent focus:shadow-input focus:ring-2 focus:ring-blue/20'
          />
        </div>

        {/* Teléfono (phone) — Optional: Add if needed */}
        {/* Uncomment if you want to collect phone in shipping too */}

        <div className='mb-5'>
          <label htmlFor='phone' className='block mb-2.5'>
            Teléfono
            <span className='text-red'>*</span>
          </label>

          <input
            type='text'
            id='phone'
            name='phone'
            required
            value={formData.phone}
            onChange={(e) => updateFormField('phone', e.target.value)}
            className='rounded-md border border-gray-3 bg-gray-1 placeholder:text-dark-5 w-full py-2.5 px-5 outline-none duration-200 focus:border-transparent focus:shadow-input focus:ring-2 focus:ring-blue/20'
          />
        </div>
      </div>
    </div>
  );
};

export default Shipping;
