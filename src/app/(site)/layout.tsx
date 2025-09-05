'use client';
import { useState, useEffect } from 'react';
import '../css/euclid-circular-a-font.css';
import '../css/style.css';
import Header from '../../components/Header';
import Footer from '../../components/Footer';

import { ModalProvider } from '../context/QuickViewModalContext';
import { CartModalProvider } from '../context/CartSidebarModalContext';
import { ReduxProvider } from '@/redux/provider';
import QuickViewModal from '@/components/Common/QuickViewModal';
import CartSidebarModal from '@/components/Common/CartSidebarModal';
import { PreviewSliderProvider } from '../context/PreviewSliderContext';
import PreviewSliderModal from '@/components/Common/PreviewSlider';

import ScrollToTop from '@/components/Common/ScrollToTop';
import PreLoader from '@/components/Common/PreLoader';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // REMOVE the 'mounted' state and its useEffect. It's causing the mismatch.

  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    // This is okay. It only runs on the client.
    setTimeout(() => setLoading(false), 1000);
  }, []);

  // REMOVE the 'if (!mounted)' block.

  return (
    <html lang='en'>
      <body>
        {loading ? (
          <PreLoader />
        ) : (
          <>
            <ReduxProvider>
              <CartModalProvider>
                <ModalProvider>
                  <PreviewSliderProvider>
                    <Header />
                    {children}

                    <QuickViewModal />
                    <CartSidebarModal />
                    <PreviewSliderModal />
                  </PreviewSliderProvider>
                </ModalProvider>
              </CartModalProvider>
            </ReduxProvider>
            <ScrollToTop />
            <Footer />
          </>
        )}
      </body>
    </html>
  );
}
