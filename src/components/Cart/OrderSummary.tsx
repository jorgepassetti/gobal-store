'use client';

import { CartItem, selectTotalPrice } from '@/redux/features/cart-slice';
import { useAppSelector } from '@/redux/store';
import React, { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { collection, doc, setDoc, updateDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { v4 as uuidv4 } from 'uuid';
import { BillingAddress } from '@/redux/features/billing-slice';
import { ShippingAddress } from '@/redux/features/shipping-slice';

export type Order = {
  id: string;
  userId: string;
  preferenceId: string;
  billing: BillingAddress;
  shipping: ShippingAddress;
  items: CartItem[];
  total: number;
  createdAt: string;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  notes: string;
};

const OrderSummary = ({ notes }) => {
  const { user } = useAuth();
  const cartItems = useAppSelector((state) => state.cartReducer.items);
  const totalPrice = useAppSelector(selectTotalPrice);

  // 👇 Supón que tienes la dirección guardada en Redux (ej: shippingSlice)
  const shipping = useAppSelector((state) => state.shippingReducer); // ¡Ajusta según tu estructura!
  const billing = useAppSelector((state) => state.billingReducer);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Crear la preferencia de pago en tu backend (esta función se llama cuando se hace clic)
  const createPreference = async () => {
    if (cartItems.length === 0) {
      setError('Tu carrito está vacío.');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const response = await fetch('/api/create-preference', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          data: {
            attributes: {
              redirect_urls: {
                success: `${window.location.origin}/?ref=ok`,
                failed: `${window.location.origin}/?ref=fallo`,
              },
              currency: '032',
              shipping: {
                name: 'Precio fijo',
                price: {
                  currency: '032',
                  amount: 2000,
                },
              },
              items: cartItems.map((item) => ({
                id: item.id,
                name: item.title,
                quantity: item.quantity,
                unitPrice: {
                  currency: '032',
                  amount: item.discountedPrice,
                },
              })),
            },
          },
        }),
      });

      if (!response.ok) {
        const errorData = await response.text();
        throw new Error(errorData || 'Error al crear la preferencia');
      }

      const data = await response.json();

      await saveOrderToDB(data.id);
      window.open(data.checkout_url, '_self'); // Abre la URL de checkout en una nueva pestaña
      return data.id; // ID de la preferencia creada
    } catch (err: any) {
      setError(err.message || 'No pudimos generar el pago. Intenta de nuevo.');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const openMercadopagoPay = async () => {
    console.log('billing', billing);
    validateBillingAndShipping();
    await saveBillingAndShippingToDB(user?.uid, billing, shipping); // Asegúrate de guardar los datos antes de proceder
    await createPreference();
  };

  const validateBillingAndShipping = () => {
    // if (
    //   !billing ||
    //   !billing.firstName ||
    //   !billing.lastName ||
    //   !billing.email ||
    //   !billing.phone
    // ) {
    //   setError('Por favor completa los detalles de facturación.');
    //   throw new Error('Por favor completa los detalles de facturación.');
    // }
    console.log('shipping', shipping);

    if (
      !shipping ||
      !shipping.addressLine1 ||
      !shipping.city ||
      !shipping.state ||
      !shipping.country ||
      !shipping.zipcode ||
      !shipping.phone
    ) {
      setError('Por favor completa los detalles de envío.');
      throw new Error('Por favor completa los detalles de envío.');
    }
  };

  const saveOrderToDB = async (preferenceId: string) => {
    try {
      if (!user) throw new Error('Usuario no autenticado');

      const orderId = uuidv4();
      const orderRef = doc(collection(db, 'orders'), orderId);

      const newOrder: Order = {
        id: orderId,
        userId: user?.uid,
        preferenceId,
        billing: billing,
        shipping,
        items: cartItems,
        total: totalPrice,
        createdAt: '',
        status: 'pending',
        notes,
      };

      await setDoc(orderRef, newOrder);

      console.log('Pedido guardado en Firestore ✅');

      return orderId;
    } catch (error) {
      console.error('Error saving order to Firestore:', error);
      throw new Error('No se pudo guardar el pedido.');
    }
  };

  // Función para guardar billing y shipping en Firestore
  const saveBillingAndShippingToDB = async (
    userId: string,
    billingData: BillingAddress,
    shippingData: ShippingAddress,
  ) => {
    try {
      // Referencia al documento del usuario
      const userRef = doc(db, 'users', userId);

      // Actualizar campos
      await updateDoc(userRef, {
        billing: billingData,
        shipping: shippingData,
        updatedAt: new Date(),
      });

      console.log('Billing y shipping guardados en Firestore ✅');
    } catch (error) {
      console.error('Error saving billing and shipping info:', error);
      throw new Error(
        'No se pudieron guardar los datos de facturación y envío.',
      );
    }
  };

  return (
    <div className='lg:max-w-[455px] w-full mt-7.5'>
      {/* <!-- order list box --> */}
      <div className='bg-white shadow-1 rounded-[10px]'>
        <div className='border-b border-gray-3 py-5 px-4 sm:px-8.5'>
          <h3 className='font-medium text-xl text-dark'>Resumen de tu orden</h3>
        </div>

        <div className='pt-2.5 pb-8.5 px-4 sm:px-8.5'>
          {/* <!-- title --> */}
          <div className='flex items-center justify-between py-5 border-b border-gray-3'>
            <div>
              <h4 className='font-medium text-dark'>Producto</h4>
            </div>
            <div>
              <h4 className='font-medium text-dark text-right'>Subtotal</h4>
            </div>
          </div>

          {/* <!-- product item --> */}
          {cartItems.map((item, key) => (
            <div
              key={key}
              className='flex items-center justify-between py-5 border-b border-gray-3'
            >
              <div>
                <p className='text-dark'>{item.title}</p>
              </div>
              <div>
                <p className='text-dark text-right'>
                  ${item.discountedPrice * item.quantity}
                </p>
              </div>
            </div>
          ))}

          {/* <!-- total --> */}
          <div className='flex items-center justify-between pt-5'>
            <div>
              <p className='font-medium text-lg text-dark'>Total</p>
            </div>
            <div>
              <p className='font-medium text-lg text-dark text-right'>
                ${totalPrice}
              </p>
            </div>
          </div>

          <button
            onClick={openMercadopagoPay}
            disabled={loading}
            className={`inline-flex font-medium text-custom-sm py-[7px] px-5 rounded-[5px] ${
              loading
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-blue text-white hover:bg-blue-dark'
            } ease-out duration-200 w-full justify-center mt-7.5`}
          >
            {loading ? 'Generando pago...' : 'Ir al pago'}
          </button>

          {/* Mostrar mensaje de error */}
          {error && (
            <div className='mt-4 p-3 text-red-dark rounded-md text-sm'>
              {error}
            </div>
          )}

          {/* Mensaje de carga */}
          {loading && (
            <div className='mt-4 flex items-center justify-center text-blue-600'>
              <svg className='animate-spin h-5 w-5 mr-2' viewBox='0 0 24 24'>
                <circle
                  className='opacity-25'
                  cx='12'
                  cy='12'
                  r='10'
                  stroke='currentColor'
                  strokeWidth='4'
                ></circle>
                <path
                  className='opacity-75'
                  fill='currentColor'
                  d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'
                ></path>
              </svg>
              Generando pago...
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OrderSummary;

const e = {
  brand: 'Ford',
  model: 'Fiesta Max',
  year: 2011,
  engine: '1.6L',
  fuel: 'Nafta',
  km_per_liter: 12,
  tank_capacity_liters: 50,
  maintenance: [
    {
      id: 'oil_change',
      name: 'Cambio de Aceite',
      every_km: 10000,
    },
    {
      id: 'oil_filter_change',
      name: 'Cambio de Filtro de Aceite',
      every_km: 10000,
    },
    {
      id: 'air_filter_change',
      name: 'Cambio de filtro de aire',
      every_km: 20000,
    },
    {
      id: 'fuel_filter_change',
      name: 'Cambio de filtro de combustible',
      every_km: 20000,
    },
    {
      id: 'tire_rotation',
      name: 'Rotación de neumáticos',
      every_km: 20000,
    },
    {
      id: 'spark_plug_change',
      name: 'Cambio de bujías',
      every_km: 40000,
    },
    {
      id: 'brake_check',
      name: 'Revisión de frenos',
      every_km: 40000,
    },
    {
      id: 'coolant_check',
      name: 'Revisión de refrigerante',
      every_km: 40000,
    },
    {
      id: 'timing_belt_change',
      name: 'Cambio de correa de distribución',
      every_km: 60000,
    },
    {
      id: 'water_pump_change',
      name: 'Cambio de bomba de agua si corresponde',
      every_km: 60000,
    },
    {
      id: 'suspension_check',
      name: 'Revisión general de suspensión',
      every_km: 100000,
    },
    {
      id: 'clutch_check',
      name: 'Chequeo de embrague',
      every_km: 100000,
    },
    {
      id: 'fluid_replacement',
      name: 'Reemplazo de líquidos (frenos, dirección, caja)',
      every_km: 100000,
    },
  ],
};
