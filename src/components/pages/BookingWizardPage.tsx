import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  ArrowRight,
  ArrowLeft,
  Calendar,
  CheckCircle2,
  Lock,
  CreditCard,
  ShieldCheck,
  AlertCircle,
  FileText,
  Mail,
  User,
  ExternalLink,
} from 'lucide-react';
import { getBookings, createBooking, getCurrentUser, setCurrentUser } from '../../services/storage';
import {
  isDateBooked,
  calculateDeposit,
  validateBookingStep,
} from '../../utils/bookingRules';
import { SEED_PACKAGES, SEED_USERS } from '../../data/seedData';
import { EventType, PackageTier } from '../../types/index';
import { useToast } from '../ui/Toast';

interface BookingWizardPageProps {
  onNavigate: (page: string) => void;
  initialPackageId?: 'Essential' | 'Signature' | 'Bespoke';
}

export const BookingWizardPage: React.FC<BookingWizardPageProps> = ({
  onNavigate,
  initialPackageId = 'Signature',
}) => {
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(1);
  const [existingBookings, setExistingBookings] = useState(getBookings());
  const currentUser = getCurrentUser();

  // Wizard form state
  const [formData, setFormData] = useState({
    eventType: 'Wedding' as EventType,
    eventDate: '2027-05-15',
    packageTier: initialPackageId as 'Essential' | 'Signature' | 'Bespoke',
    clientName: currentUser ? currentUser.name : '',
    clientEmail: currentUser ? currentUser.email : '',
    clientPhone: currentUser?.phone || '+1 (212) 555-8392',
    guests: 180,
    venue: 'Villa Ephrussi de Rothschild or similar European Château',
    budget: '$350,000 - $500,000',
    notes: 'Desire grand outdoor ceremony with crystal chandeliers and classical quartet.',
    paymentMethod: 'stripe' as 'stripe' | 'hold',
    cardNumber: '•••• •••• •••• 4242',
    cardExp: '12/28',
    cardCvc: '888',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [confirmedBooking, setConfirmedBooking] = useState<any | null>(null);
  const [showEmailStub, setShowEmailStub] = useState(false);

  // Update form if user switches
  useEffect(() => {
    if (currentUser && !formData.clientName) {
      setFormData((prev) => ({
        ...prev,
        clientName: currentUser.name,
        clientEmail: currentUser.email,
        clientPhone: currentUser.phone || prev.clientPhone,
      }));
    }
  }, [currentUser]);

  const selectedPkg =
    SEED_PACKAGES.find((p) => p.id === formData.packageTier) || SEED_PACKAGES[1];
  const depositAmount = calculateDeposit(selectedPkg.priceStartingAt, selectedPkg.depositPercentage);

  const steps = [
    { number: 1, title: 'Event Type' },
    { number: 2, title: 'Calendar Date' },
    { number: 3, title: 'Atelier Tier' },
    { number: 4, title: 'Details & Venue' },
    { number: 5, title: 'Review & Retainer' },
  ];

  const handleNext = () => {
    const validation = validateBookingStep(currentStep, formData, existingBookings);
    if (!validation.isValid) {
      setErrors(validation.errors);
      toast({
        type: 'error',
        title: 'Validation Notice',
        message: Object.values(validation.errors)[0],
      });
      return;
    }
    setErrors({});
    setCurrentStep((prev) => Math.min(prev + 1, 5));
    window.scrollTo({ top: 120, behavior: 'smooth' });
  };

  const handleBack = () => {
    setErrors({});
    setCurrentStep((prev) => Math.max(prev - 1, 1));
    window.scrollTo({ top: 120, behavior: 'smooth' });
  };

  const handleCompleteBooking = () => {
    setIsSubmitting(true);

    setTimeout(() => {
      const willPayDeposit = formData.paymentMethod === 'stripe';
      const created = createBooking({
        userId: currentUser ? currentUser.id : 'user-clara',
        clientName: formData.clientName || 'Valued Patron',
        clientEmail: formData.clientEmail || 'patron@lumiere.events',
        clientPhone: formData.clientPhone,
        eventType: formData.eventType,
        eventDate: formData.eventDate,
        guests: Number(formData.guests),
        venue: formData.venue || 'Private European Heritage Venue',
        budget: formData.budget,
        packageTier: formData.packageTier,
        status: willPayDeposit ? 'CONFIRMED' : 'PENDING',
        depositPaid: willPayDeposit,
        depositAmount: depositAmount,
        totalAmount: selectedPkg.priceStartingAt,
        notes: formData.notes,
      });

      // If guest wasn't logged in, log them in as Clara or new user so portal works
      if (!currentUser) {
        setCurrentUser(SEED_USERS[1]);
      }

      setConfirmedBooking(created);
      setIsSubmitting(false);
      setCurrentStep(6); // Confirmation screen

      toast({
        type: 'success',
        title: willPayDeposit ? 'Booking Confirmed & Retainer Processed' : 'Concierge Hold Requested',
        message: `Booking ${created.bookingNumber} is registered in the master production registry.`,
      });
    }, 1200);
  };

  // Check if chosen date has conflict
  const isDateTaken = isDateBooked(formData.eventDate, existingBookings);

  return (
    <div className="pt-24 pb-20 bg-[#FAF7F2] text-[#1C1B1A] min-h-screen">
      {/* Header */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 mb-10 text-center space-y-3">
        <span className="text-xs uppercase tracking-[0.25em] text-[#C9A227] font-semibold">
          Commission Registry
        </span>
        <h1 className="font-serif text-3xl sm:text-5xl font-light text-[#1C1B1A]">
          Reserve Your Date with Lumière
        </h1>
        <p className="text-xs sm:text-sm text-neutral-600 font-light">
          A guided multi-step curation to configure your event parameters, verify dates, and lock in production.
        </p>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        {/* Progress Bar (Visible on Steps 1 to 5) */}
        {currentStep <= 5 && (
          <div className="mb-10 bg-white p-4 sm:p-6 rounded-2xl border border-neutral-300 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              {steps.map((s) => (
                <div key={s.number} className="flex flex-col items-center">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold transition-all ${
                      currentStep === s.number
                        ? 'bg-[#1C1B1A] text-[#C9A227] border-2 border-[#C9A227]'
                        : currentStep > s.number
                        ? 'bg-[#C9A227] text-[#1C1B1A]'
                        : 'bg-neutral-100 text-neutral-400 border border-neutral-300'
                    }`}
                  >
                    {currentStep > s.number ? <CheckCircle2 className="w-4 h-4" /> : s.number}
                  </div>
                  <span
                    className={`hidden sm:block text-[10px] uppercase tracking-wider mt-1.5 font-medium ${
                      currentStep === s.number ? 'text-[#1C1B1A] font-bold' : 'text-neutral-500'
                    }`}
                  >
                    {s.title}
                  </span>
                </div>
              ))}
            </div>
            <div className="w-full bg-neutral-200 h-1.5 rounded-full overflow-hidden">
              <div
                className="bg-[#C9A227] h-full transition-all duration-500 rounded-full"
                style={{ width: `${((currentStep - 1) / 4) * 100}%` }}
              />
            </div>
          </div>
        )}

        {/* Wizard Card Body */}
        <div className="bg-white rounded-3xl border border-neutral-300 shadow-xl p-6 sm:p-12">
          {/* STEP 1: EVENT TYPE */}
          {currentStep === 1 && (
            <div className="space-y-6 animate-fade-in">
              <div className="border-b border-neutral-200 pb-4">
                <h2 className="font-serif text-2xl font-light text-[#1C1B1A]">
                  Step 1: Select Your Event Category
                </h2>
                <p className="text-xs text-neutral-500 mt-1">
                  Choose the category that best aligns with your upcoming celebration.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  {
                    type: 'Wedding',
                    title: 'Haute Couture Wedding',
                    desc: 'Palatial ceremonies, rehearsal dinners, and multi-day châteaux weddings.',
                  },
                  {
                    type: 'Corporate',
                    title: 'High-Level Corporate Summit',
                    desc: 'Discreet executive gatherings, brand showcases, and global conclaves.',
                  },
                  {
                    type: 'Gala',
                    title: 'Philanthropic & Cultural Gala',
                    desc: 'Museum buyouts, black-tie charity auctions, and patron balls.',
                  },
                  {
                    type: 'Destination',
                    title: 'Global Destination Soirée',
                    desc: 'Lake Como, Amalfi Coast, Swiss Alps, or private island takeovers.',
                  },
                  {
                    type: 'Private Party',
                    title: 'Private Milestone Celebration',
                    desc: 'Anniversaries, birthdays, and private vintage tastings.',
                  },
                  {
                    type: 'Other',
                    title: 'Bespoke Concept',
                    desc: 'Custom commission outside standard categories.',
                  },
                ].map((item) => (
                  <button
                    key={item.type}
                    type="button"
                    onClick={() => {
                      setFormData({ ...formData, eventType: item.type as EventType });
                      setErrors({});
                    }}
                    className={`p-5 rounded-2xl border text-left transition-all ${
                      formData.eventType === item.type
                        ? 'border-[#C9A227] bg-[#1C1B1A] text-[#FAF7F2] shadow-md'
                        : 'border-neutral-200 hover:border-neutral-400 bg-[#FAF7F2]/50 text-[#1C1B1A]'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-serif text-lg font-medium">{item.title}</h3>
                      {formData.eventType === item.type && (
                        <CheckCircle2 className="w-5 h-5 text-[#C9A227]" />
                      )}
                    </div>
                    <p
                      className={`text-xs leading-relaxed font-light ${
                        formData.eventType === item.type ? 'text-neutral-300' : 'text-neutral-600'
                      }`}
                    >
                      {item.desc}
                    </p>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* STEP 2: DATE PICKER & AVAILABILITY */}
          {currentStep === 2 && (
            <div className="space-y-6 animate-fade-in">
              <div className="border-b border-neutral-200 pb-4">
                <h2 className="font-serif text-2xl font-light text-[#1C1B1A]">
                  Step 2: Choose Your Target Date
                </h2>
                <p className="text-xs text-neutral-500 mt-1">
                  Our atelier enforces strict booking exclusivity. Dates already committed to patrons are locked.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
                <div className="space-y-4">
                  <label className="text-xs uppercase tracking-wider text-neutral-700 font-medium block">
                    Select Event Date
                  </label>
                  <input
                    type="date"
                    min="2026-10-21"
                    max="2028-12-31"
                    value={formData.eventDate}
                    onChange={(e) => {
                      setFormData({ ...formData, eventDate: e.target.value });
                      setErrors({});
                    }}
                    className="w-full px-4 py-3 rounded-xl border border-neutral-300 text-sm focus:outline-none focus:border-[#C9A227] bg-white"
                  />

                  {/* Availability Badge */}
                  {isDateTaken ? (
                    <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 flex items-start gap-3 text-xs leading-relaxed">
                      <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                      <div>
                        <strong>Date Unavailable:</strong> Our lead producers are already fully commissioned for {formData.eventDate}. Please choose another date or request a special atelier review.
                      </div>
                    </div>
                  ) : (
                    <div className="p-4 rounded-xl bg-[#FAF7F2] border border-[#C9A227]/40 text-[#1C1B1A] flex items-start gap-3 text-xs leading-relaxed">
                      <Sparkles className="w-5 h-5 text-[#C9A227] shrink-0 mt-0.5" />
                      <div>
                        <strong className="text-[#A37F14] block">Available For Commission!</strong>
                        Our master production calendar has an open slot for {formData.eventDate}. You may secure this date with your deposit retainer.
                      </div>
                    </div>
                  )}

                  {errors.eventDate && (
                    <p className="text-xs text-red-600">{errors.eventDate}</p>
                  )}
                </div>

                {/* Seasonal Guidelines */}
                <div className="bg-[#1C1B1A] text-[#FAF7F2] p-6 rounded-2xl border border-[#C9A227]/30 space-y-4">
                  <h4 className="font-serif text-lg font-light text-[#C9A227]">
                    Seasonal Atelier Notes
                  </h4>
                  <div className="space-y-3 text-xs text-neutral-300 font-light leading-relaxed">
                    <p>
                      <strong>Mediterranean High Season (May - Sept):</strong> French Riviera & Lake Como venues require 8+ months advance notice for full buyouts.
                    </p>
                    <p>
                      <strong>Autumn & Winter Galas (Oct - Dec):</strong> Prime Parisian museum and New York ballroom slots book 6 months in advance.
                    </p>
                    <p>
                      <strong>Alpine Winter (Jan - March):</strong> St. Moritz & Courchevel luxury chalets and private mountain lodges.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: PACKAGE SELECTION */}
          {currentStep === 3 && (
            <div className="space-y-6 animate-fade-in">
              <div className="border-b border-neutral-200 pb-4">
                <h2 className="font-serif text-2xl font-light text-[#1C1B1A]">
                  Step 3: Select Your Atelier Production Tier
                </h2>
                <p className="text-xs text-neutral-500 mt-1">
                  Choose the curation level that fits your scale, vision, and timeline requirements.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {SEED_PACKAGES.map((pkg) => (
                  <button
                    key={pkg.id}
                    type="button"
                    onClick={() => {
                      setFormData({ ...formData, packageTier: pkg.id });
                      setErrors({});
                    }}
                    className={`p-6 rounded-2xl border text-left flex flex-col justify-between transition-all ${
                      formData.packageTier === pkg.id
                        ? 'border-[#C9A227] bg-[#1C1B1A] text-[#FAF7F2] shadow-xl ring-2 ring-[#C9A227]'
                        : 'border-neutral-200 hover:border-neutral-400 bg-white text-[#1C1B1A]'
                    }`}
                  >
                    <div>
                      <span
                        className={`text-[10px] uppercase tracking-wider font-semibold block ${
                          formData.packageTier === pkg.id ? 'text-[#C9A227]' : 'text-neutral-500'
                        }`}
                      >
                        {pkg.subtitle}
                      </span>
                      <h3 className="font-serif text-2xl font-light mt-1">{pkg.name}</h3>
                      <div className="my-4 text-2xl font-serif">
                        ${pkg.priceStartingAt.toLocaleString()}
                      </div>
                      <p
                        className={`text-xs leading-relaxed font-light mb-4 ${
                          formData.packageTier === pkg.id ? 'text-neutral-300' : 'text-neutral-600'
                        }`}
                      >
                        {pkg.description}
                      </p>
                    </div>

                    <div className="pt-4 border-t border-neutral-200/20 text-xs flex items-center justify-between">
                      <span className="font-medium text-[#C9A227]">
                        20% Retainer: ${(pkg.priceStartingAt * 0.2).toLocaleString()}
                      </span>
                      {formData.packageTier === pkg.id && (
                        <CheckCircle2 className="w-5 h-5 text-[#C9A227]" />
                      )}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* STEP 4: DETAILS & GUESTS */}
          {currentStep === 4 && (
            <div className="space-y-6 animate-fade-in">
              <div className="border-b border-neutral-200 pb-4">
                <h2 className="font-serif text-2xl font-light text-[#1C1B1A]">
                  Step 4: Celebration Details & Client Contact
                </h2>
                <p className="text-xs text-neutral-500 mt-1">
                  Provide estimated guest numbers, venue preferences, and your concierge contact.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {/* Client Name */}
                <div className="space-y-1.5">
                  <label className="text-xs uppercase tracking-wider text-neutral-700 font-medium block">
                    Full Legal Name *
                  </label>
                  <input
                    type="text"
                    value={formData.clientName}
                    onChange={(e) => setFormData({ ...formData, clientName: e.target.value })}
                    placeholder="e.g. Clara Dupont-Laurent"
                    className="w-full px-4 py-3 rounded-xl border border-neutral-300 text-xs text-neutral-800 focus:outline-none focus:border-[#C9A227]"
                  />
                  {errors.clientName && <p className="text-xs text-red-600">{errors.clientName}</p>}
                </div>

                {/* Client Email */}
                <div className="space-y-1.5">
                  <label className="text-xs uppercase tracking-wider text-neutral-700 font-medium block">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    value={formData.clientEmail}
                    onChange={(e) => setFormData({ ...formData, clientEmail: e.target.value })}
                    placeholder="clara@example.com"
                    className="w-full px-4 py-3 rounded-xl border border-neutral-300 text-xs text-neutral-800 focus:outline-none focus:border-[#C9A227]"
                  />
                  {errors.clientEmail && <p className="text-xs text-red-600">{errors.clientEmail}</p>}
                </div>

                {/* Phone */}
                <div className="space-y-1.5">
                  <label className="text-xs uppercase tracking-wider text-neutral-700 font-medium block">
                    Mobile / WhatsApp Contact *
                  </label>
                  <input
                    type="tel"
                    value={formData.clientPhone}
                    onChange={(e) => setFormData({ ...formData, clientPhone: e.target.value })}
                    placeholder="+1 (212) 555-8392"
                    className="w-full px-4 py-3 rounded-xl border border-neutral-300 text-xs text-neutral-800 focus:outline-none focus:border-[#C9A227]"
                  />
                  {errors.clientPhone && <p className="text-xs text-red-600">{errors.clientPhone}</p>}
                </div>

                {/* Estimated Guests */}
                <div className="space-y-1.5">
                  <label className="text-xs uppercase tracking-wider text-neutral-700 font-medium block">
                    Estimated Guest Count: {formData.guests}
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={1500}
                    value={formData.guests}
                    onChange={(e) => setFormData({ ...formData, guests: Number(e.target.value) })}
                    className="w-full px-4 py-3 rounded-xl border border-neutral-300 text-xs text-neutral-800 focus:outline-none focus:border-[#C9A227]"
                  />
                </div>
              </div>

              {/* Preferred Venue */}
              <div className="space-y-1.5">
                <label className="text-xs uppercase tracking-wider text-neutral-700 font-medium block">
                  Target Venue / Geographical Region
                </label>
                <input
                  type="text"
                  value={formData.venue}
                  onChange={(e) => setFormData({ ...formData, venue: e.target.value })}
                  placeholder="e.g. Villa Ephrussi, Saint-Jean-Cap-Ferrat, or Lake Como"
                  className="w-full px-4 py-3 rounded-xl border border-neutral-300 text-xs text-neutral-800 focus:outline-none focus:border-[#C9A227]"
                />
              </div>

              {/* Budget Range */}
              <div className="space-y-1.5">
                <label className="text-xs uppercase tracking-wider text-neutral-700 font-medium block">
                  Overall Target Event Budget
                </label>
                <select
                  value={formData.budget}
                  onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-neutral-300 text-xs text-neutral-800 bg-white focus:outline-none focus:border-[#C9A227]"
                >
                  <option value="$150,000 - $250,000">$150,000 – $250,000</option>
                  <option value="$250,000 - $400,000">$250,000 – $400,000</option>
                  <option value="$350,000 - $500,000">$350,000 – $500,000</option>
                  <option value="$500,000 - $1,000,000">$500,000 – $1,000,000</option>
                  <option value="$1,000,000+">$1,000,000+ (Sovereign)</option>
                </select>
              </div>

              {/* Special Requests */}
              <div className="space-y-1.5">
                <label className="text-xs uppercase tracking-wider text-neutral-700 font-medium block">
                  Special Design Requests, Scenography Motifs or VIP Protocols
                </label>
                <textarea
                  rows={3}
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  placeholder="Floral arches, antique silver cutlery, private jet transfers, fireworks permits..."
                  className="w-full px-4 py-3 rounded-xl border border-neutral-300 text-xs text-neutral-800 focus:outline-none focus:border-[#C9A227]"
                />
              </div>
            </div>
          )}

          {/* STEP 5: REVIEW & PAYMENT (STRIPE TEST CHECKOUT) */}
          {currentStep === 5 && (
            <div className="space-y-6 animate-fade-in">
              <div className="border-b border-neutral-200 pb-4">
                <h2 className="font-serif text-2xl font-light text-[#1C1B1A]">
                  Step 5: Review Summary & Secure Retainer
                </h2>
                <p className="text-xs text-neutral-500 mt-1">
                  Lock your date into our production atelier via test Stripe checkout or request a concierge temporary hold.
                </p>
              </div>

              {/* Order Summary Box */}
              <div className="p-6 rounded-2xl bg-[#FAF7F2] border border-neutral-300 space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-neutral-200 text-xs">
                  <span className="text-neutral-500 uppercase tracking-wider">Event Category:</span>
                  <span className="font-semibold text-[#1C1B1A]">{formData.eventType}</span>
                </div>
                <div className="flex items-center justify-between pb-3 border-b border-neutral-200 text-xs">
                  <span className="text-neutral-500 uppercase tracking-wider">Reserved Date:</span>
                  <span className="font-semibold text-[#1C1B1A]">{formData.eventDate}</span>
                </div>
                <div className="flex items-center justify-between pb-3 border-b border-neutral-200 text-xs">
                  <span className="text-neutral-500 uppercase tracking-wider">Selected Package Tier:</span>
                  <span className="font-semibold text-[#1C1B1A]">
                    {selectedPkg.name} ({formData.packageTier})
                  </span>
                </div>
                <div className="flex items-center justify-between pb-3 border-b border-neutral-200 text-xs">
                  <span className="text-neutral-500 uppercase tracking-wider">Guest Count & Venue:</span>
                  <span className="font-semibold text-[#1C1B1A]">
                    {formData.guests} Guests • {formData.venue}
                  </span>
                </div>
                <div className="flex items-center justify-between pb-3 border-b border-neutral-200 text-xs">
                  <span className="text-neutral-500 uppercase tracking-wider">Total Atelier Retainer:</span>
                  <span className="font-serif text-lg text-[#1C1B1A]">
                    ${selectedPkg.priceStartingAt.toLocaleString()} USD
                  </span>
                </div>
                <div className="flex items-center justify-between pt-1 text-sm font-semibold text-[#1C1B1A]">
                  <span className="text-[#A37F14] uppercase tracking-wider">
                    20% Due Today to Lock Date:
                  </span>
                  <span className="font-serif text-2xl text-[#C9A227]">
                    ${depositAmount.toLocaleString()} USD
                  </span>
                </div>
              </div>

              {/* Payment Option Selector */}
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, paymentMethod: 'stripe' })}
                    className={`p-4 rounded-xl border text-left flex items-start gap-3 transition-all ${
                      formData.paymentMethod === 'stripe'
                        ? 'border-[#C9A227] bg-[#1C1B1A] text-white shadow-md'
                        : 'border-neutral-300 bg-white text-neutral-800'
                    }`}
                  >
                    <CreditCard className="w-5 h-5 text-[#C9A227] shrink-0 mt-0.5" />
                    <div>
                      <div className="font-medium text-xs">Stripe Test Checkout (Instant Lock)</div>
                      <div className="text-[11px] text-neutral-400 mt-0.5">
                        Charge 20% deposit (${depositAmount.toLocaleString()}) to confirm immediately.
                      </div>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, paymentMethod: 'hold' })}
                    className={`p-4 rounded-xl border text-left flex items-start gap-3 transition-all ${
                      formData.paymentMethod === 'hold'
                        ? 'border-[#C9A227] bg-[#1C1B1A] text-white shadow-md'
                        : 'border-neutral-300 bg-white text-neutral-800'
                    }`}
                  >
                    <Lock className="w-5 h-5 text-[#C9A227] shrink-0 mt-0.5" />
                    <div>
                      <div className="font-medium text-xs">Request 7-Day Concierge Hold</div>
                      <div className="text-[11px] text-neutral-400 mt-0.5">
                        Holds date pending direct wire transfer or telephone verification.
                      </div>
                    </div>
                  </button>
                </div>

                {/* Simulated Stripe Card Fields */}
                {formData.paymentMethod === 'stripe' && (
                  <div className="p-5 rounded-2xl bg-neutral-900 text-white border border-[#C9A227]/40 space-y-4">
                    <div className="flex items-center justify-between text-xs text-neutral-300">
                      <span className="flex items-center gap-1.5 font-medium">
                        <Lock className="w-3.5 h-3.5 text-[#C9A227]" />
                        Stripe Test Mode Encrypted Gateway
                      </span>
                      <span className="text-[11px] text-[#C9A227]">Demo Mode (No Real Charge)</span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div className="sm:col-span-2 space-y-1">
                        <label className="text-[10px] uppercase tracking-wider text-neutral-400">Card Number</label>
                        <input
                          type="text"
                          value={formData.cardNumber}
                          onChange={(e) => setFormData({ ...formData, cardNumber: e.target.value })}
                          className="w-full px-3 py-2 rounded-lg bg-neutral-800 border border-neutral-700 text-xs text-white"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div className="space-y-1">
                          <label className="text-[10px] uppercase tracking-wider text-neutral-400">Exp</label>
                          <input
                            type="text"
                            value={formData.cardExp}
                            onChange={(e) => setFormData({ ...formData, cardExp: e.target.value })}
                            className="w-full px-3 py-2 rounded-lg bg-neutral-800 border border-neutral-700 text-xs text-white"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[10px] uppercase tracking-wider text-neutral-400">CVC</label>
                          <input
                            type="text"
                            value={formData.cardCvc}
                            onChange={(e) => setFormData({ ...formData, cardCvc: e.target.value })}
                            className="w-full px-3 py-2 rounded-lg bg-neutral-800 border border-neutral-700 text-xs text-white"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* STEP 6: CONFIRMATION & EMAIL PREVIEW */}
          {currentStep === 6 && confirmedBooking && (
            <div className="text-center py-8 space-y-6 animate-fade-in">
              <div className="w-20 h-20 rounded-full bg-[#C9A227]/20 border-2 border-[#C9A227] flex items-center justify-center mx-auto text-[#C9A227]">
                <CheckCircle2 className="w-10 h-10" />
              </div>

              <div className="space-y-2">
                <span className="text-xs uppercase tracking-[0.25em] text-[#C9A227] font-semibold block">
                  Commission Confirmed
                </span>
                <h2 className="font-serif text-3xl sm:text-5xl font-light text-[#1C1B1A]">
                  Unforgettable Moments Await
                </h2>
                <p className="text-xs sm:text-sm text-neutral-600 max-w-md mx-auto">
                  Your event has been recorded in the Lumière Production Registry under reference:
                </p>
                <div className="inline-block px-4 py-2 rounded-full bg-[#1C1B1A] text-[#C9A227] font-mono text-sm tracking-wider font-bold">
                  {confirmedBooking.bookingNumber}
                </div>
              </div>

              {/* Quick Summary Card */}
              <div className="max-w-md mx-auto p-6 rounded-2xl bg-[#FAF7F2] border border-neutral-300 text-left text-xs space-y-2">
                <div className="flex justify-between">
                  <span className="text-neutral-500">Patron:</span>
                  <span className="font-medium text-neutral-900">{confirmedBooking.clientName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-500">Date:</span>
                  <span className="font-medium text-neutral-900">{confirmedBooking.eventDate}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-500">Tier:</span>
                  <span className="font-medium text-neutral-900">{confirmedBooking.packageTier} Tier</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-500">Deposit Status:</span>
                  <span className={`font-semibold ${confirmedBooking.depositPaid ? 'text-emerald-700' : 'text-amber-700'}`}>
                    {confirmedBooking.depositPaid ? `PAID ($${confirmedBooking.depositAmount.toLocaleString()})` : '7-Day Hold Pending'}
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
                <button
                  onClick={() => setShowEmailStub(true)}
                  className="w-full sm:w-auto px-6 py-3.5 rounded-full text-xs uppercase tracking-wider font-semibold border border-[#1C1B1A] hover:bg-[#1C1B1A] hover:text-white transition-all flex items-center justify-center gap-2"
                >
                  <Mail className="w-4 h-4 text-[#C9A227]" />
                  <span>View Confirmation Dispatch Email</span>
                </button>
                <button
                  onClick={() => onNavigate('portal')}
                  className="w-full sm:w-auto px-8 py-3.5 rounded-full text-xs uppercase tracking-wider font-semibold bg-[#C9A227] hover:bg-[#d8b030] text-[#1C1B1A] transition-all flex items-center justify-center gap-2 shadow-lg"
                >
                  <User className="w-4 h-4" />
                  <span>Enter Client Portal</span>
                </button>
              </div>
            </div>
          )}

          {/* Navigation Controls (Steps 1 to 5) */}
          {currentStep <= 5 && (
            <div className="pt-8 border-t border-neutral-200 flex items-center justify-between">
              {currentStep > 1 ? (
                <button
                  type="button"
                  onClick={handleBack}
                  className="px-6 py-3 rounded-full text-xs uppercase tracking-wider font-semibold border border-neutral-300 hover:border-neutral-600 text-neutral-700 transition-colors flex items-center gap-2"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Back</span>
                </button>
              ) : (
                <div />
              )}

              {currentStep < 5 ? (
                <button
                  type="button"
                  onClick={handleNext}
                  className="px-8 py-3.5 rounded-full text-xs uppercase tracking-wider font-semibold bg-[#1C1B1A] hover:bg-neutral-800 text-[#FAF7F2] transition-all flex items-center gap-2 shadow-md"
                >
                  <span>Continue</span>
                  <ArrowRight className="w-4 h-4 text-[#C9A227]" />
                </button>
              ) : (
                <button
                  type="button"
                  disabled={isSubmitting}
                  onClick={handleCompleteBooking}
                  className="px-8 py-3.5 rounded-full text-xs uppercase tracking-wider font-semibold bg-[#C9A227] hover:bg-[#d8b030] text-[#1C1B1A] transition-all flex items-center gap-2 shadow-lg"
                >
                  {isSubmitting ? (
                    <span>Processing Retainer...</span>
                  ) : (
                    <>
                      <span>
                        {formData.paymentMethod === 'stripe' ? 'Pay Deposit & Confirm' : 'Submit 7-Day Hold'}
                      </span>
                      <ShieldCheck className="w-4 h-4" />
                    </>
                  )}
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Confirmation Email Stub Modal */}
      {showEmailStub && confirmedBooking && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in"
        >
          <div className="bg-white rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl border border-neutral-300 text-xs text-[#1C1B1A]">
            <div className="bg-[#1C1B1A] text-[#FAF7F2] p-5 flex items-center justify-between border-b border-[#C9A227]/30">
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-[#C9A227]" />
                <span className="font-serif text-sm tracking-wider">Simulated Patron Confirmation Email</span>
              </div>
              <button
                onClick={() => setShowEmailStub(false)}
                className="text-neutral-400 hover:text-white"
              >
                ✕
              </button>
            </div>
            <div className="p-6 space-y-4 font-sans leading-relaxed">
              <div className="text-[11px] text-neutral-500 border-b border-neutral-200 pb-2">
                <div><strong>To:</strong> {confirmedBooking.clientName} &lt;{confirmedBooking.clientEmail}&gt;</div>
                <div><strong>From:</strong> Éléonore Vance &lt;concierge@lumiere.events&gt;</div>
                <div><strong>Subject:</strong> Official Confirmation: Lumière Commission [{confirmedBooking.bookingNumber}]</div>
              </div>
              <p>Dear {confirmedBooking.clientName},</p>
              <p>
                It is with exceptional pleasure that our atelier confirms your booking for your upcoming {confirmedBooking.eventType} on <strong>{confirmedBooking.eventDate}</strong>.
              </p>
              <div className="p-3 rounded-lg bg-[#FAF7F2] border border-neutral-200">
                <div><strong>Package:</strong> {confirmedBooking.packageTier} Tier</div>
                <div><strong>Venue:</strong> {confirmedBooking.venue}</div>
                <div><strong>Deposit Paid:</strong> ${confirmedBooking.depositAmount.toLocaleString()} USD</div>
              </div>
              <p>
                Your dedicated senior producer has initialized your timeline milestones inside the <strong>Lumière Client Portal</strong>. You may now access your contracts, mood boards, and live messaging thread.
              </p>
              <p className="italic text-neutral-500 font-serif">
                Warmest regards,<br />
                Éléonore Vance & The Lumière Production Atelier
              </p>
            </div>
            <div className="bg-neutral-50 p-4 border-t border-neutral-200 flex justify-end">
              <button
                onClick={() => {
                  setShowEmailStub(false);
                  onNavigate('portal');
                }}
                className="px-5 py-2 rounded-full bg-[#1C1B1A] text-[#FAF7F2] hover:bg-neutral-800 text-xs font-semibold"
              >
                Open Client Portal Now
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
