'use client';
import Breadcrumb from '@/components/Common/Breadcrumb';
import Link from 'next/link';
import React, { useState } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

const Signin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const { user } = useAuth();

  // Si ya está logueado, redirige automáticamente
  if (user) {
    router.push('/'); // o /dashboard si lo tienes
    return null;
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await signInWithEmailAndPassword(auth, email, password);
      // Login exitoso → redirigir
      router.push('/');
    } catch (err: any) {
      console.error('Error logging in:', err);
      let message = 'Error al iniciar sesión';

      if (err.code === 'auth/user-not-found') {
        message = 'No se encontró una cuenta con ese correo.';
      } else if (err.code === 'auth/wrong-password') {
        message = 'Contraseña incorrecta.';
      } else if (err.code === 'auth/invalid-email') {
        message = 'Correo electrónico inválido.';
      } else if (err.code === 'auth/too-many-requests') {
        message = 'Demasiados intentos fallidos. Inténtalo más tarde.';
      } else if (err.code === 'auth/internal-error') {
        message = 'Error interno. Por favor, inténtalo de nuevo.';
      }

      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Breadcrumb title={'Iniciar Sesión'} pages={['Iniciar Sesión']} />
      <section className='overflow-hidden py-20 bg-gray-2'>
        <div className='max-w-[1170px] w-full mx-auto px-4 sm:px-8 xl:px-0'>
          <div className='max-w-[570px] w-full mx-auto rounded-xl bg-white shadow-1 p-4 sm:p-7.5 xl:p-11'>
            <div className='text-center mb-11'>
              <h2 className='font-semibold text-xl sm:text-2xl xl:text-heading-5 text-dark mb-1.5'>
                Iniciar Sesión en tu cuenta
              </h2>
              <p>Ingresá tus datos abajo</p>
            </div>

            {error && (
              <div className='mb-6 p-3 bg-red-100 text-red-700 rounded-md text-sm'>
                {error}
              </div>
            )}

            <form onSubmit={handleLogin}>
              <div className='mb-5'>
                <label htmlFor='email' className='block mb-2.5'>
                  Email
                </label>

                <input
                  type='email'
                  name='email'
                  id='email'
                  placeholder='Enter your email'
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className='rounded-lg border border-gray-3 bg-gray-1 placeholder:text-dark-5 w-full py-3 px-5 outline-none duration-200 focus:border-transparent focus:shadow-input focus:ring-2 focus:ring-blue/20'
                  required
                />
              </div>

              <div className='mb-5'>
                <label htmlFor='password' className='block mb-2.5'>
                  Contraseña
                </label>

                <input
                  type='password'
                  name='password'
                  id='password'
                  placeholder='Enter your password'
                  autoComplete='current-password'
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className='rounded-lg border border-gray-3 bg-gray-1 placeholder:text-dark-5 w-full py-3 px-5 outline-none duration-200 focus:border-transparent focus:shadow-input focus:ring-2 focus:ring-blue/20'
                  required
                />
              </div>

              <button
                type='submit'
                disabled={loading}
                className='w-full flex justify-center font-medium text-white bg-dark py-3 px-6 rounded-lg ease-out duration-200 hover:bg-blue mt-7.5 disabled:opacity-50 disabled:cursor-not-allowed'
              >
                {loading ? (
                  <span className='flex items-center gap-2'>
                    <svg
                      className='animate-spin h-5 w-5 text-white'
                      xmlns='http://www.w3.org/2000/svg'
                      fill='none'
                      viewBox='0 0 24 24'
                    >
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
                    Iniciando...
                  </span>
                ) : (
                  'Iniciar Sesión en tu cuenta'
                )}
              </button>

              <a
                href='#'
                className='block text-center text-dark-4 mt-4.5 ease-out duration-200 hover:text-dark'
              >
                Olvidaste tu contraseña?
              </a>

              <p className='text-center mt-6'>
                No tienes una cuenta?
                <Link
                  href='/signup'
                  className='text-dark ease-out duration-200 hover:text-blue pl-2'
                >
                  Registrate gratis!
                </Link>
              </p>
            </form>
          </div>
        </div>
      </section>
    </>
  );
};

export default Signin;
