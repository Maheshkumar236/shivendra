import React, { useState, useEffect } from 'react';
import { ToastProvider } from './components/ui/Toast';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { HomePage } from './components/pages/HomePage';
import { ServicesPage } from './components/pages/ServicesPage';
import { GalleryPage } from './components/pages/GalleryPage';
import { AboutPage } from './components/pages/AboutPage';
import { PricingPage } from './components/pages/PricingPage';
import { ContactPage } from './components/pages/ContactPage';
import { BookingWizardPage } from './components/pages/BookingWizardPage';
import { ClientPortal } from './components/portal/ClientPortal';
import { AdminPanel } from './components/admin/AdminPanel';
import { GalleryImage } from './types/index';

export default function App() {
  const [activePage, setActivePage] = useState<string>('home');
  const [pageOptions, setPageOptions] = useState<{
    serviceId?: string;
    packageId?: 'Essential' | 'Signature' | 'Bespoke';
    galleryId?: string;
  }>({});

  const [lightboxImage, setLightboxImage] = useState<GalleryImage | null>(null);

  // Handle URL hash or autostart query param
  useEffect(() => {
    const handleLocationChange = () => {
      const params = new URLSearchParams(window.location.search);
      const pageParam = params.get('page');
      const hash = window.location.hash.replace('#', '');
      if (pageParam) {
        setActivePage(pageParam);
      } else if (hash && ['home', 'services', 'gallery', 'about', 'pricing', 'contact', 'book', 'portal', 'admin'].includes(hash)) {
        setActivePage(hash);
      }
    };

    handleLocationChange();
    window.addEventListener('popstate', handleLocationChange);
    return () => window.removeEventListener('popstate', handleLocationChange);
  }, []);

  const navigateTo = (
    page: string,
    options?: { serviceId?: string; packageId?: 'Essential' | 'Signature' | 'Bespoke'; galleryId?: string }
  ) => {
    setActivePage(page);
    if (options) {
      setPageOptions(options);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
    try {
      window.history.pushState(null, '', `#${page}`);
    } catch {
      // Ignore in iframe if pushState is restricted
    }
  };

  const handleOpenLightbox = (img: GalleryImage) => {
    setLightboxImage(img);
    setActivePage('gallery');
  };

  return (
    <ToastProvider>
      <div className="min-h-screen flex flex-col bg-[#FAF7F2] text-[#1C1B1A]">
        {/* Navigation Bar */}
        <Navbar activePage={activePage} onNavigate={navigateTo} />

        {/* Main View Area */}
        <main className="flex-1">
          {activePage === 'home' && (
            <HomePage onNavigate={navigateTo} onOpenLightbox={handleOpenLightbox} />
          )}

          {activePage === 'services' && (
            <ServicesPage
              onNavigate={navigateTo}
              initialServiceId={pageOptions.serviceId || 'weddings'}
            />
          )}

          {activePage === 'gallery' && (
            <GalleryPage
              onNavigate={navigateTo}
              externalActiveImage={lightboxImage}
              onCloseExternalLightbox={() => setLightboxImage(null)}
            />
          )}

          {activePage === 'about' && <AboutPage onNavigate={navigateTo} />}

          {activePage === 'pricing' && <PricingPage onNavigate={navigateTo} />}

          {activePage === 'contact' && <ContactPage onNavigate={navigateTo} />}

          {activePage === 'book' && (
            <BookingWizardPage
              onNavigate={navigateTo}
              initialPackageId={pageOptions.packageId || 'Signature'}
            />
          )}

          {activePage === 'portal' && <ClientPortal onNavigate={navigateTo} />}

          {activePage === 'admin' && <AdminPanel onNavigate={navigateTo} />}
        </main>

        {/* Footer on public & informational pages */}
        {['home', 'services', 'gallery', 'about', 'pricing', 'contact'].includes(activePage) && (
          <Footer onNavigate={navigateTo} />
        )}
      </div>
    </ToastProvider>
  );
}
