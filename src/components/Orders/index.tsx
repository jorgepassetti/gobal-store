import React, { useEffect, useState } from 'react';
import SingleOrder from './SingleOrder';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from '@/context/AuthContext';
import { Order } from '../Cart/OrderSummary';

const Orders = () => {
  const { user } = useAuth();

  const [orders, setOrders] = useState<Order[]>([]);

  const getOrders = async () => {
    if (!user) return;

    const ordersRef = collection(db, 'orders');
    const userOrdersQuery = query(ordersRef, where('userId', '==', user.uid));
    const snapshot = await getDocs(userOrdersQuery);
    const userOrders = snapshot.docs.map(
      (doc) =>
        ({
          id: doc.id,
          ...doc.data(),
          createdAt: doc.data().createdAt?.toDate
            ? doc.data().createdAt.toDate().toISOString()
            : null,
        } as Order),
    );
    setOrders(userOrders);
  };

  useEffect(() => {
    getOrders();
  }, []);

  return (
    <>
      <div className='w-full overflow-x-auto'>
        <div className='min-w-[770px]'>
          {/* <!-- order item --> */}
          {orders.length > 0 && (
            <div className='items-center justify-between py-4.5 px-7.5 hidden md:flex '>
              <div className='min-w-[111px]'>
                <p className='text-custom-sm text-dark'>Orden N#</p>
              </div>
              <div className='min-w-[175px]'>
                <p className='text-custom-sm text-dark'>Fecha</p>
              </div>

              <div className='min-w-[128px]'>
                <p className='text-custom-sm text-dark'>Estado</p>
              </div>

              <div className='min-w-[213px]'>
                <p className='text-custom-sm text-dark'>Productos</p>
              </div>

              <div className='min-w-[113px]'>
                <p className='text-custom-sm text-dark'>Total</p>
              </div>

              <div className='min-w-[113px]'>
                <p className='text-custom-sm text-dark'>Accion</p>
              </div>
            </div>
          )}
          {orders.length > 0 ? (
            orders.map((orderItem, key) => (
              <SingleOrder key={key} orderItem={orderItem} smallView={false} />
            ))
          ) : (
            <p className='py-9.5 px-4 sm:px-7.5 xl:px-10'>
              You don&apos;t have any orders!
            </p>
          )}
        </div>

        {orders.length > 0 &&
          orders.map((orderItem, key) => (
            <SingleOrder key={key} orderItem={orderItem} smallView={true} />
          ))}
      </div>
    </>
  );
};

export default Orders;
