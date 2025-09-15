'use client';

// src/app/signup/page.tsx
import React, { useState } from 'react';
import Breadcrumb from '@/components/Common/Breadcrumb';
import Link from 'next/link';
import { createUserWithEmailAndPassword, signInWithPopup } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

const Signup = () => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [retypePassword, setRetypePassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const { user } = useAuth();

  // Si ya está logueado, redirigir
  if (user) {
    router.push('/');
    return null;
  }

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Validar que las contraseñas coincidan
    if (password !== retypePassword) {
      setError('Las contraseñas no coinciden.');
      setLoading(false);
      return;
    }

    if (password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres.');
      setLoading(false);
      return;
    }

    try {
      // Crear usuario con email y contraseña
      await createUserWithEmailAndPassword(auth, email, password);

      // Opcional: actualizar nombre de usuario en Firebase Auth
      // await updateProfile(userCredential.user, { displayName: fullName });

      // Redirigir a dashboard
      router.push('/');
    } catch (err: any) {
      console.error('Error creating account:', err);
      let message = 'No se pudo crear la cuenta. Inténtalo de nuevo.';

      if (err.code === 'auth/email-already-in-use') {
        message = 'Este correo ya está registrado.';
      } else if (err.code === 'auth/invalid-email') {
        message = 'Correo electrónico inválido.';
      } else if (err.code === 'auth/weak-password') {
        message = 'Contraseña demasiado débil. Usa al menos 6 caracteres.';
      }

      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Breadcrumb title={'Crear Cuenta'} pages={['Crear Cuenta']} />
      <section className='overflow-hidden py-20 bg-gray-2'>
        <div className='max-w-[1170px] w-full mx-auto px-4 sm:px-8 xl:px-0'>
          <div className='max-w-[570px] w-full mx-auto rounded-xl bg-white shadow-1 p-4 sm:p-7.5 xl:p-11'>
            <div className='text-center mb-11'>
              <h2 className='font-semibold text-xl sm:text-2xl xl:text-heading-5 text-dark mb-1.5'>
                Crear una Cuenta
              </h2>
              <p>Ingresa tus datos para registrarte</p>
            </div>

            <span className='relative z-1 block font-medium text-center mt-4.5'>
              <span className='block absolute -z-1 left-0 top-1/2 h-px w-full bg-gray-3'></span>
              <span className='inline-block px-3 bg-white'>O</span>
            </span>

            {/* Formulario de registro con email */}
            <div className='mt-5.5'>
              <form onSubmit={handleSignup}>
                <div className='mb-5'>
                  <label htmlFor='name' className='block mb-2.5'>
                    Nombre completo <span className='text-red'>*</span>
                  </label>

                  <input
                    type='text'
                    name='name'
                    id='name'
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder='Ingresa tu nombre completo'
                    className='rounded-lg border border-gray-3 bg-gray-1 placeholder:text-dark-5 w-full py-3 px-5 outline-none duration-200 focus:border-transparent focus:shadow-input focus:ring-2 focus:ring-blue/20'
                    required
                  />
                </div>

                <div className='mb-5'>
                  <label htmlFor='email' className='block mb-2.5'>
                    Correo electrónico <span className='text-red'>*</span>
                  </label>

                  <input
                    type='email'
                    name='email'
                    id='email'
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder='ejemplo@dominio.com'
                    className='rounded-lg border border-gray-3 bg-gray-1 placeholder:text-dark-5 w-full py-3 px-5 outline-none duration-200 focus:border-transparent focus:shadow-input focus:ring-2 focus:ring-blue/20'
                    required
                  />
                </div>

                <div className='mb-5'>
                  <label htmlFor='password' className='block mb-2.5'>
                    Contraseña <span className='text-red'>*</span>
                  </label>

                  <input
                    type='password'
                    name='password'
                    id='password'
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder='Mínimo 6 caracteres'
                    autoComplete='new-password'
                    className='rounded-lg border border-gray-3 bg-gray-1 placeholder:text-dark-5 w-full py-3 px-5 outline-none duration-200 focus:border-transparent focus:shadow-input focus:ring-2 focus:ring-blue/20'
                    required
                  />
                </div>

                <div className='mb-5.5'>
                  <label htmlFor='re-type-password' className='block mb-2.5'>
                    Repetir contraseña <span className='text-red'>*</span>
                  </label>

                  <input
                    type='password'
                    name='re-type-password'
                    id='re-type-password'
                    value={retypePassword}
                    onChange={(e) => setRetypePassword(e.target.value)}
                    placeholder='Confirma tu contraseña'
                    autoComplete='new-password'
                    className='rounded-lg border border-gray-3 bg-gray-1 placeholder:text-dark-5 w-full py-3 px-5 outline-none duration-200 focus:border-transparent focus:shadow-input focus:ring-2 focus:ring-blue/20'
                    required
                  />
                </div>

                {error && (
                  <div className='mb-5 p-3 bg-red-100 text-red-700 rounded-md text-sm'>
                    {error}
                  </div>
                )}

                <button
                  type='submit'
                  disabled={loading}
                  className='w-full flex justify-center font-medium text-white bg-dark py-3 px-6 rounded-lg ease-out duration-200 hover:bg-blue mt-7.5 disabled:opacity-50 disabled:cursor-not-allowed'
                >
                  {loading ? (
                    <span className='flex items-center'>
                      <svg
                        className='animate-spin -ml-1 mr-2 h-4 w-4 text-white'
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
                      Creando cuenta...
                    </span>
                  ) : (
                    'Crear Cuenta'
                  )}
                </button>

                <p className='text-center mt-6'>
                  ¿Ya tienes una cuenta?
                  <Link
                    href='/signin'
                    className='text-dark ease-out duration-200 hover:text-blue pl-2'
                  >
                    Iniciar sesión
                  </Link>
                </p>
              </form>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Signup;
