import React from 'react';
import { Order } from '../Cart/OrderSummary';

export const orderStatusMap = {
  pending: 'PENDIENTE',
  processing: 'EN PROCESO',
  delivered: 'ENTREGADO',
};

const OrderDetails = ({ orderItem }: { orderItem: Order }) => {
  return (
    <>
      <div className='items-center justify-between py-4.5 px-7.5 hidden md:flex '>
        <div className='min-w-[113px]'>
          <p className='text-custom-sm text-dark'>Order</p>
        </div>
        <div className='min-w-[113px]'>
          <p className='text-custom-sm text-dark'>Date</p>
        </div>

        <div className='min-w-[113px]'>
          <p className='text-custom-sm text-dark'>Status</p>
        </div>

        {/* <div className="min-w-[113px]">
          <p className="text-custom-sm text-dark">Title</p>
        </div> */}

        <div className='min-w-[113px]'>
          <p className='text-custom-sm text-dark'>Total</p>
        </div>

        {/* <div className="min-w-[113px]">
          <p className="text-custom-sm text-dark">Action</p>
        </div> */}
      </div>

      <div className='items-center justify-between border-t border-gray-3 py-5 px-7.5 hidden md:flex'>
        <div className='min-w-[111px]'>
          <p className='text-custom-sm text-red'>#{orderItem?.id.slice(-8)}</p>
        </div>
        <div className='min-w-[175px]'>
          <p className='text-custom-sm text-dark'>
            {orderItem.createdAt.split('T')[0]}
          </p>
        </div>

        <div className='min-w-[128px]'>
          <p
            className={`inline-block text-custom-sm  py-0.5 px-2.5 rounded-[30px] capitalize ${
              orderItem.status === 'delivered'
                ? 'text-green bg-green-light-6'
                : orderItem.status === 'pending'
                ? 'text-red bg-red-light-6'
                : orderItem.status === 'processing'
                ? 'text-yellow bg-yellow-light-4'
                : 'Unknown Status'
            }`}
          >
            {orderStatusMap[orderItem.status]}
          </p>
        </div>

        {/* <div className="min-w-[213px]">
          <p className="text-custom-sm text-dark">{orderItem.orderTitle}</p>
        </div> */}

        <div className='min-w-[113px]'>
          <p className='text-custom-sm text-dark'>${orderItem.total}</p>
        </div>
      </div>
      <div className='px-7.5 w-full'>
        <p className='font-bold'>Direccion de entrega:</p>{' '}
        <p>
          {orderItem.shipping.addressLine1} {orderItem.shipping.addressLine2}{' '}
          {orderItem.shipping.city}
        </p>
      </div>
    </>
  );
};

export default OrderDetails;
