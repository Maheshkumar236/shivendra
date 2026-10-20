import React from 'react';
import { Check, Sparkles, ArrowRight, ShieldCheck, HelpCircle } from 'lucide-react';
import { SEED_PACKAGES } from '../../data/seedData';
import { PackageTier } from '../../types/index';

interface PricingPageProps {
  onNavigate: (page: string, options?: { packageId?: 'Essential' | 'Signature' | 'Bespoke' }) => void;
}

export const PricingPage: React.FC<PricingPageProps> = ({ onNavigate }) => {
  const comparisonMatrix = [
    { feature: 'Dedicated Lead Producer & Director', essential: 'Lead Planner', signature: 'Senior Producer', bespoke: 'Éléonore Vance (Founder)' },
    { feature: 'On-Site Production Assistants', essential: '2 Coordinators', signature: '4 Senior Coordinators', bespoke: 'Full Dedicated Production Crew' },
    { feature: 'Planning Horizon & Handover', essential: '60 Days Prior', signature: 'Full 12-Month Curation', bespoke: 'Unlimited / Multi-Year Horizon' },
    { feature: 'Bespoke 3D Spatial & Lighting Renderings', essential: false, signature: true, bespoke: true },
    { feature: 'Floral Scenography Architecture', essential: 'Coordination', signature: 'Custom Design Direction', bespoke: 'Haute Couture Fabrication' },
    { feature: 'Multi-Day Weekend Coverage', essential: false, signature: '3 Events (Welcome, Day, Brunch)', bespoke: 'Full Week / Island Buyout' },
    { feature: 'Private Aviation & Villa Concierge', essential: false, signature: 'VIP Transfers', bespoke: 'Comprehensive Charter Logistics' },
    { feature: 'Sommelier & Michelin Chef Pairing Ateliers', essential: false, signature: true, bespoke: true },
    { feature: 'Bespoke Keepsake Fine Art Hardcover Book', essential: false, signature: false, bespoke: true },
    { feature: 'Calendar Date Retainer Hold', essential: '20% Deposit', signature: '20% Deposit', bespoke: '20% Deposit' },
  ];

  return (
    <div className="pt-24 pb-20 bg-[#FAF7F2] text-[#1C1B1A]">
      {/* Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16 text-center space-y-4">
        <span className="text-xs uppercase tracking-[0.25em] text-[#C9A227] font-semibold">
          Transparent Investment
        </span>
        <h1 className="font-serif text-4xl sm:text-6xl font-light text-[#1C1B1A]">
          Curation Tiers & Packages
        </h1>
        <p className="max-w-2xl mx-auto text-sm sm:text-base text-neutral-600 font-light">
          We believe in straightforward, transparent production retainers without hidden markups or kickbacks. A 20% deposit locks in your date on our master calendar.
        </p>
      </div>

      {/* 3 Tier Cards */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-24">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
          {SEED_PACKAGES.map((pkg) => (
            <div
              key={pkg.id}
              className={`rounded-3xl p-8 flex flex-col justify-between transition-all duration-300 relative ${
                pkg.popular
                  ? 'bg-[#1C1B1A] text-[#FAF7F2] shadow-2xl border-2 border-[#C9A227] lg:-translate-y-3'
                  : 'bg-white text-[#1C1B1A] border border-neutral-300 shadow-sm hover:shadow-lg'
              }`}
            >
              {pkg.popular && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-[#C9A227] text-[#1C1B1A] text-[11px] font-bold uppercase tracking-wider shadow-md">
                  Most Requested Tier
                </div>
              )}

              <div>
                <div className="mb-6">
                  <span
                    className={`text-[11px] uppercase tracking-[0.2em] font-semibold block ${
                      pkg.popular ? 'text-[#C9A227]' : 'text-neutral-500'
                    }`}
                  >
                    {pkg.subtitle}
                  </span>
                  <h3
                    className={`font-serif text-3xl font-light mt-1 ${
                      pkg.popular ? 'text-white' : 'text-[#1C1B1A]'
                    }`}
                  >
                    {pkg.name}
                  </h3>
                </div>

                <div className="py-4 border-y border-neutral-200/20 mb-6">
                  <div className="flex items-baseline gap-2">
                    <span className="text-sm font-light uppercase tracking-wider">Starting at</span>
                    <span
                      className={`font-serif text-4xl font-light ${
                        pkg.popular ? 'text-[#C9A227]' : 'text-[#1C1B1A]'
                      }`}
                    >
                      ${pkg.priceStartingAt.toLocaleString()}
                    </span>
                  </div>
                  <p className="text-[11px] text-neutral-400 mt-1">
                    Retainer covers full atelier team & planning suite • {pkg.depositPercentage}% deposit to lock date
                  </p>
                </div>

                <p
                  className={`text-xs leading-relaxed font-light mb-6 ${
                    pkg.popular ? 'text-neutral-300' : 'text-neutral-600'
                  }`}
                >
                  {pkg.description}
                </p>

                {/* Features list */}
                <div className="space-y-3 mb-8">
                  <span
                    className={`text-[10px] uppercase tracking-wider font-semibold block ${
                      pkg.popular ? 'text-[#C9A227]' : 'text-neutral-500'
                    }`}
                  >
                    Tier Inclusions:
                  </span>
                  {pkg.features.map((feat, idx) => (
                    <div key={idx} className="flex items-start gap-2.5 text-xs leading-relaxed">
                      <Check
                        className={`w-4 h-4 shrink-0 mt-0.5 ${
                          pkg.popular ? 'text-[#C9A227]' : 'text-emerald-700'
                        }`}
                      />
                      <span className={pkg.popular ? 'text-neutral-300' : 'text-neutral-700'}>
                        {feat}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <button
                  onClick={() => onNavigate('book', { packageId: pkg.id })}
                  className={`w-full py-4 rounded-full text-xs uppercase tracking-[0.2em] font-semibold transition-all flex items-center justify-center gap-2 ${
                    pkg.popular
                      ? 'bg-[#C9A227] hover:bg-[#d8b030] text-[#1C1B1A] shadow-lg shadow-[#C9A227]/20'
                      : 'bg-[#1C1B1A] hover:bg-neutral-800 text-[#FAF7F2]'
                  }`}
                >
                  <span>Select {pkg.id} Package</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
                <p className="text-[10px] text-center text-neutral-400 mt-2 font-light">
                  {pkg.recommendedFor}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Feature Comparison Table Matrix */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10 space-y-2">
          <span className="text-xs uppercase tracking-[0.25em] text-[#C9A227] font-semibold">
            Side-by-Side Breakdown
          </span>
          <h2 className="font-serif text-3xl font-light text-[#1C1B1A]">
            Detailed Feature Comparison
          </h2>
        </div>

        <div className="overflow-x-auto bg-white rounded-2xl border border-neutral-300 shadow-md">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-[#1C1B1A] text-[#FAF7F2] border-b border-[#C9A227]/30">
                <th className="p-4 sm:p-5 font-serif text-sm tracking-wider w-1/3">Service Provision</th>
                <th className="p-4 sm:p-5 font-serif text-sm tracking-wider text-center">Essential</th>
                <th className="p-4 sm:p-5 font-serif text-sm tracking-wider text-center text-[#C9A227]">
                  Signature (Popular)
                </th>
                <th className="p-4 sm:p-5 font-serif text-sm tracking-wider text-center">Bespoke</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-200">
              {comparisonMatrix.map((row, idx) => (
                <tr key={idx} className={idx % 2 === 0 ? 'bg-[#FAF7F2]/40' : 'bg-white'}>
                  <td className="p-4 font-medium text-neutral-800">{row.feature}</td>

                  {/* Essential column */}
                  <td className="p-4 text-center text-neutral-600">
                    {typeof row.essential === 'boolean' ? (
                      row.essential ? (
                        <Check className="w-4 h-4 text-emerald-600 mx-auto" />
                      ) : (
                        <span className="text-neutral-400">—</span>
                      )
                    ) : (
                      row.essential
                    )}
                  </td>

                  {/* Signature column */}
                  <td className="p-4 text-center font-medium bg-[#C9A227]/5 text-neutral-900 border-x border-[#C9A227]/20">
                    {typeof row.signature === 'boolean' ? (
                      row.signature ? (
                        <Check className="w-4 h-4 text-[#C9A227] mx-auto font-bold" />
                      ) : (
                        <span className="text-neutral-400">—</span>
                      )
                    ) : (
                      <span className="text-[#A37F14] font-semibold">{row.signature}</span>
                    )}
                  </td>

                  {/* Bespoke column */}
                  <td className="p-4 text-center text-neutral-700">
                    {typeof row.bespoke === 'boolean' ? (
                      row.bespoke ? (
                        <Check className="w-4 h-4 text-neutral-800 mx-auto" />
                      ) : (
                        <span className="text-neutral-400">—</span>
                      )
                    ) : (
                      row.bespoke
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Note on Custom Add-Ons */}
        <div className="mt-8 p-6 rounded-2xl bg-white border border-neutral-300 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <ShieldCheck className="w-6 h-6 text-[#C9A227] shrink-0" />
            <p className="text-xs text-neutral-600 font-light">
              <strong>Need custom tailoring?</strong> We routinely craft hybrid solutions for multi-city tour itineraries and multi-week destination takeovers.
            </p>
          </div>
          <button
            onClick={() => onNavigate('contact')}
            className="px-6 py-2.5 rounded-full text-xs uppercase tracking-wider font-semibold border border-[#1C1B1A] hover:bg-[#1C1B1A] hover:text-white transition-colors shrink-0"
          >
            Custom Atelier Inquiry
          </button>
        </div>
      </div>
    </div>
  );
};
