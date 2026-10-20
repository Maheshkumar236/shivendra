import React, { useState } from 'react';
import {
  Sparkles,
  ArrowRight,
  Calendar,
  Award,
  CheckCircle,
  Star,
  ChevronLeft,
  ChevronRight,
  Shield,
  Clock,
  Compass,
  HeartHandshake,
} from 'lucide-react';
import { SEED_GALLERY } from '../../data/seedData';
import { GalleryImage } from '../../types/index';

interface HomePageProps {
  onNavigate: (page: string, options?: { serviceId?: string; galleryId?: string }) => void;
  onOpenLightbox?: (img: GalleryImage) => void;
}

export const HomePage: React.FC<HomePageProps> = ({ onNavigate, onOpenLightbox }) => {
  const [activeTestimonial, setActiveTestimonial] = useState(0);

  const testimonials = [
    {
      quote:
        'Éléonore and the Lumière team orchestrated our three-day celebration at Villa Ephrussi with an artistry and precision that left even our most discerning international guests speechless. Every single minute was sheer poetry.',
      author: 'Countess Clara Dupont-Laurent',
      event: 'French Riviera Nuptials • Saint-Jean-Cap-Ferrat',
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=300&q=80',
      rating: 5,
    },
    {
      quote:
        'Executing our 400-guest Global Philanthropy Gala inside The Metropolitan Museum was a logistical feat requiring diplomatic security, bespoke lighting, and flawless catering. Lumière delivered absolute perfection.',
      author: 'Marcus Thorne',
      event: 'Temple of Dendur Gala • New York City',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80',
      rating: 5,
    },
    {
      quote:
        'From private Riva boat arrivals across Lake Como to the midnight fireworks over Bellagio, Lumière created an unforgettable masterpiece. Our wedding was beyond any dream we could have conceived.',
      author: 'Lord Henry & Lady Sophia Spencer',
      event: 'Villa Balbiano Destination Wedding • Lake Como',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
      rating: 5,
    },
  ];

  const featuredGallery = SEED_GALLERY.slice(0, 6);

  const services = [
    {
      id: 'weddings',
      title: 'Haute Couture Weddings',
      desc: 'Bespoke ceremonies, architectural floral installations, and multi-day celebrations at historic châteaux and private estates.',
      image: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=800&q=80',
      tag: 'From $38,000',
    },
    {
      id: 'corporate',
      title: 'High-Level Corporate Summits',
      desc: 'Executive forums, private collector showcases, and luxury brand launches executed with flawless discretion.',
      image: 'https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=800&q=80',
      tag: 'From $25,000',
    },
    {
      id: 'galas',
      title: 'Cultural Galas & Philanthropy',
      desc: 'Grand black-tie balls, museum buyouts, and benefit evenings with bespoke scenography and white-glove hospitality.',
      image: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=800&q=80',
      tag: 'From $45,000',
    },
    {
      id: 'destination',
      title: 'Global Destination Soirées',
      desc: 'Turnkey international productions across the Amalfi Coast, French Riviera, Swiss Alps, and private island retreats.',
      image: 'https://images.unsplash.com/photo-1520854221256-17451cc331bf?auto=format&fit=crop&w=800&q=80',
      tag: 'From $65,000',
    },
  ];

  const processSteps = [
    {
      step: '01',
      title: 'Private Consultation',
      desc: 'An intimate exploratory dialogue in Paris, Manhattan, or virtually to articulate your vision, aesthetic desires, and parameters.',
    },
    {
      step: '02',
      title: 'Scenography & Design',
      desc: 'Our architectural team produces bespoke 3D spatial renderings, lighting plots, floral mood boards, and sensory concepts.',
    },
    {
      step: '03',
      title: 'Production Engineering',
      desc: 'Contract negotiations, culinary tastings, guest concierge management, and a minute-by-minute master itinerary.',
    },
    {
      step: '04',
      title: 'Flawless Celebration',
      desc: 'White-glove on-site leadership ensures you and your honored guests experience pure transcendence without distraction.',
    },
  ];

  return (
    <div className="w-full">
      {/* Cinematic Hero Section */}
      <section className="relative min-h-[92vh] sm:min-h-screen flex items-center justify-center overflow-hidden bg-[#1C1B1A] text-[#FAF7F2] pt-20">
        {/* Cinematic Backdrop Image with Luxury Gradients */}
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=2000&q=90"
            alt="Lumière Luxury Event Scenography"
            className="w-full h-full object-cover object-center filter brightness-[0.45] scale-105 animate-pulse-slow"
          />
          {/* Radial and Linear Vignettes */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#1C1B1A] via-black/40 to-black/70" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(201,162,39,0.15)_0%,transparent_70%)]" />
        </div>

        {/* Hero Content */}
        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8 py-16">
          {/* Luxury Badge */}
          <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full border border-[#C9A227]/40 bg-[#1C1B1A]/80 backdrop-blur-md shadow-lg shadow-black/40 animate-fade-in">
            <Sparkles className="w-4 h-4 text-[#C9A227]" />
            <span className="text-[11px] sm:text-xs uppercase tracking-[0.25em] text-[#C9A227] font-medium">
              World-Renowned Event Management & Scenography
            </span>
          </div>

          {/* Primary Tagline */}
          <div className="space-y-4">
            <h1 className="font-serif text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-light tracking-tight text-[#FAF7F2] leading-[1.08]">
              Unforgettable Moments, <br />
              <span className="italic font-normal gold-gradient-text">
                Flawlessly Executed.
              </span>
            </h1>
            <p className="max-w-2xl mx-auto text-sm sm:text-base md:text-lg text-neutral-300 font-light tracking-wide leading-relaxed">
              From palatial Mediterranean châteaux to legendary museum galas, Lumière orchestrates transcendent celebrations for royalty, innovators, and patrons of culture.
            </p>
          </div>

          {/* Dual CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 pt-4">
            <button
              onClick={() => onNavigate('book')}
              className="w-full sm:w-auto px-8 py-4 rounded-full text-xs sm:text-sm font-semibold uppercase tracking-[0.2em] bg-[#C9A227] hover:bg-[#d8b030] text-[#1C1B1A] shadow-lg shadow-[#C9A227]/20 transition-all transform hover:-translate-y-0.5 flex items-center justify-center gap-2"
            >
              <span>Book a Consultation</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => onNavigate('gallery')}
              className="w-full sm:w-auto px-8 py-4 rounded-full text-xs sm:text-sm font-medium uppercase tracking-[0.2em] border border-neutral-400/60 hover:border-[#C9A227] hover:text-[#C9A227] text-[#FAF7F2] backdrop-blur-sm transition-all"
            >
              View Our Work
            </button>
          </div>

          {/* Trust Highlights */}
          <div className="pt-8 flex flex-wrap items-center justify-center gap-6 sm:gap-12 text-xs tracking-widest text-neutral-400 uppercase font-light">
            <span className="flex items-center gap-2">
              <Award className="w-3.5 h-3.5 text-[#C9A227]" />
              Vogue World Top Planner
            </span>
            <span className="flex items-center gap-2">
              <Shield className="w-3.5 h-3.5 text-[#C9A227]" />
              Absolute Confidentiality
            </span>
            <span className="flex items-center gap-2">
              <Compass className="w-3.5 h-3.5 text-[#C9A227]" />
              Paris • New York • Lake Como
            </span>
          </div>
        </div>
      </section>

      {/* Animated Stats Bar */}
      <section className="bg-[#141312] border-y border-[#C9A227]/20 py-10 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center divide-y md:divide-y-0 md:divide-x divide-neutral-800">
            <div className="pt-4 md:pt-0">
              <div className="font-serif text-3xl sm:text-4xl lg:text-5xl font-light text-[#C9A227]">
                500+
              </div>
              <p className="text-[11px] sm:text-xs uppercase tracking-[0.2em] text-neutral-400 mt-2 font-medium">
                Haute Events Produced
              </p>
            </div>
            <div className="pt-4 md:pt-0">
              <div className="font-serif text-3xl sm:text-4xl lg:text-5xl font-light text-[#C9A227]">
                12
              </div>
              <p className="text-[11px] sm:text-xs uppercase tracking-[0.2em] text-neutral-400 mt-2 font-medium">
                Years of Master Artistry
              </p>
            </div>
            <div className="pt-4 md:pt-0">
              <div className="font-serif text-3xl sm:text-4xl lg:text-5xl font-light text-[#C9A227]">
                98%
              </div>
              <p className="text-[11px] sm:text-xs uppercase tracking-[0.2em] text-neutral-400 mt-2 font-medium">
                Client Delight & Retention
              </p>
            </div>
            <div className="pt-4 md:pt-0">
              <div className="font-serif text-3xl sm:text-4xl lg:text-5xl font-light text-[#C9A227]">
                28
              </div>
              <p className="text-[11px] sm:text-xs uppercase tracking-[0.2em] text-neutral-400 mt-2 font-medium">
                International Design Honors
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Services Preview Grid */}
      <section className="py-24 bg-[#FAF7F2] text-[#1C1B1A]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
            <div className="space-y-3">
              <span className="text-xs uppercase tracking-[0.25em] text-[#C9A227] font-semibold block">
                Atelier Services
              </span>
              <h2 className="font-serif text-3xl sm:text-5xl font-light text-[#1C1B1A] tracking-tight">
                Curated With Singular Distinction
              </h2>
            </div>
            <button
              onClick={() => onNavigate('services')}
              className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-[#1C1B1A] font-semibold hover:text-[#C9A227] transition-colors pb-1 border-b border-[#1C1B1A] hover:border-[#C9A227]"
            >
              <span>Explore All Tiers</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {services.map((srv) => (
              <div
                key={srv.id}
                onClick={() => onNavigate('services', { serviceId: srv.id })}
                className="group cursor-pointer bg-white rounded-2xl overflow-hidden border border-[#1C1B1A]/10 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
              >
                <div className="relative aspect-[4/3] overflow-hidden">
                  <img
                    src={srv.image}
                    alt={srv.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-[#1C1B1A]/80 backdrop-blur-md text-[10px] text-[#C9A227] font-medium tracking-wider uppercase">
                    {srv.tag}
                  </div>
                </div>
                <div className="p-6 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="font-serif text-xl font-medium text-[#1C1B1A] group-hover:text-[#C9A227] transition-colors">
                      {srv.title}
                    </h3>
                    <p className="text-xs text-neutral-600 mt-2 leading-relaxed">
                      {srv.desc}
                    </p>
                  </div>
                  <div className="pt-6 flex items-center justify-between text-xs text-[#C9A227] font-medium uppercase tracking-wider">
                    <span>View Service Atelier</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Gallery Strip with Lightbox Trigger */}
      <section className="py-20 bg-[#1C1B1A] text-[#FAF7F2] border-t border-[#C9A227]/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14 space-y-3">
            <span className="text-xs uppercase tracking-[0.25em] text-[#C9A227] font-semibold">
              The Portfolio
            </span>
            <h2 className="font-serif text-3xl sm:text-5xl font-light text-[#FAF7F2]">
              A Glimpse into Our Masterpieces
            </h2>
            <p className="text-xs sm:text-sm text-neutral-400">
              Each production is an intimate conversation between architecture, floral majesty, and emotion.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredGallery.map((img) => (
              <div
                key={img.id}
                onClick={() => onOpenLightbox ? onOpenLightbox(img) : onNavigate('gallery')}
                className="group relative aspect-[4/3] rounded-xl overflow-hidden cursor-pointer border border-neutral-800 shadow-lg"
              >
                <img
                  src={img.url}
                  alt={img.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent opacity-80 group-hover:opacity-95 transition-opacity" />
                <div className="absolute bottom-4 left-4 right-4 text-left">
                  <span className="text-[10px] uppercase tracking-wider text-[#C9A227] font-medium block">
                    {img.category} • {img.location}
                  </span>
                  <h3 className="font-serif text-lg text-white font-medium group-hover:text-[#FAF7F2] transition-colors mt-0.5">
                    {img.title}
                  </h3>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <button
              onClick={() => onNavigate('gallery')}
              className="px-8 py-3.5 rounded-full text-xs uppercase tracking-[0.2em] font-medium border border-[#C9A227]/60 text-[#C9A227] hover:bg-[#C9A227] hover:text-[#1C1B1A] transition-all"
            >
              Explore Complete 20+ Image Archive
            </button>
          </div>
        </div>
      </section>

      {/* 4-Step Process Section */}
      <section className="py-24 bg-[#FAF7F2] text-[#1C1B1A]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
            <span className="text-xs uppercase tracking-[0.25em] text-[#C9A227] font-semibold">
              The Lumière Method
            </span>
            <h2 className="font-serif text-3xl sm:text-5xl font-light text-[#1C1B1A]">
              How Your Event Comes to Life
            </h2>
            <p className="text-xs sm:text-sm text-neutral-600">
              A bespoke, transparent four-stage trajectory from initial conception to standing ovation.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {processSteps.map((step) => (
              <div
                key={step.step}
                className="p-8 rounded-2xl bg-white border border-[#1C1B1A]/10 shadow-sm hover:border-[#C9A227]/50 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="font-serif text-3xl font-light text-[#C9A227] mb-4">
                    {step.step}
                  </div>
                  <h3 className="font-serif text-xl font-medium text-[#1C1B1A] mb-2">
                    {step.title}
                  </h3>
                  <p className="text-xs text-neutral-600 leading-relaxed font-light">
                    {step.desc}
                  </p>
                </div>
                <div className="mt-6 pt-4 border-t border-neutral-100 flex items-center gap-1.5 text-[10px] text-neutral-400 uppercase tracking-wider">
                  <CheckCircle className="w-3.5 h-3.5 text-[#C9A227]" />
                  <span>Curated Milestone</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Carousel */}
      <section className="py-24 bg-[#141312] text-[#FAF7F2] relative overflow-hidden border-t border-[#C9A227]/20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <div className="inline-flex items-center gap-1 mb-6">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="w-4 h-4 fill-[#C9A227] text-[#C9A227]" />
            ))}
          </div>

          {/* Testimonial Quote */}
          <div className="min-h-[160px] flex items-center justify-center">
            <p className="font-serif text-xl sm:text-2xl md:text-3xl font-light leading-relaxed italic text-neutral-200">
              "{testimonials[activeTestimonial].quote}"
            </p>
          </div>

          {/* Client Details */}
          <div className="mt-8 flex flex-col items-center justify-center gap-3">
            <div className="w-14 h-14 rounded-full overflow-hidden border-2 border-[#C9A227]/60 shadow-lg">
              <img
                src={testimonials[activeTestimonial].avatar}
                alt={testimonials[activeTestimonial].author}
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <h4 className="font-serif text-lg font-medium text-[#FAF7F2]">
                {testimonials[activeTestimonial].author}
              </h4>
              <p className="text-xs text-[#C9A227] tracking-wider uppercase mt-0.5">
                {testimonials[activeTestimonial].event}
              </p>
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center justify-center gap-4 mt-10">
            <button
              onClick={() =>
                setActiveTestimonial((prev) => (prev === 0 ? testimonials.length - 1 : prev - 1))
              }
              className="p-2 rounded-full border border-neutral-700 hover:border-[#C9A227] text-neutral-400 hover:text-white transition-colors"
              aria-label="Previous testimonial"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <div className="flex gap-2">
              {testimonials.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveTestimonial(idx)}
                  className={`w-2.5 h-2.5 rounded-full transition-all ${
                    idx === activeTestimonial ? 'bg-[#C9A227] w-6' : 'bg-neutral-700'
                  }`}
                  aria-label={`Go to slide ${idx + 1}`}
                />
              ))}
            </div>
            <button
              onClick={() =>
                setActiveTestimonial((prev) => (prev === testimonials.length - 1 ? 0 : prev + 1))
              }
              className="p-2 rounded-full border border-neutral-700 hover:border-[#C9A227] text-neutral-400 hover:text-white transition-colors"
              aria-label="Next testimonial"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </section>

      {/* Grand Pre-Footer CTA */}
      <section className="py-20 bg-gradient-to-r from-[#1C1B1A] via-[#2A261F] to-[#1C1B1A] text-center text-[#FAF7F2] border-t border-[#C9A227]/30">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          <span className="text-xs uppercase tracking-[0.25em] text-[#C9A227] font-semibold">
            Limited Annual Commissions
          </span>
          <h2 className="font-serif text-3xl sm:text-5xl font-light text-white leading-tight">
            Begin Your Event Journey With Lumière
          </h2>
          <p className="text-neutral-300 text-sm max-w-xl mx-auto font-light leading-relaxed">
            To ensure uncompromised devotion, our atelier accepts only twenty-four bespoke commissions each calendar year. Secure your date early.
          </p>
          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={() => onNavigate('book')}
              className="px-8 py-4 rounded-full text-xs sm:text-sm font-semibold uppercase tracking-[0.2em] bg-[#C9A227] hover:bg-[#d8b030] text-[#1C1B1A] shadow-xl shadow-[#C9A227]/20 transition-all transform hover:scale-[1.02]"
            >
              Check Availability & Book
            </button>
            <button
              onClick={() => onNavigate('contact')}
              className="px-8 py-4 rounded-full text-xs sm:text-sm font-medium uppercase tracking-[0.2em] border border-neutral-500 text-white hover:border-[#C9A227] hover:text-[#C9A227] transition-all"
            >
              Request Private Callback
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
