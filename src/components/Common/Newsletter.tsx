'use client';
import React, { useState } from 'react';
import Image from 'next/image';
import { db } from '@/lib/firebase'; // your firebase config
import {
  collection,
  query,
  where,
  getDocs,
  addDoc,
  updateDoc,
  doc,
} from 'firebase/firestore';
import { toast } from 'react-toastify'; // optional: for user feedback

const Newsletter = () => {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email.trim()) {
      toast.error('Por favor ingresa un email válido');
      return;
    }

    setIsSubmitting(true);

    try {
      // Reference to subscriptions collection
      const subscriptionsRef = collection(db, 'subscriptions');

      // Query for existing subscription by email
      const q = query(subscriptionsRef, where('email', '==', email.trim()));
      const querySnapshot = await getDocs(q);

      const now = new Date();

      if (!querySnapshot.empty) {
        // Email exists → update date
        const docRef = doc(db, 'subscriptions', querySnapshot.docs[0].id);
        await updateDoc(docRef, {
          date: now,
        });
        toast.success('¡Gracias! Tu suscripción ha sido actualizada.');
      } else {
        // Email doesn't exist → create new
        await addDoc(subscriptionsRef, {
          email: email.trim(),
          date: now,
        });
        toast.success('¡Gracias por suscribirte!');
      }

      setEmail(''); // clear input
    } catch (error) {
      console.error('Error subscribing:', error);
      toast.error('Hubo un error. Por favor intenta más tarde.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className='overflow-hidden'>
      <div className='max-w-[1170px] mx-auto px-4 sm:px-8 xl:px-0'>
        <div className='relative z-1 overflow-hidden rounded-xl'>
          {/* <!-- bg shapes --> */}
          <Image
            src='/images/shapes/newsletter-bg.jpg'
            alt='background illustration'
            className='absolute -z-1 w-full h-full left-0 top-0 rounded-xl object-cover'
            width={1170}
            height={200}
            priority
          />
          <div className='absolute -z-1 max-w-[523px] max-h-[243px] w-full h-full right-0 top-0 bg-gradient-1'></div>

          <div className='flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8 px-4 sm:px-7.5 xl:pl-12.5 xl:pr-14 py-11'>
            <div className='max-w-[491px] w-full'>
              <h2 className='max-w-[399px] text-white font-bold text-lg sm:text-xl xl:text-heading-4 mb-3'>
                No te pierdas nuestras últimas noticias y ofertas
              </h2>
              <p className='text-white'>
                Suscríbete a nuestro boletín para recibir actualizaciones
                periódicas sobre nuevos productos, ofertas especiales y más.
              </p>
            </div>

            <div className='max-w-[477px] w-full'>
              <form
                onSubmit={handleSubscribe}
                className='flex flex-col sm:flex-row gap-4'
              >
                <input
                  type='email'
                  name='email'
                  id='email'
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder='Ingresá tu email'
                  required
                  className='w-full bg-gray-1 border border-gray-3 outline-none rounded-md placeholder:text-dark-4 py-3 px-5'
                />
                <button
                  type='submit'
                  disabled={isSubmitting}
                  className='inline-flex justify-center py-3 px-7 text-white bg-blue font-medium rounded-md ease-out duration-200 hover:bg-blue-dark disabled:opacity-70 disabled:cursor-not-allowed'
                >
                  {isSubmitting ? 'Enviando...' : 'Subscribirme'}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Newsletter;
