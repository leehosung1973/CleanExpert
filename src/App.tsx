import React, { useState, useEffect } from 'react';
import { AuthProvider } from './context/AuthContext';
import { BookingProvider } from './context/BookingContext';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { MobileReservationBar } from './components/MobileReservationBar';
import { AuthModal } from './components/AuthModal';

import { HomeView } from './views/HomeView';
import { ServicesView } from './views/ServicesView';
import { PricingView } from './views/PricingView';
import { ReviewsView } from './views/ReviewsView';
import { FaqView } from './views/FaqView';
import { MyPageView } from './views/MyPageView';
import { BookingView } from './views/BookingView';
import { AdminView } from './views/AdminView';

import { ServiceType, AreaSize } from './types';

export default function App() {
  const [currentView, setCurrentView] = useState<string>('home');
  const [authModalOpen, setAuthModalOpen] = useState<boolean>(false);

  // Booking params passed from services or calculator
  const [bookingService, setBookingService] = useState<ServiceType>('basic');
  const [bookingAreaSize, setBookingAreaSize] = useState<AreaSize>('21_30');
  const [bookingOptions, setBookingOptions] = useState<string[]>([]);

  // Scroll to top when view changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentView]);

  const handleNavigate = (view: string) => {
    setCurrentView(view);
  };

  const handleSelectServiceAndBook = (serviceId: string) => {
    setBookingService(serviceId as ServiceType);
    setCurrentView('booking');
  };

  const handleStartBookingWithParams = (serviceId: ServiceType, areaSize: AreaSize, options: string[]) => {
    setBookingService(serviceId);
    setBookingAreaSize(areaSize);
    setBookingOptions(options);
    setCurrentView('booking');
  };

  return (
    <AuthProvider>
      <BookingProvider>
        <div className="min-h-screen flex flex-col bg-slate-50 text-slate-800 font-sans pb-16 md:pb-0">
          
          {/* Header */}
          <Header
            currentView={currentView}
            onNavigate={handleNavigate}
            onOpenAuth={() => setAuthModalOpen(true)}
          />

          {/* Main Body View */}
          <main className="flex-1">
            {currentView === 'home' && (
              <HomeView
                onNavigate={handleNavigate}
                onSelectService={handleSelectServiceAndBook}
              />
            )}

            {currentView === 'services' && (
              <ServicesView
                onNavigate={handleNavigate}
                onSelectService={handleSelectServiceAndBook}
              />
            )}

            {currentView === 'pricing' && (
              <PricingView
                onNavigate={handleNavigate}
                onStartBookingWithParams={handleStartBookingWithParams}
              />
            )}

            {currentView === 'reviews' && (
              <ReviewsView
                onNavigate={handleNavigate}
                onOpenAuth={() => setAuthModalOpen(true)}
              />
            )}

            {currentView === 'faq' && (
              <FaqView
                onNavigate={handleNavigate}
              />
            )}

            {currentView === 'mypage' && (
              <MyPageView
                onNavigate={handleNavigate}
                onOpenAuth={() => setAuthModalOpen(true)}
              />
            )}

            {currentView === 'booking' && (
              <BookingView
                initialServiceId={bookingService}
                initialAreaSize={bookingAreaSize}
                initialOptions={bookingOptions}
                onNavigate={handleNavigate}
                onOpenAuth={() => setAuthModalOpen(true)}
              />
            )}

            {currentView === 'admin' && (
              <AdminView
                onNavigate={handleNavigate}
              />
            )}
          </main>

          {/* Footer */}
          <Footer onNavigate={handleNavigate} />

          {/* Sticky Mobile Reservation Bar */}
          <MobileReservationBar
            currentView={currentView}
            onReserve={() => setCurrentView('booking')}
          />

          {/* Auth Modal */}
          <AuthModal
            isOpen={authModalOpen}
            onClose={() => setAuthModalOpen(false)}
          />

        </div>
      </BookingProvider>
    </AuthProvider>
  );
}
