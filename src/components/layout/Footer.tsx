import React, { useState } from 'react';
import { Sparkles, Mail, MapPin, Phone, Instagram, Linkedin, Heart, ArrowUp } from 'lucide-react';
import { useToast } from '../ui/Toast';

interface FooterProps {
  onNavigate: (page: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const { toast } = useToast();

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsletterEmail || !newsletterEmail.includes('@')) {
      toast({
        type: 'error',
        title: 'Invalid Email',
        message: 'Please provide a valid email address to receive our Gazette.',
      });
      return;
    }
    toast({
      type: 'success',
      title: 'Subscription Confirmed',
      message: 'You have been added to the private Lumière Gazette mailing list.',
    });
    setNewsletterEmail('');
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-[#141312] text-[#FAF7F2] border-t border-[#C9A227]/20 pt-20 pb-12 relative overflow-hidden">
      {/* Subtle gold ambient glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-24 bg-[#C9A227]/10 blur-3xl pointer-events-none rounded-full" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 pb-16 border-b border-neutral-800">
          {/* Brand Column */}
          <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full border border-[#C9A227]/50 flex items-center justify-center bg-[#C9A227]/10">
                <Sparkles className="w-4 h-4 text-[#C9A227]" />
              </div>
              <span className="font-serif text-2xl tracking-[0.25em] uppercase text-[#FAF7F2]">
                LUMIÈRE
              </span>
            </div>
            <p className="text-neutral-400 text-sm leading-relaxed max-w-sm font-light">
              Haute couture event planning and bespoke scenography for royalty, cultural luminaries, and discerning patrons worldwide. Unforgettable moments, flawlessly executed.
            </p>
            {/* Press strip badges */}
            <div className="pt-2">
              <span className="text-[10px] uppercase tracking-[0.2em] text-[#C9A227] block mb-2 font-medium">
                Featured In
              </span>
              <div className="flex flex-wrap items-center gap-4 text-xs tracking-widest text-neutral-400 font-serif uppercase">
                <span>Vogue Weddings</span>
                <span className="text-neutral-700">•</span>
                <span>Harper's Bazaar</span>
                <span className="text-neutral-700">•</span>
                <span>Architectural Digest</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="font-serif text-base tracking-wider text-[#C9A227] uppercase">
              The Atelier
            </h4>
            <ul className="space-y-2.5 text-xs tracking-wider text-neutral-400">
              <li>
                <button onClick={() => onNavigate('home')} className="hover:text-white transition-colors">
                  Home Portfolio
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('services')} className="hover:text-white transition-colors">
                  Curation & Services
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('gallery')} className="hover:text-white transition-colors">
                  Haute Gallery
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('about')} className="hover:text-white transition-colors">
                  About Éléonore & Team
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('pricing')} className="hover:text-white transition-colors">
                  Investment & Tiers
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('contact')} className="hover:text-white transition-colors">
                  Direct Inquiries
                </button>
              </li>
            </ul>
          </div>

          {/* Global Ateliers */}
          <div className="space-y-4">
            <h4 className="font-serif text-base tracking-wider text-[#C9A227] uppercase">
              Atelier Locations
            </h4>
            <div className="space-y-3 text-xs text-neutral-400 leading-relaxed font-light">
              <div>
                <p className="text-neutral-200 font-medium">Paris Atelier</p>
                <p>18 Place Vendôme, 75001 Paris, France</p>
              </div>
              <div>
                <p className="text-neutral-200 font-medium">Manhattan Studio</p>
                <p>767 Fifth Avenue, New York, NY 10153</p>
              </div>
              <div>
                <p className="text-neutral-200 font-medium">Lake Como Office</p>
                <p>Via Roma 12, Bellagio, Lake Como, Italy</p>
              </div>
            </div>
          </div>

          {/* Gazette Newsletter */}
          <div className="space-y-4">
            <h4 className="font-serif text-base tracking-wider text-[#C9A227] uppercase">
              The Lumière Gazette
            </h4>
            <p className="text-xs text-neutral-400 leading-relaxed">
              Curated inspirations, seasonal floral forecasts, and invitation-only previews sent quarterly.
            </p>
            <form onSubmit={handleNewsletterSubmit} className="space-y-2">
              <div className="relative">
                <input
                  type="email"
                  value={newsletterEmail}
                  onChange={(e) => setNewsletterEmail(e.target.value)}
                  placeholder="Enter your email address"
                  className="w-full px-3.5 py-2.5 rounded-lg bg-neutral-900 border border-neutral-700 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-[#C9A227] transition-colors"
                />
              </div>
              <button
                type="submit"
                className="w-full py-2 px-3 rounded-lg bg-[#C9A227] hover:bg-[#d6af32] text-[#1C1B1A] text-xs font-semibold uppercase tracking-wider transition-colors"
              >
                Join Private Gazette
              </button>
            </form>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-neutral-500">
          <p>© {new Date().getFullYear()} Lumière Events S.A.S. All rights reserved. Registered in Paris & New York.</p>
          <div className="flex items-center gap-6">
            <button
              onClick={() => onNavigate('portal')}
              className="hover:text-[#C9A227] transition-colors"
            >
              Client Portal
            </button>
            <button
              onClick={() => onNavigate('admin')}
              className="hover:text-[#C9A227] transition-colors"
            >
              Atelier Admin
            </button>
            <button
              onClick={scrollToTop}
              className="flex items-center gap-1.5 hover:text-[#C9A227] transition-colors"
              aria-label="Back to top"
            >
              <span>Back to Top</span>
              <ArrowUp className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
