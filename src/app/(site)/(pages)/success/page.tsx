import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

export default function SuccessPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<string | null>(null);
  const [paymentId, setPaymentId] = useState<string | null>(null);
  const [orderId, setOrderId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Extraer parámetros de la URL
    const paymentId = searchParams.get('payment_id');
    const status = searchParams.get('status');
    const externalReference = searchParams.get('external_reference'); // Tu orderId

    setStatus(status || 'unknown');
    setPaymentId(paymentId || 'unknown');
    setOrderId(externalReference || 'unknown');

    // Si el pago fue rechazado o pendiente, no mostrar "éxito"
    if (status === 'rejected') {
      setError('El pago fue rechazado. Por favor, intenta con otro método.');
    } else if (status === 'pending') {
      setError('El pago está pendiente. Te notificaremos cuando se complete.');
    } else if (status !== 'approved') {
      setError('Hubo un problema con el pago. Contacta al soporte.');
    }

    // Opcional: aquí podrías llamar a tu backend para guardar la orden
    // si el pago fue aprobado
    if (status === 'approved' && externalReference) {
      // Ejemplo: enviar a tu backend para confirmar orden
      fetch('/api/confirm-payment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          paymentId,
          orderId: externalReference,
          status,
        }),
      })
        .then((res) => res.json())
        .then((data) => {
          console.log('✅ Orden confirmada en backend:', data);
        })
        .catch((err) => {
          console.error('❌ Error al confirmar pago:', err);
        });
    }
  }, [searchParams]);

  return (
    <div className='min-h-screen flex items-center justify-center bg-gray-50 p-4'>
      <div className='text-center p-8 bg-white rounded-lg shadow-lg max-w-md w-full'>
        {status === 'approved' ? (
          <>
            <svg
              className='w-16 h-16 text-green-500 mx-auto mb-4'
              fill='none'
              stroke='currentColor'
              viewBox='0 0 24 24'
              xmlns='http://www.w3.org/2000/svg'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth='2'
                d='M5 13l4 4L19 7'
              ></path>
            </svg>
            <h1 className='text-2xl font-bold text-gray-800'>
              ¡Pago recibido!
            </h1>
            <p className='mt-2 text-gray-600'>
              Tu pedido ha sido procesado y se enviará pronto.
            </p>
            <p className='mt-4 text-sm text-gray-500'>
              Gracias por comprar con nosotros.
            </p>
            <div className='mt-6 p-3 bg-blue-50 rounded border border-blue-200 text-xs text-blue-800'>
              <strong>ID de pago:</strong> {paymentId}
              <br />
              <strong>Orden:</strong> {orderId}
            </div>
          </>
        ) : status === 'pending' ? (
          <>
            <svg
              className='w-16 h-16 text-yellow-500 mx-auto mb-4'
              fill='none'
              stroke='currentColor'
              viewBox='0 0 24 24'
              xmlns='http://www.w3.org/2000/svg'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth='2'
                d='M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z'
              ></path>
            </svg>
            <h1 className='text-2xl font-bold text-gray-800'>Pago pendiente</h1>
            <p className='mt-2 text-gray-600'>
              Tu pago aún no ha sido confirmado. Verifica tu correo o vuelve más
              tarde.
            </p>
            <p className='mt-4 text-sm text-gray-500'>
              Nosotros te notificaremos cuando se complete.
            </p>
          </>
        ) : (
          <>
            <svg
              className='w-16 h-16 text-red-500 mx-auto mb-4'
              fill='none'
              stroke='currentColor'
              viewBox='0 0 24 24'
              xmlns='http://www.w3.org/2000/svg'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth='2'
                d='M6 18L18 6M6 6l12 12'
              ></path>
            </svg>
            <h1 className='text-2xl font-bold text-gray-800'>Pago rechazado</h1>
            <p className='mt-2 text-gray-600'>
              Lo sentimos, tu pago no pudo ser procesado.
            </p>
            {error && <p className='mt-2 text-red-600 text-sm'>{error}</p>}
            <p className='mt-4 text-sm text-gray-500'>
              Intenta nuevamente o contacta a soporte.
            </p>
          </>
        )}

        {/* Botón para volver al inicio */}
        <button
          onClick={() => router.push('/')}
          className='mt-8 px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors'
        >
          Volver a la tienda
        </button>
      </div>
    </div>
  );
}
