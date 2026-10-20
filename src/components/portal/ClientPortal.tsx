import React, { useState, useEffect } from 'react';
import {
  User,
  Calendar,
  Clock,
  CheckCircle2,
  FileText,
  MessageSquare,
  CreditCard,
  Settings,
  Sparkles,
  Upload,
  Send,
  Lock,
  ChevronRight,
  LogOut,
  Download,
  AlertCircle,
  ExternalLink,
} from 'lucide-react';
import {
  getCurrentUser,
  setCurrentUser,
  getBookingsForUser,
  toggleMilestone,
  getDocuments,
  addDocument,
  getMessages,
  sendMessage,
  getInvoices,
  payInvoice,
  subscribeToStore,
} from '../../services/storage';
import { calculateEventCountdown, calculateMilestoneProgress } from '../../utils/bookingRules';
import { SEED_USERS } from '../../data/seedData';
import { Booking, DocumentItem, Message, Invoice } from '../../types/index';
import { useToast } from '../ui/Toast';

interface ClientPortalProps {
  onNavigate: (page: string) => void;
}

export const ClientPortal: React.FC<ClientPortalProps> = ({ onNavigate }) => {
  const { toast } = useToast();
  const [currentUser, setUser] = useState(getCurrentUser());
  const [activeTab, setActiveTab] = useState<'dashboard' | 'events' | 'documents' | 'messages' | 'payments' | 'settings'>('dashboard');

  // Login form state if unauthenticated
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // Data
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [documents, setDocuments] = useState<DocumentItem[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [invoices, setInvoices] = useState<Invoice[]>([]);

  // Message input
  const [newMessageText, setNewMessageText] = useState('');

  // New doc modal
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [newDocName, setNewDocName] = useState('');
  const [newDocCategory, setNewDocCategory] = useState<'Contract' | 'Invoice' | 'Mood Board' | 'Floor Plan'>('Mood Board');

  // Pay invoice modal
  const [payingInvoice, setPayingInvoice] = useState<Invoice | null>(null);

  // Sync with store
  useEffect(() => {
    const refreshData = () => {
      const u = getCurrentUser();
      setUser(u);
      if (u) {
        const userBookings = getBookingsForUser(u.id);
        setBookings(userBookings);
        if (userBookings.length > 0 && !selectedBooking) {
          setSelectedBooking(userBookings[0]);
        }
        setDocuments(getDocuments(selectedBooking?.id));
        setMessages(getMessages(selectedBooking?.id));
        setInvoices(getInvoices(selectedBooking?.id));
      }
    };

    refreshData();
    const unsubscribe = subscribeToStore(refreshData);
    return () => unsubscribe();
  }, [selectedBooking?.id]);

  // Handle Login
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const found = SEED_USERS.find((u) => u.email.toLowerCase() === loginEmail.toLowerCase());
    if (found) {
      setCurrentUser(found);
      setUser(found);
      toast({
        type: 'success',
        title: `Welcome, ${found.name}`,
        message: 'You have logged into your private Lumière client suite.',
      });
    } else {
      toast({
        type: 'error',
        title: 'Authentication Failed',
        message: 'Invalid credentials. You can also use the 1-click Demo Login below.',
      });
    }
  };

  const handleDemoClientLogin = () => {
    const demo = SEED_USERS[1]; // Clara
    setCurrentUser(demo);
    setUser(demo);
    toast({
      type: 'success',
      title: 'Logged In as Clara Dupont-Laurent',
      message: 'Accessing French Riviera Wedding production suite.',
    });
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setUser(null);
    toast({
      type: 'info',
      title: 'Signed Out',
      message: 'You have been disconnected from the client portal.',
    });
  };

  // Milestone toggling
  const handleToggleMilestone = (milestoneId: string) => {
    if (!selectedBooking) return;
    toggleMilestone(selectedBooking.id, milestoneId);
    toast({
      type: 'success',
      title: 'Milestone Updated',
      message: 'Planning progress synced with your production team.',
    });
  };

  // Send message
  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessageText.trim() || !selectedBooking || !currentUser) return;

    sendMessage({
      bookingId: selectedBooking.id,
      senderId: currentUser.id,
      senderName: currentUser.name,
      senderRole: 'CLIENT',
      body: newMessageText.trim(),
    });

    setNewMessageText('');
    toast({
      type: 'success',
      title: 'Note Dispatched',
      message: 'Your message was sent to Éléonore Vance. An automated confirmation will follow.',
    });
  };

  // Upload document
  const handleUploadDoc = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDocName.trim() || !selectedBooking) return;

    addDocument({
      bookingId: selectedBooking.id,
      name: newDocName.trim(),
      category: newDocCategory,
      fileUrl: '#uploaded-file',
      size: `${(Math.random() * 4 + 1).toFixed(1)} MB`,
    });

    setNewDocName('');
    setShowUploadModal(false);
    toast({
      type: 'success',
      title: 'Document Uploaded',
      message: `${newDocName} is now accessible in your master event dossier.`,
    });
  };

  // Pay invoice
  const handlePayInvoice = (inv: Invoice) => {
    payInvoice(inv.id);
    setPayingInvoice(null);
    toast({
      type: 'success',
      title: 'Payment Succeeded',
      message: `Invoice ${inv.invoiceNumber} for $${inv.amount.toLocaleString()} has been settled.`,
    });
  };

  // If unauthenticated: render luxury login view
  if (!currentUser) {
    return (
      <div className="pt-28 pb-20 bg-[#FAF7F2] text-[#1C1B1A] min-h-screen flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-white rounded-3xl border border-neutral-300 shadow-2xl p-8 sm:p-10 space-y-6">
          <div className="text-center space-y-2">
            <div className="w-10 h-10 rounded-full border border-[#C9A227] flex items-center justify-center mx-auto bg-[#C9A227]/10 text-[#C9A227]">
              <Sparkles className="w-5 h-5" />
            </div>
            <h1 className="font-serif text-3xl font-light">Client Portal Login</h1>
            <p className="text-xs text-neutral-500 font-light">
              Enter your credentials to access your event milestones, contracts, and private atelier messages.
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs uppercase tracking-wider text-neutral-700 font-medium block">
                Patron Email Address
              </label>
              <input
                type="email"
                required
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
                placeholder="clara@example.com"
                className="w-full px-4 py-3 rounded-xl border border-neutral-300 text-xs focus:outline-none focus:border-[#C9A227]"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs uppercase tracking-wider text-neutral-700 font-medium block">
                Password
              </label>
              <input
                type="password"
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-3 rounded-xl border border-neutral-300 text-xs focus:outline-none focus:border-[#C9A227]"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3.5 rounded-full text-xs uppercase tracking-wider font-semibold bg-[#1C1B1A] hover:bg-neutral-800 text-[#FAF7F2] transition-colors"
            >
              Sign In To Portal
            </button>
          </form>

          <div className="pt-4 border-t border-neutral-200 text-center space-y-3">
            <span className="text-[11px] text-neutral-400 block uppercase tracking-wider">
              Instant Demo Access
            </span>
            <button
              onClick={handleDemoClientLogin}
              className="w-full py-3 rounded-full text-xs font-semibold uppercase tracking-wider bg-[#C9A227] hover:bg-[#d8b030] text-[#1C1B1A] transition-all"
            >
              One-Click Demo Login (Clara)
            </button>
            <p className="text-[10px] text-neutral-400">
              Demo client credentials: <code>clara@example.com</code> / <code>password</code>
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Active event calculations
  const activeBooking = selectedBooking || bookings[0];
  const countdown = activeBooking ? calculateEventCountdown(activeBooking.eventDate) : null;
  const progressPercent = activeBooking ? calculateMilestoneProgress(activeBooking.milestones) : 0;

  return (
    <div className="pt-24 pb-20 bg-[#FAF7F2] text-[#1C1B1A] min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Portal Header */}
        <div className="bg-[#1C1B1A] text-[#FAF7F2] rounded-3xl p-6 sm:p-8 mb-8 border border-[#C9A227]/30 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-[#C9A227] font-semibold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Patron Private Atelier</span>
            </div>
            <h1 className="font-serif text-3xl sm:text-4xl font-light">
              Welcome back, {currentUser.name}
            </h1>
            <p className="text-xs text-neutral-400 font-light">
              Executive production console for your commissioned celebrations.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => onNavigate('book')}
              className="px-4 py-2 rounded-full text-xs uppercase tracking-wider font-semibold bg-[#C9A227] hover:bg-[#d8b030] text-[#1C1B1A] transition-all"
            >
              + Commission New Event
            </button>
            <button
              onClick={handleLogout}
              className="p-2 rounded-full border border-neutral-700 hover:border-red-400 text-neutral-400 hover:text-red-400 transition-colors"
              title="Sign Out"
              aria-label="Sign Out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Portal Navigation Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-6 border-b border-neutral-300">
          {[
            { id: 'dashboard', label: 'Dashboard', icon: <Sparkles className="w-4 h-4" /> },
            { id: 'events', label: 'My Events & Milestones', icon: <Calendar className="w-4 h-4" /> },
            { id: 'documents', label: 'Documents & Dossier', icon: <FileText className="w-4 h-4" /> },
            { id: 'messages', label: 'Concierge Messages', icon: <MessageSquare className="w-4 h-4" /> },
            { id: 'payments', label: 'Invoices & Payments', icon: <CreditCard className="w-4 h-4" /> },
            { id: 'settings', label: 'Profile Settings', icon: <Settings className="w-4 h-4" /> },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-medium uppercase tracking-wider shrink-0 transition-all ${
                activeTab === tab.id
                  ? 'bg-[#1C1B1A] text-[#FAF7F2] shadow-md border border-[#C9A227]/40'
                  : 'bg-white hover:bg-neutral-100 text-neutral-700 border border-neutral-200'
              }`}
            >
              {tab.icon}
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* TAB 1: DASHBOARD */}
        {activeTab === 'dashboard' && (
          <div className="space-y-8 animate-fade-in">
            {activeBooking ? (
              <>
                {/* Upcoming Event Hero Card with Countdown */}
                <div className="bg-white rounded-3xl p-6 sm:p-8 border border-neutral-300 shadow-md grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                  <div className="lg:col-span-8 space-y-4">
                    <div className="flex items-center gap-3">
                      <span className="px-3 py-1 rounded-full text-[10px] uppercase font-bold tracking-wider bg-[#C9A227]/15 text-[#A37F14] border border-[#C9A227]/40">
                        {activeBooking.status}
                      </span>
                      <span className="text-xs text-neutral-500 font-mono">
                        Ref: {activeBooking.bookingNumber}
                      </span>
                    </div>

                    <h2 className="font-serif text-2xl sm:text-4xl font-light text-[#1C1B1A]">
                      {activeBooking.eventType} at {activeBooking.venue}
                    </h2>

                    <p className="text-xs text-neutral-600 font-light leading-relaxed max-w-xl">
                      {activeBooking.notes}
                    </p>

                    {/* Progress Bar */}
                    <div className="pt-2 space-y-1.5 max-w-md">
                      <div className="flex justify-between text-xs font-medium text-neutral-700">
                        <span>Master Production Readiness:</span>
                        <span className="text-[#C9A227] font-bold">{progressPercent}%</span>
                      </div>
                      <div className="w-full bg-neutral-200 h-2 rounded-full overflow-hidden">
                        <div
                          className="bg-[#C9A227] h-full rounded-full transition-all duration-500"
                          style={{ width: `${progressPercent}%` }}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Countdown Box */}
                  <div className="lg:col-span-4 bg-[#1C1B1A] text-[#FAF7F2] p-6 rounded-2xl border border-[#C9A227]/40 text-center space-y-4">
                    <span className="text-[10px] uppercase tracking-widest text-[#C9A227] font-semibold block">
                      Target Celebration
                    </span>
                    <div className="font-serif text-3xl font-light text-white">
                      {activeBooking.eventDate}
                    </div>

                    <div className="grid grid-cols-2 gap-2 pt-2 border-t border-neutral-800">
                      <div className="p-2 rounded-lg bg-neutral-900">
                        <div className="font-serif text-2xl font-light text-[#C9A227]">
                          {countdown?.days || 0}
                        </div>
                        <span className="text-[9px] uppercase tracking-wider text-neutral-400">Days</span>
                      </div>
                      <div className="p-2 rounded-lg bg-neutral-900">
                        <div className="font-serif text-2xl font-light text-[#C9A227]">
                          {countdown?.hours || 0}
                        </div>
                        <span className="text-[9px] uppercase tracking-wider text-neutral-400">Hours</span>
                      </div>
                    </div>

                    <button
                      onClick={() => setActiveTab('events')}
                      className="w-full py-2.5 rounded-full text-[11px] font-semibold uppercase tracking-wider bg-[#C9A227] hover:bg-[#d8b030] text-[#1C1B1A] transition-colors"
                    >
                      View Milestone Checklist
                    </button>
                  </div>
                </div>

                {/* Quick Action Tiles */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  <div
                    onClick={() => setActiveTab('messages')}
                    className="p-6 rounded-2xl bg-white border border-neutral-300 shadow-sm hover:border-[#C9A227] cursor-pointer transition-all space-y-2"
                  >
                    <div className="w-10 h-10 rounded-xl bg-[#FAF7F2] border border-[#C9A227]/40 flex items-center justify-center text-[#C9A227]">
                      <MessageSquare className="w-5 h-5" />
                    </div>
                    <h3 className="font-serif text-lg font-medium text-[#1C1B1A]">Concierge Chat</h3>
                    <p className="text-xs text-neutral-500">
                      Direct line with Éléonore Vance. 1 unread update.
                    </p>
                  </div>

                  <div
                    onClick={() => setActiveTab('documents')}
                    className="p-6 rounded-2xl bg-white border border-neutral-300 shadow-sm hover:border-[#C9A227] cursor-pointer transition-all space-y-2"
                  >
                    <div className="w-10 h-10 rounded-xl bg-[#FAF7F2] border border-[#C9A227]/40 flex items-center justify-center text-[#C9A227]">
                      <FileText className="w-5 h-5" />
                    </div>
                    <h3 className="font-serif text-lg font-medium text-[#1C1B1A]">Event Dossier</h3>
                    <p className="text-xs text-neutral-500">
                      {documents.length} contracts, mood boards & floor plans.
                    </p>
                  </div>

                  <div
                    onClick={() => setActiveTab('payments')}
                    className="p-6 rounded-2xl bg-white border border-neutral-300 shadow-sm hover:border-[#C9A227] cursor-pointer transition-all space-y-2"
                  >
                    <div className="w-10 h-10 rounded-xl bg-[#FAF7F2] border border-[#C9A227]/40 flex items-center justify-center text-[#C9A227]">
                      <CreditCard className="w-5 h-5" />
                    </div>
                    <h3 className="font-serif text-lg font-medium text-[#1C1B1A]">Settlements</h3>
                    <p className="text-xs text-neutral-500">
                      View deposit retainers & upcoming tranches.
                    </p>
                  </div>

                  <div
                    onClick={() => setActiveTab('events')}
                    className="p-6 rounded-2xl bg-white border border-neutral-300 shadow-sm hover:border-[#C9A227] cursor-pointer transition-all space-y-2"
                  >
                    <div className="w-10 h-10 rounded-xl bg-[#FAF7F2] border border-[#C9A227]/40 flex items-center justify-center text-[#C9A227]">
                      <CheckCircle2 className="w-5 h-5" />
                    </div>
                    <h3 className="font-serif text-lg font-medium text-[#1C1B1A]">Timeline</h3>
                    <p className="text-xs text-neutral-500">
                      {activeBooking.milestones.filter((m) => m.completed).length} of{' '}
                      {activeBooking.milestones.length} milestones signed off.
                    </p>
                  </div>
                </div>
              </>
            ) : (
              <div className="bg-white rounded-3xl p-12 text-center border border-neutral-300 space-y-4">
                <p className="font-serif text-2xl">No Active Bookings</p>
                <p className="text-xs text-neutral-500 max-w-sm mx-auto">
                  You have not yet commissioned an event with Lumière. Start planning your milestone celebration today.
                </p>
                <button
                  onClick={() => onNavigate('book')}
                  className="px-6 py-3 rounded-full bg-[#C9A227] text-[#1C1B1A] text-xs font-semibold uppercase tracking-wider"
                >
                  Commission An Event
                </button>
              </div>
            )}
          </div>
        )}

        {/* TAB 2: MY EVENTS & MILESTONES */}
        {activeTab === 'events' && (
          <div className="space-y-8 animate-fade-in">
            {activeBooking ? (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Bookings List Selector */}
                <div className="lg:col-span-4 space-y-4">
                  <h3 className="font-serif text-xl font-light">Your Commissions</h3>
                  <div className="space-y-3">
                    {bookings.map((b) => (
                      <button
                        key={b.id}
                        onClick={() => setSelectedBooking(b)}
                        className={`w-full p-4 rounded-2xl text-left border transition-all ${
                          selectedBooking?.id === b.id
                            ? 'bg-[#1C1B1A] text-white border-[#C9A227] shadow-md'
                            : 'bg-white hover:bg-neutral-50 text-neutral-800 border-neutral-300'
                        }`}
                      >
                        <div className="flex items-center justify-between text-xs mb-1">
                          <span className="font-mono text-[10px] text-neutral-400">{b.bookingNumber}</span>
                          <span className="text-[10px] font-bold text-[#C9A227] uppercase">{b.status}</span>
                        </div>
                        <h4 className="font-serif text-lg font-medium">{b.eventType}</h4>
                        <p className="text-xs text-neutral-400 mt-1">{b.eventDate} • {b.venue}</p>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Milestone Checklist Details */}
                <div className="lg:col-span-8 bg-white p-6 sm:p-8 rounded-3xl border border-neutral-300 shadow-md space-y-6">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-neutral-200">
                    <div>
                      <span className="text-xs text-[#C9A227] uppercase tracking-wider font-semibold">
                        {activeBooking.packageTier} Tier Production
                      </span>
                      <h3 className="font-serif text-2xl font-light text-[#1C1B1A]">
                        Milestones & Scenography Sign-Offs
                      </h3>
                    </div>
                    <div className="text-xs bg-[#FAF7F2] px-4 py-2 rounded-xl border border-neutral-300">
                      <strong>Readiness:</strong> {progressPercent}%
                    </div>
                  </div>

                  <p className="text-xs text-neutral-600 leading-relaxed font-light">
                    Click any milestone to mark approval or review progress with your lead producer.
                  </p>

                  {/* Checklist items */}
                  <div className="space-y-3">
                    {activeBooking.milestones.map((m) => (
                      <div
                        key={m.id}
                        onClick={() => handleToggleMilestone(m.id)}
                        className={`p-4 rounded-xl border cursor-pointer flex items-center justify-between gap-4 transition-all ${
                          m.completed
                            ? 'bg-emerald-50/50 border-emerald-300/80 text-emerald-950'
                            : 'bg-[#FAF7F2] border-neutral-200 text-neutral-800 hover:border-[#C9A227]'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-6 h-6 rounded-full flex items-center justify-center transition-colors ${
                              m.completed ? 'bg-emerald-600 text-white' : 'border border-neutral-400 bg-white'
                            }`}
                          >
                            {m.completed && <CheckCircle2 className="w-4 h-4" />}
                          </div>
                          <div>
                            <span className={`text-xs font-medium block ${m.completed ? 'line-through text-neutral-500' : ''}`}>
                              {m.title}
                            </span>
                            <span className="text-[10px] text-neutral-500">
                              Target Date: {m.dueDate} {m.category && `• ${m.category}`}
                            </span>
                          </div>
                        </div>

                        <span className="text-[10px] font-semibold uppercase tracking-wider px-2.5 py-1 rounded-full bg-white border border-neutral-300 text-neutral-600">
                          {m.completed ? 'Approved' : 'Pending Sign-Off'}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <p className="text-center py-12 text-neutral-500">No events found.</p>
            )}
          </div>
        )}

        {/* TAB 3: DOCUMENTS */}
        {activeTab === 'documents' && (
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-neutral-300 shadow-md space-y-6 animate-fade-in">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-neutral-200">
              <div>
                <span className="text-xs text-[#C9A227] uppercase tracking-wider font-semibold">
                  Confidential Files
                </span>
                <h3 className="font-serif text-2xl font-light text-[#1C1B1A]">
                  Event Dossier & Architectural Plans
                </h3>
              </div>
              <button
                onClick={() => setShowUploadModal(true)}
                className="px-4 py-2.5 rounded-full text-xs uppercase tracking-wider font-semibold bg-[#1C1B1A] text-white hover:bg-neutral-800 transition-colors flex items-center gap-2"
              >
                <Upload className="w-3.5 h-3.5 text-[#C9A227]" />
                <span>Upload Document</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {documents.map((doc) => (
                <div
                  key={doc.id}
                  className="p-5 rounded-2xl bg-[#FAF7F2] border border-neutral-300 flex flex-col justify-between space-y-4 hover:shadow-md transition-shadow"
                >
                  <div className="space-y-2">
                    <span className="text-[10px] uppercase font-bold tracking-wider text-[#A37F14] block">
                      {doc.category}
                    </span>
                    <h4 className="font-medium text-xs text-[#1C1B1A] leading-snug">{doc.name}</h4>
                    <p className="text-[11px] text-neutral-500">
                      Size: {doc.size} • Uploaded {doc.uploadedAt.split('T')[0]}
                    </p>
                  </div>
                  <button
                    onClick={() =>
                      toast({
                        type: 'info',
                        title: 'Document Download',
                        message: `Accessing encrypted copy of ${doc.name}`,
                      })
                    }
                    className="w-full py-2 rounded-lg bg-white border border-neutral-300 hover:border-[#1C1B1A] text-xs font-medium text-neutral-800 flex items-center justify-center gap-2 transition-colors"
                  >
                    <Download className="w-3.5 h-3.5 text-[#C9A227]" />
                    <span>Download PDF</span>
                  </button>
                </div>
              ))}
            </div>

            {documents.length === 0 && (
              <p className="text-center py-12 text-neutral-500">No documents uploaded yet.</p>
            )}
          </div>
        )}

        {/* TAB 4: CONCIERGE MESSAGES */}
        {activeTab === 'messages' && (
          <div className="bg-white rounded-3xl border border-neutral-300 shadow-md overflow-hidden flex flex-col h-[600px] animate-fade-in">
            {/* Header */}
            <div className="p-4 sm:p-6 bg-[#1C1B1A] text-white flex items-center justify-between border-b border-[#C9A227]/30">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full overflow-hidden border border-[#C9A227]">
                  <img
                    src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80"
                    alt="Éléonore Vance"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <h4 className="font-serif text-base font-light">Éléonore Vance</h4>
                  <p className="text-[10px] text-[#C9A227] uppercase tracking-wider">
                    Founder & Lead Producer • Paris Atelier
                  </p>
                </div>
              </div>
              <span className="text-[11px] text-neutral-400 font-mono">
                Booking: {activeBooking?.bookingNumber}
              </span>
            </div>

            {/* Message Thread */}
            <div className="flex-1 p-6 overflow-y-auto space-y-4 bg-[#FAF7F2]">
              {messages.map((m) => {
                const isMe = m.senderRole === 'CLIENT';
                return (
                  <div
                    key={m.id}
                    className={`flex flex-col ${isMe ? 'items-end' : 'items-start'} max-w-xl ${
                      isMe ? 'ml-auto' : 'mr-auto'
                    }`}
                  >
                    <div className="text-[10px] text-neutral-500 mb-1 px-1">
                      {m.senderName} • {new Date(m.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                    <div
                      className={`p-4 rounded-2xl text-xs leading-relaxed shadow-sm ${
                        isMe
                          ? 'bg-[#1C1B1A] text-[#FAF7F2] rounded-tr-none'
                          : 'bg-white text-neutral-900 border border-neutral-300 rounded-tl-none'
                      }`}
                    >
                      {m.body}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Input form */}
            <form onSubmit={handleSendMessage} className="p-4 bg-white border-t border-neutral-200 flex gap-3">
              <input
                type="text"
                value={newMessageText}
                onChange={(e) => setNewMessageText(e.target.value)}
                placeholder="Type a confidential note to your lead producer..."
                className="flex-1 px-4 py-3 rounded-xl border border-neutral-300 text-xs focus:outline-none focus:border-[#C9A227]"
              />
              <button
                type="submit"
                className="px-6 py-3 rounded-xl bg-[#C9A227] hover:bg-[#d8b030] text-[#1C1B1A] font-semibold text-xs uppercase tracking-wider transition-colors flex items-center gap-2"
              >
                <span>Send</span>
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>
          </div>
        )}

        {/* TAB 5: PAYMENTS & INVOICES */}
        {activeTab === 'payments' && (
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-neutral-300 shadow-md space-y-6 animate-fade-in">
            <div className="pb-4 border-b border-neutral-200">
              <span className="text-xs text-[#C9A227] uppercase tracking-wider font-semibold">
                Financial Registry
              </span>
              <h3 className="font-serif text-2xl font-light text-[#1C1B1A]">
                Invoices & Production Retainers
              </h3>
            </div>

            <div className="space-y-4">
              {invoices.map((inv) => (
                <div
                  key={inv.id}
                  className="p-6 rounded-2xl bg-[#FAF7F2] border border-neutral-300 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-3">
                      <span className="font-mono text-xs text-neutral-500 font-bold">
                        {inv.invoiceNumber}
                      </span>
                      <span
                        className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full ${
                          inv.status === 'PAID'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {inv.status}
                      </span>
                    </div>
                    <h4 className="font-serif text-lg font-medium text-[#1C1B1A]">{inv.eventTitle}</h4>
                    <p className="text-xs text-neutral-500">Due by: {inv.dueDate}</p>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <div className="font-serif text-2xl font-light text-[#1C1B1A]">
                        ${inv.amount.toLocaleString()} USD
                      </div>
                    </div>

                    {inv.status !== 'PAID' ? (
                      <button
                        onClick={() => setPayingInvoice(inv)}
                        className="px-5 py-2.5 rounded-full text-xs uppercase tracking-wider font-semibold bg-[#C9A227] hover:bg-[#d8b030] text-[#1C1B1A] transition-colors"
                      >
                        Pay Tranche
                      </button>
                    ) : (
                      <button
                        onClick={() =>
                          toast({
                            type: 'info',
                            title: 'Official Receipt',
                            message: `Payment receipt generated for ${inv.invoiceNumber}.`,
                          })
                        }
                        className="px-4 py-2 rounded-full text-xs font-medium border border-neutral-300 hover:border-neutral-600 text-neutral-700 transition-colors"
                      >
                        Receipt
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 6: SETTINGS */}
        {activeTab === 'settings' && (
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-neutral-300 shadow-md space-y-6 max-w-2xl animate-fade-in">
            <div className="pb-4 border-b border-neutral-200">
              <span className="text-xs text-[#C9A227] uppercase tracking-wider font-semibold">
                Patron Profile
              </span>
              <h3 className="font-serif text-2xl font-light text-[#1C1B1A]">
                Contact & Notification Settings
              </h3>
            </div>

            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs uppercase tracking-wider text-neutral-700 font-medium block">
                  Full Legal Name
                </label>
                <input
                  type="text"
                  defaultValue={currentUser.name}
                  className="w-full px-4 py-3 rounded-xl border border-neutral-300 text-xs"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs uppercase tracking-wider text-neutral-700 font-medium block">
                  Email Address
                </label>
                <input
                  type="email"
                  defaultValue={currentUser.email}
                  className="w-full px-4 py-3 rounded-xl border border-neutral-300 text-xs"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs uppercase tracking-wider text-neutral-700 font-medium block">
                  Direct Concierge Phone
                </label>
                <input
                  type="tel"
                  defaultValue={currentUser.phone}
                  className="w-full px-4 py-3 rounded-xl border border-neutral-300 text-xs"
                />
              </div>

              <button
                onClick={() =>
                  toast({
                    type: 'success',
                    title: 'Settings Saved',
                    message: 'Your profile updates have been registered.',
                  })
                }
                className="px-6 py-3 rounded-full bg-[#1C1B1A] text-white text-xs font-semibold uppercase tracking-wider hover:bg-neutral-800 transition-colors"
              >
                Save Preferences
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Upload Doc Modal */}
      {showUploadModal && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in"
        >
          <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-4 border border-neutral-300 text-xs">
            <h3 className="font-serif text-2xl font-light">Add Document to Dossier</h3>
            <form onSubmit={handleUploadDoc} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs uppercase font-medium">Document Title</label>
                <input
                  type="text"
                  required
                  value={newDocName}
                  onChange={(e) => setNewDocName(e.target.value)}
                  placeholder="e.g. French Riviera Floral Mood Board v5"
                  className="w-full px-3 py-2.5 rounded-lg border border-neutral-300 text-xs"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs uppercase font-medium">Category</label>
                <select
                  value={newDocCategory}
                  onChange={(e) => setNewDocCategory(e.target.value as any)}
                  className="w-full px-3 py-2.5 rounded-lg border border-neutral-300 text-xs bg-white"
                >
                  <option value="Mood Board">Mood Board</option>
                  <option value="Floor Plan">Floor Plan</option>
                  <option value="Contract">Contract</option>
                  <option value="Invoice">Invoice</option>
                </select>
              </div>

              <div className="pt-2 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowUploadModal(false)}
                  className="px-4 py-2 rounded-full border border-neutral-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-full bg-[#C9A227] text-[#1C1B1A] font-semibold"
                >
                  Upload & Register
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Pay Invoice Modal */}
      {payingInvoice && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in"
        >
          <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-4 border border-neutral-300 text-xs">
            <div className="flex justify-between items-center pb-2 border-b">
              <h3 className="font-serif text-2xl font-light">Settle Invoice Tranche</h3>
              <button onClick={() => setPayingInvoice(null)}>✕</button>
            </div>
            <div className="space-y-2">
              <p className="font-semibold text-neutral-800">{payingInvoice.eventTitle}</p>
              <div className="font-serif text-3xl text-[#C9A227]">
                ${payingInvoice.amount.toLocaleString()} USD
              </div>
              <p className="text-neutral-500 text-[11px]">
                Stripe Test Mode Gateway. Card ending in 4242 will be charged in simulation mode.
              </p>
            </div>
            <div className="pt-4 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setPayingInvoice(null)}
                className="px-4 py-2 rounded-full border border-neutral-300"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => handlePayInvoice(payingInvoice)}
                className="px-6 py-2 rounded-full bg-[#C9A227] hover:bg-[#d8b030] text-[#1C1B1A] font-semibold uppercase tracking-wider"
              >
                Confirm Payment
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
