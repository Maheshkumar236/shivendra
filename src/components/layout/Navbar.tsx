import React, { useState, useEffect } from 'react';
import { Menu, X, Sparkles, User, Shield, Calendar, ArrowRight } from 'lucide-react';
import { getCurrentUser } from '../../services/storage';
import { QuickRoleSwitcher } from '../ui/QuickRoleSwitcher';

interface NavbarProps {
  activePage: string;
  onNavigate: (page: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ activePage, onNavigate }) => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const currentUser = getCurrentUser();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 30);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { id: 'home', label: 'Home' },
    { id: 'services', label: 'Services' },
    { id: 'gallery', label: 'Gallery' },
    { id: 'about', label: 'About' },
    { id: 'pricing', label: 'Pricing' },
    { id: 'contact', label: 'Contact' },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-500 ${
        scrolled
          ? 'bg-[#1C1B1A]/90 backdrop-blur-xl border-b border-[#C9A227]/20 py-3 shadow-xl'
          : 'bg-[#1C1B1A]/75 backdrop-blur-md border-b border-white/5 py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* Brand Logo */}
        <button
          onClick={() => {
            onNavigate('home');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className="text-left group flex items-center gap-2.5 focus:outline-none"
          aria-label="Lumière Events Home"
        >
          <div className="w-8 h-8 rounded-full border border-[#C9A227]/50 flex items-center justify-center bg-[#C9A227]/10 group-hover:bg-[#C9A227]/20 transition-all">
            <Sparkles className="w-4 h-4 text-[#C9A227]" />
          </div>
          <div>
            <span className="font-serif text-xl sm:text-2xl font-light tracking-[0.22em] text-[#FAF7F2] uppercase block leading-none">
              LUMIÈRE
            </span>
            <span className="text-[9px] tracking-[0.35em] text-[#C9A227] uppercase block mt-1 font-medium">
              HAUTE EVENTS & ATELIER
            </span>
          </div>
        </button>

        {/* Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center gap-8" aria-label="Main Navigation">
          {navLinks.map((link) => (
            <button
              key={link.id}
              onClick={() => onNavigate(link.id)}
              className={`text-xs uppercase tracking-[0.18em] transition-all relative py-1 focus:outline-none ${
                activePage === link.id
                  ? 'text-[#C9A227] font-semibold'
                  : 'text-neutral-300 hover:text-[#FAF7F2]'
              }`}
            >
              {link.label}
              {activePage === link.id && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#C9A227] rounded-full animate-fade-in" />
              )}
            </button>
          ))}
        </nav>

        {/* Action Controls & Role Switcher */}
        <div className="hidden sm:flex items-center gap-3">
          {/* Quick Demo Persona Switcher */}
          <QuickRoleSwitcher onNavigate={onNavigate} />

          {/* Client Portal Link */}
          <button
            onClick={() => onNavigate('portal')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs transition-colors border ${
              activePage === 'portal'
                ? 'bg-[#C9A227]/20 border-[#C9A227] text-[#FAF7F2]'
                : 'border-neutral-700 hover:border-neutral-500 text-neutral-300 hover:text-white'
            }`}
            aria-label="Client Portal"
          >
            <User className="w-3.5 h-3.5 text-[#C9A227]" />
            <span>Portal</span>
          </button>

          {/* Admin Panel Link */}
          <button
            onClick={() => onNavigate('admin')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs transition-colors border ${
              activePage === 'admin'
                ? 'bg-[#C9A227]/20 border-[#C9A227] text-[#FAF7F2]'
                : 'border-neutral-700 hover:border-neutral-500 text-neutral-300 hover:text-white'
            }`}
            aria-label="Admin Panel"
          >
            <Shield className="w-3.5 h-3.5 text-[#C9A227]" />
            <span>Admin</span>
          </button>

          {/* Book Consultation Primary CTA */}
          <button
            onClick={() => onNavigate('book')}
            className="flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold tracking-wider uppercase bg-[#C9A227] hover:bg-[#d8b030] text-[#1C1B1A] transition-all transform hover:scale-[1.02] shadow-md shadow-[#C9A227]/10"
          >
            <span>Book Event</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Mobile Hamburger Button */}
        <div className="flex items-center gap-2 sm:hidden">
          <QuickRoleSwitcher onNavigate={onNavigate} />
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-neutral-300 hover:text-white focus:outline-none"
            aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="sm:hidden bg-[#1C1B1A] border-b border-[#C9A227]/20 px-6 py-6 space-y-4 animate-fade-in shadow-2xl">
          <div className="grid grid-cols-2 gap-2 pb-4 border-b border-neutral-800">
            {navLinks.map((link) => (
              <button
                key={link.id}
                onClick={() => {
                  onNavigate(link.id);
                  setMobileMenuOpen(false);
                }}
                className={`text-left text-sm uppercase tracking-wider py-2 px-3 rounded-lg ${
                  activePage === link.id
                    ? 'bg-[#C9A227]/15 text-[#C9A227] font-semibold'
                    : 'text-neutral-300 hover:bg-neutral-800'
                }`}
              >
                {link.label}
              </button>
            ))}
          </div>

          <div className="flex flex-col gap-2 pt-2">
            <button
              onClick={() => {
                onNavigate('portal');
                setMobileMenuOpen(false);
              }}
              className="flex items-center justify-between w-full px-4 py-2.5 rounded-lg border border-neutral-700 text-sm text-neutral-200"
            >
              <span className="flex items-center gap-2">
                <User className="w-4 h-4 text-[#C9A227]" />
                Client Portal
              </span>
              <span className="text-xs text-neutral-400">View Milestones & Documents</span>
            </button>

            <button
              onClick={() => {
                onNavigate('admin');
                setMobileMenuOpen(false);
              }}
              className="flex items-center justify-between w-full px-4 py-2.5 rounded-lg border border-neutral-700 text-sm text-neutral-200"
            >
              <span className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-[#C9A227]" />
                Admin Dashboard
              </span>
              <span className="text-xs text-neutral-400">Manage Bookings</span>
            </button>

            <button
              onClick={() => {
                onNavigate('book');
                setMobileMenuOpen(false);
              }}
              className="w-full mt-2 py-3 rounded-full text-center text-sm font-semibold tracking-wider uppercase bg-[#C9A227] text-[#1C1B1A]"
            >
              Book a Consultation
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
