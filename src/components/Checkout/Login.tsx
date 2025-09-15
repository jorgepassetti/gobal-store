// src/components/Login.tsx
import React, { useState } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

const Login = () => {
  const [dropdown, setDropdown] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const { user } = useAuth();

  // Si ya está logueado, redirige automáticamente
  if (user) {
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
      }
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='bg-white shadow-1 rounded-[10px]'>
      <div
        onClick={() => setDropdown(!dropdown)}
        className={`cursor-pointer flex items-center gap-0.5 py-5 px-5.5 ${
          dropdown && 'border-b border-gray-3'
        }`}
      >
        ¿Ya tienes cuenta?
        <span className='flex items-center gap-2.5 pl-1 font-medium text-dark'>
          Haz clic aquí para iniciar sesión
          <svg
            className={`${
              dropdown && 'rotate-180'
            } fill-current ease-out duration-200`}
            width='22'
            height='22'
            viewBox='0 0 22 22'
            fill='none'
            xmlns='http://www.w3.org/2000/svg'
          >
            <path
              fillRule='evenodd'
              clipRule='evenodd'
              d='M4.06103 7.80259C4.30813 7.51431 4.74215 7.48092 5.03044 7.72802L10.9997 12.8445L16.9689 7.72802C17.2572 7.48092 17.6912 7.51431 17.9383 7.80259C18.1854 8.09088 18.1521 8.5249 17.8638 8.772L11.4471 14.272C11.1896 14.4927 10.8097 14.4927 10.5523 14.272L4.1356 8.772C3.84731 8.5249 3.81393 8.09088 4.06103 7.80259Z'
              fill=''
            />
          </svg>
        </span>
      </div>

      {/* <!-- menú desplegable --> */}
      <div
        className={`${
          dropdown ? 'block' : 'hidden'
        } pt-7.5 pb-8.5 px-4 sm:px-8.5`}
      >
        <p className='text-custom-sm mb-6'>
          Si aún no has iniciado sesión, por favor inicia sesión primero.
        </p>

        <form onSubmit={handleLogin}>
          <div className='mb-5'>
            <label htmlFor='email' className='block mb-2.5'>
              Nombre de usuario o correo electrónico
            </label>

            <input
              type='email'
              id='email'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder='ingresa@tuemail.com'
              className='rounded-md border border-gray-3 bg-gray-1 placeholder:text-dark-5 w-full py-2.5 px-5 outline-none duration-200 focus:border-transparent focus:shadow-input focus:ring-2 focus:ring-blue/20'
              required
            />
          </div>

          <div className='mb-5'>
            <label htmlFor='password' className='block mb-2.5'>
              Contraseña
            </label>

            <input
              type='password'
              id='password'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete='current-password'
              className='rounded-md border border-gray-3 bg-gray-1 placeholder:text-dark-5 w-full py-2.5 px-5 outline-none duration-200 focus:border-transparent focus:shadow-input focus:ring-2 focus:ring-blue/20'
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
            className='inline-flex font-medium text-white bg-blue py-3 px-10.5 rounded-md ease-out duration-200 hover:bg-blue-dark disabled:opacity-50 disabled:cursor-not-allowed'
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
                Iniciando...
              </span>
            ) : (
              'Iniciar sesión'
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
