import React, { useState } from 'react';
import { Sparkles, Check, ArrowRight, ShieldCheck, Clock, Users, MapPin } from 'lucide-react';

interface ServicesPageProps {
  onNavigate: (page: string, options?: { serviceId?: string; packageId?: string }) => void;
  initialServiceId?: string;
}

export const ServicesPage: React.FC<ServicesPageProps> = ({ onNavigate, initialServiceId = 'weddings' }) => {
  const [activeTab, setActiveTab] = useState<string>(initialServiceId);

  const servicesData = [
    {
      id: 'weddings',
      title: 'Haute Couture Weddings',
      tagline: 'Elegance woven with poetic romance and architectural splendor',
      heroImage: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1600&q=85',
      overview:
        'A wedding orchestrated by Lumière is not merely an event; it is a couture work of art. From ancestral European châteaux to oceanfront Mediterranean villas, our planners, lighting architects, and floral masters sculpt every second into an immortal memory.',
      deliverables: [
        'Complete creative vision: mood boards, custom textures, spatial layout & lighting design',
        'Private venue buyout negotiations and heritage conservation liaison',
        'Exclusive access to world-renowned floral couturiers and bespoke stationery calligraphers',
        'Tasting sessions with Michelin-starred chefs and master sommeliers',
        'Bridal atelier concierge: couture gown fittings, makeup artist rehearsals, hair styling',
        'Guest hospitality suite: private villa allocations, charter transport, welcome gifts',
        'Minute-by-minute day-of production with lead producer and four senior coordinators',
      ],
      recommendedTier: 'Signature',
      typicalInvestment: 'Starting from $38,000 curation retainer',
      testimonial: {
        text: 'Lumière took our breath away. Our guests from New York, London, and Tokyo are still talking about the candlelight banquet in Saint-Jean-Cap-Ferrat.',
        author: 'Clara & Antoine Dupont-Laurent',
      },
    },
    {
      id: 'corporate',
      title: 'High-Level Corporate Summits',
      tagline: 'Discreet, high-impact gatherings for global visionaries',
      heroImage: 'https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=1600&q=85',
      overview:
        'When heads of state, board chairpersons, and visionary founders convene, precision is paramount. We engineer immersive summits, private shareholder conclaves, and high-jewelry debuts that reflect your brand’s unparalleled status.',
      deliverables: [
        'End-to-end venue selection with rigorous physical security and non-disclosure protocols',
        'Acoustic architecture, multi-language simultaneous interpretation booths, and broadcast staging',
        'VIP dignitary motorcade coordination and airport tarmac liaison',
        'Executive seated banquets with custom culinary pairings',
        'Bespoke digital registration portals and encrypted badge credentials',
        'Discreet media handling and embargo management',
      ],
      recommendedTier: 'Signature',
      typicalInvestment: 'Starting from $25,000 curation retainer',
      testimonial: {
        text: 'The absolute pinnacle of corporate discretion and executive hospitality. Flawless audio-visuals and zero friction.',
        author: 'Maison Cartier Executive Committee',
      },
    },
    {
      id: 'galas',
      title: 'Cultural Galas & Philanthropy',
      tagline: 'Magnificent spectacles that inspire generosity and awe',
      heroImage: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=1600&q=85',
      overview:
        'Lumière is honored to partner with premier museums, foundations, and cultural institutions to produce fundraising galas that surpass donation records while providing patrons with an indelible artistic immersion.',
      deliverables: [
        'Historic museum and heritage landmark buyouts and permits',
        'Immersive thematic scenography and monumental floral art installations',
        'Live entertainment curation: philharmonic ensembles, operatic soloists, headline talent',
        'Auctioneer staging, paddle design, and live digital bid tracking',
        'Red carpet arrival step-and-repeat with curated celebrity press line',
        'Multi-course seated gourmet banquets for 200 to 1,000+ patrons',
      ],
      recommendedTier: 'Signature',
      typicalInvestment: 'Starting from $45,000 curation retainer',
      testimonial: {
        text: 'Our philanthropic gala at The Temple of Dendur exceeded our fundraising goals by 40% thanks to the enchanting atmosphere created by Lumière.',
        author: 'Marcus Thorne, Trustee',
      },
    },
    {
      id: 'destination',
      title: 'Global Destination Soirées',
      tagline: 'Effortless luxury anywhere your imagination calls',
      heroImage: 'https://images.unsplash.com/photo-1520854221256-17451cc331bf?auto=format&fit=crop&w=1600&q=85',
      overview:
        'Whether taking over an entire private island in the Caribbean, a historic palazzo on Venice’s Grand Canal, or a snow-capped chalet in St. Moritz, our multilingual destination team handles international logistics with seamless grace.',
      deliverables: [
        'On-the-ground scouting and local municipality permitting across 15+ countries',
        'Private jet charter coordinating, luxury yacht transfers, and luggage logistics',
        'Multi-day itinerary curation: welcome dinners, regattas, main celebrations, farewell brunches',
        'Importation and custom fabrication of floral, lighting, and stage elements',
        '24/7 dedicated concierge desk for all international guests',
        'Emergency medical team and close-protection security on site',
      ],
      recommendedTier: 'Bespoke',
      typicalInvestment: 'Starting from $75,000 curation retainer',
      testimonial: {
        text: 'Our three-day Lake Como wedding was seamless despite complex maritime logistics. Éléonore Vance is simply unmatched.',
        author: 'Lord & Lady Spencer',
      },
    },
  ];

  const current = servicesData.find((s) => s.id === activeTab) || servicesData[0];

  return (
    <div className="pt-24 pb-20 bg-[#FAF7F2] text-[#1C1B1A]">
      {/* Page Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12 text-center space-y-4">
        <span className="text-xs uppercase tracking-[0.25em] text-[#C9A227] font-semibold">
          Curated Offerings
        </span>
        <h1 className="font-serif text-4xl sm:text-6xl font-light text-[#1C1B1A]">
          Our Pillars of Excellence
        </h1>
        <p className="max-w-2xl mx-auto text-sm sm:text-base text-neutral-600 font-light">
          Each celebration is custom-tailored to the architectural characteristics of your venue and the intimate narrative of your occasion.
        </p>

        {/* Tab Switcher */}
        <div className="flex flex-wrap items-center justify-center gap-2 pt-6">
          {servicesData.map((s) => (
            <button
              key={s.id}
              onClick={() => setActiveTab(s.id)}
              className={`px-5 py-2.5 rounded-full text-xs font-medium tracking-wider uppercase transition-all ${
                activeTab === s.id
                  ? 'bg-[#1C1B1A] text-[#FAF7F2] shadow-md border border-[#C9A227]/50'
                  : 'bg-white hover:bg-neutral-100 text-neutral-700 border border-neutral-200'
              }`}
            >
              {s.title}
            </button>
          ))}
        </div>
      </div>

      {/* Active Service Showcase */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-3xl overflow-hidden border border-neutral-200 shadow-xl">
          {/* Hero Banner with Title Overlay */}
          <div className="relative h-80 sm:h-96 w-full overflow-hidden">
            <img
              src={current.heroImage}
              alt={current.title}
              className="w-full h-full object-cover filter brightness-[0.7]"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent" />
            <div className="absolute bottom-8 left-6 sm:left-12 right-6">
              <span className="text-xs uppercase tracking-[0.25em] text-[#C9A227] font-semibold block mb-2">
                {current.typicalInvestment}
              </span>
              <h2 className="font-serif text-3xl sm:text-5xl text-white font-light">
                {current.title}
              </h2>
              <p className="text-sm text-neutral-300 italic font-serif mt-2">
                "{current.tagline}"
              </p>
            </div>
          </div>

          {/* Service Details & Deliverables */}
          <div className="p-6 sm:p-12 grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Overview & Deliverables */}
            <div className="lg:col-span-2 space-y-8">
              <div>
                <h3 className="font-serif text-2xl font-medium text-[#1C1B1A] mb-4">
                  The Atelier Vision
                </h3>
                <p className="text-sm text-neutral-600 leading-relaxed font-light">
                  {current.overview}
                </p>
              </div>

              <div>
                <h4 className="font-serif text-lg font-medium text-[#1C1B1A] mb-4 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-[#C9A227]" />
                  What Is Included
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {current.deliverables.map((item, idx) => (
                    <div
                      key={idx}
                      className="flex items-start gap-3 p-3.5 rounded-xl bg-[#FAF7F2] border border-neutral-200/80 text-xs text-neutral-700 leading-relaxed"
                    >
                      <Check className="w-4 h-4 text-[#C9A227] shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Quote */}
              <div className="p-6 rounded-2xl bg-[#1C1B1A] text-[#FAF7F2] border-l-4 border-[#C9A227]">
                <p className="font-serif text-base italic leading-relaxed text-neutral-300">
                  "{current.testimonial.text}"
                </p>
                <p className="text-xs text-[#C9A227] uppercase tracking-wider mt-3 font-semibold">
                  — {current.testimonial.author}
                </p>
              </div>
            </div>

            {/* Sidebar Card: Investment & Next Steps */}
            <div className="space-y-6">
              <div className="p-8 rounded-2xl bg-[#FAF7F2] border border-neutral-300 space-y-6">
                <div>
                  <span className="text-[10px] uppercase tracking-widest text-neutral-500 block">
                    Recommended Package
                  </span>
                  <div className="font-serif text-2xl text-[#1C1B1A] font-medium mt-1">
                    {current.recommendedTier} Atelier Tier
                  </div>
                  <p className="text-xs text-neutral-600 mt-2">
                    Customized production package engineered specifically for {current.title.toLowerCase()}.
                  </p>
                </div>

                <div className="space-y-3 pt-4 border-t border-neutral-200 text-xs text-neutral-600">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-[#C9A227]" />
                    <span>Comprehensive Insurance & Permitting</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-[#C9A227]" />
                    <span>Average 6-12 Months Lead Curation</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-[#C9A227]" />
                    <span>Max 24 Commissions Annually</span>
                  </div>
                </div>

                <div className="pt-2 flex flex-col gap-3">
                  <button
                    onClick={() => onNavigate('book')}
                    className="w-full py-3.5 px-4 rounded-full text-xs font-semibold uppercase tracking-wider bg-[#C9A227] hover:bg-[#d8b030] text-[#1C1B1A] transition-all flex items-center justify-center gap-2"
                  >
                    <span>Reserve Date for {current.title.split(' ')[0]}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => onNavigate('pricing')}
                    className="w-full py-3 px-4 rounded-full text-xs font-medium uppercase tracking-wider border border-neutral-400 hover:border-[#1C1B1A] text-neutral-700 transition-colors text-center"
                  >
                    Compare All 3 Pricing Tiers
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
