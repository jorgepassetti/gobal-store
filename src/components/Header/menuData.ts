import { Menu } from '@/types/Menu';

export const menuData: Menu[] = [
  {
    id: 1,
    title: 'Popular',
    newTab: false,
    path: '/',
  },
  {
    id: 2,
    title: 'Shop',
    newTab: false,
    path: '/shop',
  },
  // {
  //   id: 3,
  //   title: 'Contacto',
  //   newTab: false,
  //   path: '/contact',
  // },
  {
    id: 6,
    title: 'pages',
    newTab: false,
    path: '/',
    submenu: [
      {
        id: 61,
        title: 'Shop With Sidebar',
        newTab: false,
        path: '/shop',
      },
      {
        id: 64,
        title: 'Finalizar compra',
        newTab: false,
        path: '/checkout',
      },
      {
        id: 65,
        title: 'Carrito',
        newTab: false,
        path: '/cart',
      },
      {
        id: 66,
        title: 'Favoritos',
        newTab: false,
        path: '/wishlist',
      },
      {
        id: 67,
        title: 'Iniciar Sesión',
        newTab: false,
        path: '/signin',
      },
      {
        id: 68,
        title: 'Crear Cuenta',
        newTab: false,
        path: '/signup',
      },
      {
        id: 69,
        title: 'Mi Cuenta',
        newTab: false,
        path: '/my-account',
      },
      {
        id: 70,
        title: 'Contacto',
        newTab: false,
        path: '/contact',
      },
      {
        id: 62,
        title: 'Error',
        newTab: false,
        path: '/error',
      },
    ],
  },
  // {
  //   id: 7,
  //   title: 'blogs',
  //   newTab: false,
  //   path: '/',
  //   submenu: [
  //     {
  //       id: 71,
  //       title: 'Blog Grid with sidebar',
  //       newTab: false,
  //       path: '/blogs/blog-grid-with-sidebar',
  //     },
  //     {
  //       id: 72,
  //       title: 'Blog Grid',
  //       newTab: false,
  //       path: '/blogs/blog-grid',
  //     },
  //     {
  //       id: 73,
  //       title: 'Blog details with sidebar',
  //       newTab: false,
  //       path: '/blogs/blog-details-with-sidebar',
  //     },
  //     {
  //       id: 74,
  //       title: 'Blog details',
  //       newTab: false,
  //       path: '/blogs/blog-details',
  //     },
  //   ],
  // },
];
