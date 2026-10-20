import React, { useState } from 'react';
import { Mail, Phone, MapPin, Clock, Send, Sparkles, CheckCircle2 } from 'lucide-react';
import { createInquiry } from '../../services/storage';
import { useToast } from '../ui/Toast';
import { EventType } from '../../types/index';

interface ContactPageProps {
  onNavigate: (page: string) => void;
}

export const ContactPage: React.FC<ContactPageProps> = ({ onNavigate }) => {
  const { toast } = useToast();
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    eventType: 'Wedding' as EventType,
    preferredDate: '',
    guests: 150,
    budget: '$200,000 - $350,000',
    message: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.email.trim() || !formData.message.trim()) {
      toast({
        type: 'error',
        title: 'Missing Required Fields',
        message: 'Please provide your full name, email address, and a brief description of your event.',
      });
      return;
    }

    createInquiry({
      name: formData.name,
      email: formData.email,
      phone: formData.phone || '+1 (555) 000-0000',
      eventType: formData.eventType,
      preferredDate: formData.preferredDate || undefined,
      guests: Number(formData.guests),
      budget: formData.budget,
      message: formData.message,
    });

    setSubmitted(true);
    toast({
      type: 'success',
      title: 'Inquiry Received by Atelier',
      message: 'Our senior concierge will reach out within 24 business hours to arrange a confidential dialogue.',
    });
  };

  return (
    <div className="pt-24 pb-20 bg-[#FAF7F2] text-[#1C1B1A]">
      {/* Page Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16 text-center space-y-4">
        <span className="text-xs uppercase tracking-[0.25em] text-[#C9A227] font-semibold">
          Initiate Dialogue
        </span>
        <h1 className="font-serif text-4xl sm:text-6xl font-light text-[#1C1B1A]">
          Direct Atelier Inquiries
        </h1>
        <p className="max-w-2xl mx-auto text-sm sm:text-base text-neutral-600 font-light">
          Whether planning an intimate château wedding or a world-scale gala, we invite you to share the essence of your vision with our senior producers.
        </p>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Form Column */}
          <div className="lg:col-span-7 bg-white p-8 sm:p-12 rounded-3xl border border-neutral-300 shadow-xl">
            {submitted ? (
              <div className="text-center py-12 space-y-6 animate-fade-in">
                <div className="w-16 h-16 rounded-full bg-[#C9A227]/20 border border-[#C9A227] flex items-center justify-center mx-auto text-[#C9A227]">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <div className="space-y-2">
                  <h3 className="font-serif text-3xl font-light text-[#1C1B1A]">
                    Inquiry Transmitted to Éléonore Vance
                  </h3>
                  <p className="text-xs sm:text-sm text-neutral-600 max-w-md mx-auto leading-relaxed">
                    Thank you, {formData.name}. Your inquiry has been routed to our Paris & New York production desks. We will review your dates and connect with you directly.
                  </p>
                </div>
                <div className="pt-4 flex flex-col sm:flex-row justify-center gap-4">
                  <button
                    onClick={() => {
                      setSubmitted(false);
                      setFormData({
                        name: '',
                        email: '',
                        phone: '',
                        eventType: 'Wedding',
                        preferredDate: '',
                        guests: 150,
                        budget: '$200,000 - $350,000',
                        message: '',
                      });
                    }}
                    className="px-6 py-3 rounded-full text-xs uppercase tracking-wider font-semibold border border-neutral-300 hover:border-neutral-600 transition-colors"
                  >
                    Send Another Note
                  </button>
                  <button
                    onClick={() => onNavigate('book')}
                    className="px-6 py-3 rounded-full text-xs uppercase tracking-wider font-semibold bg-[#C9A227] text-[#1C1B1A] transition-all"
                  >
                    Proceed to Online Booking Wizard
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {/* Name */}
                  <div className="space-y-1.5">
                    <label className="text-xs uppercase tracking-wider text-neutral-700 font-medium block">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="e.g. Lady Genevieve Vance"
                      className="w-full px-4 py-3 rounded-xl border border-neutral-300 text-xs text-neutral-800 placeholder-neutral-400 focus:outline-none focus:border-[#C9A227] transition-colors"
                    />
                  </div>

                  {/* Email */}
                  <div className="space-y-1.5">
                    <label className="text-xs uppercase tracking-wider text-neutral-700 font-medium block">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="concierge@estate.com"
                      className="w-full px-4 py-3 rounded-xl border border-neutral-300 text-xs text-neutral-800 placeholder-neutral-400 focus:outline-none focus:border-[#C9A227] transition-colors"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {/* Phone */}
                  <div className="space-y-1.5">
                    <label className="text-xs uppercase tracking-wider text-neutral-700 font-medium block">
                      Phone Number & Country
                    </label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="+1 (212) 555-0199"
                      className="w-full px-4 py-3 rounded-xl border border-neutral-300 text-xs text-neutral-800 placeholder-neutral-400 focus:outline-none focus:border-[#C9A227] transition-colors"
                    />
                  </div>

                  {/* Event Type */}
                  <div className="space-y-1.5">
                    <label className="text-xs uppercase tracking-wider text-neutral-700 font-medium block">
                      Event Category
                    </label>
                    <select
                      value={formData.eventType}
                      onChange={(e) => setFormData({ ...formData, eventType: e.target.value as EventType })}
                      className="w-full px-4 py-3 rounded-xl border border-neutral-300 text-xs text-neutral-800 bg-white focus:outline-none focus:border-[#C9A227] transition-colors"
                    >
                      <option value="Wedding">Haute Couture Wedding</option>
                      <option value="Corporate">High-Level Corporate Summit</option>
                      <option value="Gala">Philanthropic Gala / Museum Ball</option>
                      <option value="Destination">Global Destination Immersion</option>
                      <option value="Private Party">Private Milestone Celebration</option>
                      <option value="Other">Other Bespoke Commission</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                  {/* Preferred Date */}
                  <div className="space-y-1.5">
                    <label className="text-xs uppercase tracking-wider text-neutral-700 font-medium block">
                      Target Date
                    </label>
                    <input
                      type="date"
                      value={formData.preferredDate}
                      onChange={(e) => setFormData({ ...formData, preferredDate: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border border-neutral-300 text-xs text-neutral-800 focus:outline-none focus:border-[#C9A227] transition-colors"
                    />
                  </div>

                  {/* Guest Count */}
                  <div className="space-y-1.5">
                    <label className="text-xs uppercase tracking-wider text-neutral-700 font-medium block">
                      Guests: {formData.guests}
                    </label>
                    <input
                      type="range"
                      min={10}
                      max={800}
                      step={10}
                      value={formData.guests}
                      onChange={(e) => setFormData({ ...formData, guests: Number(e.target.value) })}
                      className="w-full accent-[#C9A227] mt-3"
                    />
                  </div>

                  {/* Budget */}
                  <div className="space-y-1.5">
                    <label className="text-xs uppercase tracking-wider text-neutral-700 font-medium block">
                      Estimated Budget
                    </label>
                    <select
                      value={formData.budget}
                      onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border border-neutral-300 text-xs text-neutral-800 bg-white focus:outline-none focus:border-[#C9A227] transition-colors"
                    >
                      <option value="$100,000 - $200,000">$100,000 – $200,000</option>
                      <option value="$200,000 - $350,000">$200,000 – $350,000</option>
                      <option value="$350,000 - $500,000">$350,000 – $500,000</option>
                      <option value="$500,000+">$500,000+ (Sovereign)</option>
                    </select>
                  </div>
                </div>

                {/* Message */}
                <div className="space-y-1.5">
                  <label className="text-xs uppercase tracking-wider text-neutral-700 font-medium block">
                    Your Aesthetic Vision & Desired Venue *
                  </label>
                  <textarea
                    required
                    rows={4}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="Tell us about the desired location (e.g. Lake Como, Paris, French Riviera), aesthetic motifs, culinary preferences, and timing..."
                    className="w-full px-4 py-3 rounded-xl border border-neutral-300 text-xs text-neutral-800 placeholder-neutral-400 focus:outline-none focus:border-[#C9A227] transition-colors"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-4 rounded-full text-xs uppercase tracking-[0.2em] font-semibold bg-[#1C1B1A] hover:bg-neutral-800 text-[#FAF7F2] transition-all flex items-center justify-center gap-2 shadow-lg"
                >
                  <Send className="w-4 h-4 text-[#C9A227]" />
                  <span>Transmit Private Inquiry</span>
                </button>
              </form>
            )}
          </div>

          {/* Info & Map Column */}
          <div className="lg:col-span-5 space-y-8">
            {/* Atelier Details */}
            <div className="bg-[#1C1B1A] text-[#FAF7F2] p-8 rounded-3xl border border-[#C9A227]/30 space-y-6">
              <span className="text-[11px] uppercase tracking-[0.25em] text-[#C9A227] font-semibold block">
                Direct Communications
              </span>
              <h3 className="font-serif text-2xl font-light">The Concierge Ateliers</h3>

              <div className="space-y-4 text-xs font-light text-neutral-300">
                <div className="flex items-start gap-3">
                  <MapPin className="w-4 h-4 text-[#C9A227] shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-white block font-medium">Paris Atelier:</strong>
                    18 Place Vendôme, 75001 Paris, France
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <MapPin className="w-4 h-4 text-[#C9A227] shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-white block font-medium">Manhattan Studio:</strong>
                    767 Fifth Avenue, New York, NY 10153
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Phone className="w-4 h-4 text-[#C9A227] shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-white block font-medium">VIP Concierge Line:</strong>
                    +33 1 42 68 55 00 / +1 (212) 555-8392
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Mail className="w-4 h-4 text-[#C9A227] shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-white block font-medium">Electronic Dispatch:</strong>
                    atelier@lumiere.events
                  </div>
                </div>
              </div>
            </div>

            {/* Interactive Embedded Map Placeholder */}
            <div className="rounded-3xl overflow-hidden border border-neutral-300 bg-white p-4 shadow-md space-y-3">
              <div className="relative aspect-[16/9] rounded-2xl overflow-hidden bg-neutral-900">
                <img
                  src="https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=1000&q=80"
                  alt="Paris Place Vendôme Location Map"
                  className="w-full h-full object-cover filter brightness-75 contrast-125"
                />
                <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                  <div className="bg-[#1C1B1A]/90 backdrop-blur-md px-4 py-2 rounded-full border border-[#C9A227] text-white flex items-center gap-2 text-xs shadow-xl">
                    <div className="w-2.5 h-2.5 rounded-full bg-[#C9A227] animate-ping" />
                    <span>Lumière Flagship • Place Vendôme, Paris</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-between text-[11px] text-neutral-500 px-2">
                <span>Coordinates: 48.8675° N, 2.3294° E</span>
                <span className="text-[#A37F14] font-medium">Appointments by invitation only</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
