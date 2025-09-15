'use client';

import { selectTotalPrice } from '@/redux/features/cart-slice';
import { useAppSelector } from '@/redux/store';
import React, { useEffect, useState } from 'react';
import { initMercadoPago, Wallet } from '@mercadopago/sdk-react'; // ✅ Este sí existe y es correcto
import { useAuth } from '@/context/AuthContext';
import { collection, doc, setDoc, updateDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { v4 as uuidv4 } from 'uuid';
import { BillingAddress } from '@/redux/features/billing-slice';
import { ShippingAddress } from '@/redux/features/shipping-slice';

// Inicializa Mercado Pago con tu Public Key
initMercadoPago(process.env.NEXT_PUBLIC_MP_PUBLIC_KEY);

const OrderSummary = ({ notes }) => {
  const { user } = useAuth();
  const cartItems = useAppSelector((state) => state.cartReducer.items);
  const totalPrice = useAppSelector(selectTotalPrice);

  // 👇 Supón que tienes la dirección guardada en Redux (ej: shippingSlice)
  const shipping = useAppSelector((state) => state.shippingReducer); // ¡Ajusta según tu estructura!
  const billing = useAppSelector((state) => state.billingReducer);

  const [preferenceId, setPreferenceId] = useState<string | null>(null);

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
          items: cartItems.map((item) => ({
            title: item.title,
            quantity: item.quantity,
            unit_price: item.discountedPrice,
            currency_id: 'ARS', // Cambia a COP, ARS, USD, etc. según tu país
          })),
          payer: {
            email: billing?.email || '', // Si lo tienes
            first_name: billing?.firstName || '',
            last_name: billing?.lastName || '',
            phone: {
              area_code: '+52', // Ej: +52 para México
              number: billing?.phone.replace(/\D/g, '') || '',
            },
            address: {
              zip_code: '0000', // Opcional
              street_name: shipping?.addressLine1 || '',
              street_number: shipping?.addressLine2 || '',
              city_name: shipping?.city || '',
              state_name: shipping?.state || '',
              country_id: 'AR', // Código ISO del país
            },
          },
          shipments: {
            cost: 1530,
            mode: 'not_specified',
            receiver_address: {
              zip_code: '0000',
              street_name: '0000',
              street_number: '0000',
              floor: '0000',
              apartment: '0000',
              city_name: '0000',
              state_name: '0000',
              country_name: '0000',
            },
          },
          back_urls: {
            success: `${window.location.origin}/success`,
            failure: `${window.location.origin}/failure`,
            pending: `${window.location.origin}/pending`,
          },
          auto_return: 'approved', // Redirigir automáticamente si paga
          payment_methods: {
            excluded_payment_types: [{ id: 'atm' }], // Opcional: excluir métodos
          },
          metadata: {
            orderId: Date.now().toString(), // Identificador único de tu sistema
          },
        }),
      });

      if (!response.ok) {
        const errorData = await response.text();
        throw new Error(errorData || 'Error al crear la preferencia');
      }

      const data = await response.json();

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
    const preferenceId = await createPreference();
    await saveOrderToDB(preferenceId);
    setPreferenceId(preferenceId);
  };

  const validateBillingAndShipping = () => {
    if (
      !billing ||
      !billing.firstName ||
      !billing.lastName ||
      !billing.email ||
      !billing.phone
    ) {
      setError('Por favor completa los detalles de facturación.');
      throw new Error('Por favor completa los detalles de facturación.');
    }
    console.log('shipping', shipping);

    // if (
    //   !shipping ||
    //   !shipping.addressLine1 ||
    //   !shipping.city ||
    //   !shipping.state ||
    //   !shipping.country
    // ) {
    //   setError('Por favor completa los detalles de envío.');
    //   throw new Error('Por favor completa los detalles de envío.');
    // }
  };

  const saveOrderToDB = async (preferenceId: string) => {
    try {
      if (!user) throw new Error('Usuario no autenticado');

      const orderId = uuidv4();
      const orderRef = doc(collection(db, 'orders'), orderId);
      const { password, retypePassword, ...cleanedData } = billing;

      const newOrder = {
        id: orderId,
        userId: user?.uid,
        preferenceId,
        billing: cleanedData,
        shipping,
        items: cartItems,
        total: totalPrice,
        createdAt: new Date(),
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

      const { password, retypePassword, ...cleanedData } = billingData;

      console.log('cleanedData', cleanedData);

      // Actualizar campos
      await updateDoc(userRef, {
        billing: cleanedData,
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

          {/* <!-- Mercado Pago Button --> */}
          {preferenceId && (
            <Wallet initialization={{ preferenceId }} locale='es-AR' />
          )}

          {!preferenceId && (
            <button
              onClick={openMercadopagoPay}
              disabled={loading}
              className={`inline-flex font-medium text-custom-sm py-[7px] px-5 rounded-[5px] ${
                loading
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-blue text-white hover:bg-blue-dark'
              } ease-out duration-200 w-full justify-center mt-7.5`}
            >
              {loading ? 'Generando pago...' : 'Pagar con Mercado Pago'}
            </button>
          )}

          {/* Mostrar mensaje de error */}
          {error && (
            <div className='mt-4 p-3 bg-red-100 text-red-700 rounded-md text-sm'>
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
