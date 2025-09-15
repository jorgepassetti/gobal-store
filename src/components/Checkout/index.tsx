'use client';
import React, { useEffect, useState } from 'react';
import Breadcrumb from '../Common/Breadcrumb';
import Login from './Login';
import Shipping from './Shipping';
import ShippingMethod from './ShippingMethod';
import PaymentMethod from './PaymentMethod';
import Coupon from './Coupon';
import Billing from './Billing';
import Discount from '../Cart/Discount';
import OrderSummary from '../Cart/OrderSummary';
import { useAuth } from '@/context/AuthContext';
import { useDispatch } from 'react-redux';
import { setBillingAddress } from '@/redux/features/billing-slice';
import { setShippingAddress } from '@/redux/features/shipping-slice';

const Checkout = () => {
  const { user } = useAuth();
  const dispatch = useDispatch();
  const [notes, setNotes] = useState('second');

  useEffect(() => {
    console.log('user data in Checkout:', user);

    if (user?.billing) {
      console.log('User billing data:', user.billing);
      dispatch(setBillingAddress(user.billing));

      if (user.shipping) {
        dispatch(setShippingAddress(user.shipping));
      } else {
        dispatch(
          setShippingAddress({
            country: user.billing.country || '',
            addressLine1: user.billing.address || '',
            addressLine2: user.billing.addressTwo || '',
            city: user.billing.city || '',
            state: user.billing.city || '',
          }),
        );
      }
    }
  }, [user, dispatch]);

  return (
    <>
      <Breadcrumb title={'Finalizar compra'} pages={['checkout']} />
      <section className='overflow-hidden py-20 bg-gray-2'>
        <div className='max-w-[1170px] w-full mx-auto px-4 sm:px-8 xl:px-0'>
          <div>
            <div className='flex flex-col lg:flex-row gap-7.5 xl:gap-11'>
              {/* <!-- checkout left --> */}
              <div className='lg:max-w-[670px] w-full'>
                {/* <!-- login box --> */}
                <Login />

                {/* <!-- billing details --> */}
                <Billing />

                {/* <!-- address box two --> */}
                <Shipping />

                {/* <!-- others note box --> */}
                <div className='bg-white shadow-1 rounded-[10px] p-4 sm:p-8.5 mt-7.5'>
                  <div>
                    <label htmlFor='notes' className='block mb-2.5'>
                      Otras Notas (opcional)
                    </label>

                    <textarea
                      name='notes'
                      id='notes'
                      rows={5}
                      placeholder='Notas sobre tu pedido o sobre el envio.'
                      className='rounded-md border border-gray-3 bg-gray-1 placeholder:text-dark-5 w-full p-5 outline-none duration-200 focus:border-transparent focus:shadow-input focus:ring-2 focus:ring-blue/20'
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                    ></textarea>
                  </div>
                </div>
              </div>

              {/* // <!-- checkout right --> */}
              <div className='max-w-[455px] w-full mt-14.5'>
                {/* <!-- coupon box --> */}
                {/* <Discount /> */}

                {/* <!-- shipping box --> */}
                {/* <ShippingMethod /> */}

                {/* <!-- payment box --> */}
                {/* <PaymentMethod /> */}

                {/* <!-- order list box --> */}
                <OrderSummary notes={notes} />

                {/* <!-- checkout button --> */}
                {/* <button
                  type='submit'
                  className='w-full flex justify-center font-medium text-white bg-blue py-3 px-6 rounded-md ease-out duration-200 hover:bg-blue-dark mt-7.5'
                >
                  Proceder al pago
                </button> */}
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Checkout;
