import React from 'react';
import { Sparkles, Award, Shield, Heart, Eye, ArrowRight } from 'lucide-react';

interface AboutPageProps {
  onNavigate: (page: string) => void;
}

export const AboutPage: React.FC<AboutPageProps> = ({ onNavigate }) => {
  const teamMembers = [
    {
      name: 'Éléonore Vance',
      role: 'Founder & Creative Director',
      bio: 'Former scenographer for the Paris National Opera, Éléonore founded Lumière to fuse haute couture design with flawless architectural event engineering.',
      image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80',
      location: 'Paris Atelier',
    },
    {
      name: 'Julien de Saint-Germain',
      role: 'Head of Scenography & Architecture',
      bio: 'Trained at École des Beaux-Arts, Julien oversees 3D spatial builds, lighting plots, and monument restoration conservation protocols.',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80',
      location: 'Paris & Lake Como',
    },
    {
      name: 'Camilla Montgomery',
      role: 'Director of Global Concierge',
      bio: 'With a decade in high-net-worth diplomatic protocol, Camilla orchestrates private aviation, chartered yachts, and bespoke villa buyouts.',
      image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=600&q=80',
      location: 'New York Studio',
    },
    {
      name: 'Matteo Bellini',
      role: 'Master Floral Couturier',
      bio: 'Renowned for dramatic botanical sculptures and garden archways, Matteo works with rare heirloom blooms sourced directly from Grasse and Holland.',
      image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=600&q=80',
      location: 'Milan & Lake Como',
    },
  ];

  const coreValues = [
    {
      icon: <Shield className="w-6 h-6 text-[#C9A227]" />,
      title: 'Discretion & Trust',
      desc: 'We operate under strict non-disclosure covenants, protecting the privacy of public figures, royal houses, and executive boards.',
    },
    {
      icon: <Eye className="w-6 h-6 text-[#C9A227]" />,
      title: 'Architectural Artistry',
      desc: 'Every celebration is treated as a bespoke temporal pavilion—harmonizing history, light, acoustics, and floral poetry.',
    },
    {
      icon: <Sparkles className="w-6 h-6 text-[#C9A227]" />,
      title: 'Unrelenting Precision',
      desc: 'Our minute-by-minute production schedules account for micro-climates, tide tables, and split-second cues.',
    },
    {
      icon: <Heart className="w-6 h-6 text-[#C9A227]" />,
      title: 'Soulful Exclusivity',
      desc: 'By capping our yearly calendar at twenty-four commissions, our leadership remains intimately devoted to your celebration.',
    },
  ];

  const awards = [
    { year: '2025', title: 'Top Global Wedding Planner', organization: 'Vogue Weddings International' },
    { year: '2024', title: 'Best Heritage Scenography Award', organization: 'European Architectural Heritage Society' },
    { year: '2023', title: 'Luxury Event Designer of the Decade', organization: 'Harper’s Bazaar Bride' },
    { year: '2022', title: 'Excellence in Diplomatic Hospitality', organization: 'Geneva Protocol Association' },
  ];

  return (
    <div className="pt-24 pb-20 bg-[#FAF7F2] text-[#1C1B1A]">
      {/* Hero & Brand Story */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <span className="text-xs uppercase tracking-[0.25em] text-[#C9A227] font-semibold block">
              The Heritage of Lumière
            </span>
            <h1 className="font-serif text-4xl sm:text-6xl font-light text-[#1C1B1A] leading-tight">
              Where Couture Artistry Meets Flawless Execution
            </h1>
            <p className="text-sm sm:text-base text-neutral-600 font-light leading-relaxed">
              Founded in 2014 by former opera scenographer Éléonore Vance, Lumière was born from a singular conviction: that life’s most momentous passages deserve the same grandeur, precision, and emotional resonance as opening night at the Opéra Garnier.
            </p>
            <p className="text-sm sm:text-base text-neutral-600 font-light leading-relaxed">
              Over the past decade, our atelier has grown from a Parisian design boutique into an internationally revered production house, curating sovereign weddings in Saint-Jean-Cap-Ferrat, high-jewelry exhibitions on Place Vendôme, and landmark galas at The Metropolitan Museum of Art.
            </p>

            <div className="pt-4 flex items-center gap-4">
              <button
                onClick={() => onNavigate('book')}
                className="px-6 py-3 rounded-full text-xs uppercase tracking-wider font-semibold bg-[#C9A227] hover:bg-[#d8b030] text-[#1C1B1A] transition-all"
              >
                Inquire For Your Date
              </button>
              <button
                onClick={() => onNavigate('pricing')}
                className="px-6 py-3 rounded-full text-xs uppercase tracking-wider font-medium border border-neutral-400 hover:border-[#1C1B1A] text-neutral-800 transition-colors"
              >
                View Packages
              </button>
            </div>
          </div>

          <div className="relative">
            <div className="aspect-[4/5] rounded-3xl overflow-hidden border border-neutral-300 shadow-2xl relative">
              <img
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=1000&q=85"
                alt="Éléonore Vance, Founder"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
              <div className="absolute bottom-6 left-6 right-6 text-white">
                <span className="text-xs uppercase tracking-widest text-[#C9A227] font-semibold block">
                  Founder & Creative Director
                </span>
                <h3 className="font-serif text-2xl font-light">Éléonore Vance</h3>
                <p className="text-xs text-neutral-300 italic font-light mt-1">
                  "True luxury is not loud; it is the effortless feeling that the entire universe was aligned in your honor for a single evening."
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Core Values */}
      <div className="bg-[#1C1B1A] text-[#FAF7F2] py-24 border-y border-[#C9A227]/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
            <span className="text-xs uppercase tracking-[0.25em] text-[#C9A227] font-semibold">
              The Lumière Philosophy
            </span>
            <h2 className="font-serif text-3xl sm:text-5xl font-light text-[#FAF7F2]">
              Our Guiding Principles
            </h2>
            <p className="text-xs sm:text-sm text-neutral-400">
              The foundational commitments that govern every commission we accept.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {coreValues.map((v, i) => (
              <div
                key={i}
                className="p-8 rounded-2xl bg-[#141312] border border-neutral-800 hover:border-[#C9A227]/40 transition-colors space-y-4"
              >
                <div className="w-12 h-12 rounded-xl bg-[#C9A227]/10 border border-[#C9A227]/30 flex items-center justify-center">
                  {v.icon}
                </div>
                <h3 className="font-serif text-xl font-medium text-white">{v.title}</h3>
                <p className="text-xs text-neutral-400 leading-relaxed font-light">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Team Cards */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
          <span className="text-xs uppercase tracking-[0.25em] text-[#C9A227] font-semibold">
            Masters of the Craft
          </span>
          <h2 className="font-serif text-3xl sm:text-5xl font-light text-[#1C1B1A]">
            The Leadership Atelier
          </h2>
          <p className="text-xs sm:text-sm text-neutral-600">
            A collective of world-class scenographers, protocol officers, and floral artists.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {teamMembers.map((member, i) => (
            <div
              key={i}
              className="bg-white rounded-2xl overflow-hidden border border-neutral-200 shadow-sm hover:shadow-lg transition-all"
            >
              <div className="aspect-[4/5] overflow-hidden">
                <img
                  src={member.image}
                  alt={member.name}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="p-6 space-y-2">
                <span className="text-[10px] uppercase tracking-wider text-[#C9A227] font-semibold block">
                  {member.location}
                </span>
                <h3 className="font-serif text-xl font-medium text-[#1C1B1A]">{member.name}</h3>
                <p className="text-xs text-neutral-500 font-medium">{member.role}</p>
                <p className="text-xs text-neutral-600 pt-2 border-t border-neutral-100 font-light leading-relaxed">
                  {member.bio}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Press & Awards Strip */}
      <div className="bg-[#FAF7F2] border-t border-neutral-300 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <span className="text-xs uppercase tracking-[0.25em] text-[#C9A227] font-semibold">
              Distinctions & Honors
            </span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {awards.map((a, i) => (
              <div
                key={i}
                className="p-6 rounded-xl bg-white border border-neutral-200 shadow-sm flex items-start gap-4"
              >
                <div className="p-2.5 rounded-lg bg-[#FAF7F2] border border-[#C9A227]/30 text-[#C9A227] shrink-0">
                  <Award className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[10px] uppercase tracking-wider text-neutral-500 font-bold">
                    {a.year} Honor
                  </span>
                  <h4 className="font-serif text-base font-medium text-[#1C1B1A] mt-0.5">
                    {a.title}
                  </h4>
                  <p className="text-xs text-neutral-500 mt-1">{a.organization}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
