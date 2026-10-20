import React, { useState, useEffect } from 'react';
import {
  Shield,
  Calendar,
  DollarSign,
  Inbox,
  Image,
  Search,
  Filter,
  CheckCircle,
  XCircle,
  Eye,
  Trash2,
  Plus,
  Send,
  Sparkles,
  ArrowRight,
  User,
  Clock,
  Tag,
} from 'lucide-react';
import {
  getCurrentUser,
  setCurrentUser,
  getBookings,
  updateBookingStatus,
  getGalleryImages,
  addGalleryImage,
  deleteGalleryImage,
  getInquiries,
  replyToInquiry,
  updateInquiryStatus,
  subscribeToStore,
} from '../../services/storage';
import { SEED_USERS } from '../../data/seedData';
import { Booking, GalleryImage, Inquiry, BookingStatus } from '../../types/index';
import { useToast } from '../ui/Toast';

interface AdminPanelProps {
  onNavigate: (page: string) => void;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({ onNavigate }) => {
  const { toast } = useToast();
  const [currentUser, setUser] = useState(getCurrentUser());
  const [activeTab, setActiveTab] = useState<'dashboard' | 'bookings' | 'gallery' | 'inquiries'>('dashboard');

  // Data states
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [gallery, setGallery] = useState<GalleryImage[]>([]);
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);

  // Search & Filter
  const [bookingSearch, setBookingSearch] = useState('');
  const [bookingStatusFilter, setBookingStatusFilter] = useState<string>('ALL');

  // Booking details modal
  const [viewingBooking, setViewingBooking] = useState<Booking | null>(null);

  // Gallery add modal
  const [showAddImageModal, setShowAddImageModal] = useState(false);
  const [newImage, setNewImage] = useState({
    title: '',
    url: '',
    category: 'Weddings' as GalleryImage['category'],
    caption: '',
    location: '',
  });

  // Reply inquiry state
  const [replyingInquiry, setReplyingInquiry] = useState<Inquiry | null>(null);
  const [replyText, setReplyText] = useState('');

  // Sync data
  useEffect(() => {
    const refresh = () => {
      setUser(getCurrentUser());
      setBookings(getBookings());
      setGallery(getGalleryImages());
      setInquiries(getInquiries());
    };
    refresh();
    const unsub = subscribeToStore(refresh);
    return () => unsub();
  }, []);

  const handleAdminLogin = () => {
    setCurrentUser(SEED_USERS[0]);
    setUser(SEED_USERS[0]);
    toast({
      type: 'success',
      title: 'Authenticated as Director',
      message: 'Accessing Lumière Master Management Console.',
    });
  };

  // If user is not ADMIN, show access protection with 1-click switch
  if (currentUser?.role !== 'ADMIN') {
    return (
      <div className="pt-28 pb-20 bg-[#FAF7F2] text-[#1C1B1A] min-h-screen flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-white rounded-3xl border border-neutral-300 shadow-2xl p-8 sm:p-10 text-center space-y-6">
          <div className="w-14 h-14 rounded-full bg-[#1C1B1A] text-[#C9A227] flex items-center justify-center mx-auto border border-[#C9A227]">
            <Shield className="w-7 h-7" />
          </div>
          <div className="space-y-2">
            <span className="text-[10px] uppercase tracking-widest text-[#C9A227] font-semibold block">
              Restricted Atelier Access
            </span>
            <h1 className="font-serif text-3xl font-light text-[#1C1B1A]">Director Console</h1>
            <p className="text-xs text-neutral-500 font-light leading-relaxed">
              This area is reserved for Lumière executive producers and administrators. Log in as Éléonore Vance to manage calendar bookings, gallery assets, and client inquiries.
            </p>
          </div>

          <button
            onClick={handleAdminLogin}
            className="w-full py-3.5 rounded-full text-xs font-semibold uppercase tracking-wider bg-[#C9A227] hover:bg-[#d8b030] text-[#1C1B1A] transition-all shadow-md"
          >
            Authenticate As Admin (Éléonore Vance)
          </button>
          <button
            onClick={() => onNavigate('home')}
            className="text-xs text-neutral-500 hover:text-neutral-900 transition-colors"
          >
            Return to Public Website
          </button>
        </div>
      </div>
    );
  }

  // KPI calculations
  const totalRevenue = bookings.reduce((sum, b) => sum + b.totalAmount, 0);
  const pendingCount = bookings.filter((b) => b.status === 'PENDING').length;
  const newInquiriesCount = inquiries.filter((i) => i.status === 'NEW').length;
  const upcomingCount = bookings.filter((b) => b.status === 'CONFIRMED').length;

  // Filtered bookings
  const filteredBookings = bookings.filter((b) => {
    const matchesSearch =
      b.clientName.toLowerCase().includes(bookingSearch.toLowerCase()) ||
      b.bookingNumber.toLowerCase().includes(bookingSearch.toLowerCase()) ||
      b.venue.toLowerCase().includes(bookingSearch.toLowerCase()) ||
      b.eventType.toLowerCase().includes(bookingSearch.toLowerCase());
    const matchesStatus =
      bookingStatusFilter === 'ALL' || b.status === bookingStatusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleStatusChange = (bookingId: string, status: BookingStatus) => {
    updateBookingStatus(bookingId, status);
    toast({
      type: 'success',
      title: 'Status Updated',
      message: `Booking has been updated to ${status}.`,
    });
    if (viewingBooking?.id === bookingId) {
      setViewingBooking((prev) => (prev ? { ...prev, status } : null));
    }
  };

  const handleAddImage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newImage.title || !newImage.url) return;
    addGalleryImage({
      title: newImage.title,
      url: newImage.url,
      category: newImage.category,
      caption: newImage.caption || 'Lumière exclusive private commission.',
      location: newImage.location || 'Paris, France',
      featured: true,
      aspectRatio: 'wide',
    });
    setShowAddImageModal(false);
    setNewImage({
      title: '',
      url: '',
      category: 'Weddings',
      caption: '',
      location: '',
    });
    toast({
      type: 'success',
      title: 'Gallery Image Published',
      message: 'New photograph added to public portfolio.',
    });
  };

  const handleDeleteImage = (id: string) => {
    deleteGalleryImage(id);
    toast({
      type: 'info',
      title: 'Image Removed',
      message: 'Image deleted from atelier gallery.',
    });
  };

  const handleSendReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyingInquiry || !replyText.trim()) return;
    replyToInquiry(replyingInquiry.id, replyText.trim());
    setReplyingInquiry(null);
    setReplyText('');
    toast({
      type: 'success',
      title: 'Reply Dispatched to Patron',
      message: `Inquiry response sent to ${replyingInquiry.email}.`,
    });
  };

  return (
    <div className="pt-24 pb-20 bg-[#FAF7F2] text-[#1C1B1A] min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Bar */}
        <div className="bg-[#1C1B1A] text-[#FAF7F2] rounded-3xl p-6 sm:p-8 mb-8 border border-[#C9A227]/30 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-[#C9A227] font-semibold">
              <Shield className="w-3.5 h-3.5" />
              <span>Executive Atelier Administration</span>
            </div>
            <h1 className="font-serif text-3xl font-light">Director Control Console</h1>
            <p className="text-xs text-neutral-400">
              Welcome, {currentUser.name}. Managing commissions, assets, and VIP inquiries.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => onNavigate('portal')}
              className="px-4 py-2 rounded-full text-xs uppercase tracking-wider font-semibold border border-neutral-700 hover:border-[#C9A227] text-neutral-300 transition-colors"
            >
              Client View
            </button>
            <button
              onClick={() => onNavigate('home')}
              className="px-4 py-2 rounded-full text-xs uppercase tracking-wider font-semibold bg-[#C9A227] hover:bg-[#d8b030] text-[#1C1B1A] transition-colors"
            >
              Public Site
            </button>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-6 border-b border-neutral-300">
          {[
            { id: 'dashboard', label: 'Executive KPIs', icon: <Sparkles className="w-4 h-4" /> },
            { id: 'bookings', label: `Commissions (${bookings.length})`, icon: <Calendar className="w-4 h-4" /> },
            { id: 'inquiries', label: `Inquiries (${newInquiriesCount} New)`, icon: <Inbox className="w-4 h-4" /> },
            { id: 'gallery', label: `Gallery Manager (${gallery.length})`, icon: <Image className="w-4 h-4" /> },
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

        {/* TAB 1: EXECUTIVE KPIS */}
        {activeTab === 'dashboard' && (
          <div className="space-y-8 animate-fade-in">
            {/* 4 Stat Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="p-6 rounded-2xl bg-white border border-neutral-300 shadow-sm space-y-2">
                <span className="text-[10px] uppercase tracking-wider text-neutral-500 font-semibold block">
                  Total Active Commissions
                </span>
                <div className="font-serif text-3xl font-light text-[#1C1B1A]">
                  {bookings.length}
                </div>
                <p className="text-xs text-neutral-500">{upcomingCount} confirmed in production</p>
              </div>

              <div className="p-6 rounded-2xl bg-white border border-neutral-300 shadow-sm space-y-2">
                <span className="text-[10px] uppercase tracking-wider text-[#A37F14] font-semibold block">
                  Committed Production Volume
                </span>
                <div className="font-serif text-3xl font-light text-[#C9A227]">
                  ${totalRevenue.toLocaleString()} USD
                </div>
                <p className="text-xs text-neutral-500">Gross contract value</p>
              </div>

              <div className="p-6 rounded-2xl bg-white border border-neutral-300 shadow-sm space-y-2">
                <span className="text-[10px] uppercase tracking-wider text-amber-700 font-semibold block">
                  Pending Holds & Deposits
                </span>
                <div className="font-serif text-3xl font-light text-amber-600">
                  {pendingCount}
                </div>
                <p className="text-xs text-neutral-500">Awaiting patron wire / review</p>
              </div>

              <div className="p-6 rounded-2xl bg-white border border-neutral-300 shadow-sm space-y-2">
                <span className="text-[10px] uppercase tracking-wider text-neutral-500 font-semibold block">
                  VIP Inquiries Awaiting Reply
                </span>
                <div className="font-serif text-3xl font-light text-[#1C1B1A]">
                  {newInquiriesCount}
                </div>
                <p className="text-xs text-neutral-500">Contact submissions in queue</p>
              </div>
            </div>

            {/* Recent Bookings Quick Table */}
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-neutral-300 shadow-md space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-neutral-200">
                <h3 className="font-serif text-xl font-light text-[#1C1B1A]">
                  Upcoming Atelier Productions
                </h3>
                <button
                  onClick={() => setActiveTab('bookings')}
                  className="text-xs uppercase font-medium text-[#A37F14] hover:underline"
                >
                  View All Bookings →
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left">
                  <thead>
                    <tr className="border-b border-neutral-200 text-neutral-500 uppercase tracking-wider">
                      <th className="pb-3">Reference</th>
                      <th className="pb-3">Patron</th>
                      <th className="pb-3">Category</th>
                      <th className="pb-3">Date</th>
                      <th className="pb-3">Status</th>
                      <th className="pb-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-100">
                    {bookings.slice(0, 4).map((b) => (
                      <tr key={b.id} className="hover:bg-neutral-50">
                        <td className="py-3 font-mono font-bold text-neutral-700">{b.bookingNumber}</td>
                        <td className="py-3 font-medium text-neutral-900">{b.clientName}</td>
                        <td className="py-3">{b.eventType}</td>
                        <td className="py-3 text-neutral-600">{b.eventDate}</td>
                        <td className="py-3">
                          <span
                            className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                              b.status === 'CONFIRMED'
                                ? 'bg-emerald-100 text-emerald-800'
                                : b.status === 'PENDING'
                                ? 'bg-amber-100 text-amber-800'
                                : b.status === 'COMPLETED'
                                ? 'bg-blue-100 text-blue-800'
                                : 'bg-red-100 text-red-800'
                            }`}
                          >
                            {b.status}
                          </span>
                        </td>
                        <td className="py-3 text-right">
                          <button
                            onClick={() => setViewingBooking(b)}
                            className="px-3 py-1 rounded-full border border-neutral-300 hover:border-neutral-700 text-[11px]"
                          >
                            Review
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: BOOKINGS TABLE */}
        {activeTab === 'bookings' && (
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-neutral-300 shadow-md space-y-6 animate-fade-in">
            {/* Filter Controls */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="relative flex-1 max-w-md">
                <Search className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={bookingSearch}
                  onChange={(e) => setBookingSearch(e.target.value)}
                  placeholder="Search by patron name, ref #, or venue..."
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-neutral-300 text-xs focus:outline-none focus:border-[#C9A227]"
                />
              </div>

              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-neutral-400" />
                <select
                  value={bookingStatusFilter}
                  onChange={(e) => setBookingStatusFilter(e.target.value)}
                  className="px-3 py-2 rounded-xl border border-neutral-300 text-xs bg-white focus:outline-none focus:border-[#C9A227]"
                >
                  <option value="ALL">All Statuses</option>
                  <option value="CONFIRMED">CONFIRMED</option>
                  <option value="PENDING">PENDING</option>
                  <option value="COMPLETED">COMPLETED</option>
                  <option value="CANCELLED">CANCELLED</option>
                </select>
              </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead>
                  <tr className="border-b border-neutral-200 text-neutral-500 uppercase tracking-wider">
                    <th className="p-3">Ref</th>
                    <th className="p-3">Client</th>
                    <th className="p-3">Event & Venue</th>
                    <th className="p-3">Target Date</th>
                    <th className="p-3">Tier</th>
                    <th className="p-3">Status</th>
                    <th className="p-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100">
                  {filteredBookings.map((b) => (
                    <tr key={b.id} className="hover:bg-neutral-50">
                      <td className="p-3 font-mono font-bold text-neutral-800">{b.bookingNumber}</td>
                      <td className="p-3">
                        <div className="font-medium text-neutral-900">{b.clientName}</div>
                        <div className="text-[10px] text-neutral-400">{b.clientEmail}</div>
                      </td>
                      <td className="p-3 max-w-xs">
                        <div className="font-medium text-neutral-800">{b.eventType}</div>
                        <div className="text-[10px] text-neutral-500 truncate">{b.venue}</div>
                      </td>
                      <td className="p-3 text-neutral-700">{b.eventDate}</td>
                      <td className="p-3 font-medium text-neutral-800">{b.packageTier}</td>
                      <td className="p-3">
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                            b.status === 'CONFIRMED'
                              ? 'bg-emerald-100 text-emerald-800'
                              : b.status === 'PENDING'
                              ? 'bg-amber-100 text-amber-800'
                              : b.status === 'COMPLETED'
                              ? 'bg-blue-100 text-blue-800'
                              : 'bg-red-100 text-red-800'
                          }`}
                        >
                          {b.status}
                        </span>
                      </td>
                      <td className="p-3 text-right">
                        <button
                          onClick={() => setViewingBooking(b)}
                          className="px-3 py-1 rounded-full border border-neutral-300 hover:border-neutral-800 text-[11px] font-medium transition-colors"
                        >
                          Details & Actions
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 3: INQUIRIES */}
        {activeTab === 'inquiries' && (
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-neutral-300 shadow-md space-y-6 animate-fade-in">
            <div className="pb-3 border-b border-neutral-200">
              <h3 className="font-serif text-2xl font-light text-[#1C1B1A]">
                Patron Contact Submissions
              </h3>
            </div>

            <div className="space-y-4">
              {inquiries.map((inq) => (
                <div
                  key={inq.id}
                  className="p-6 rounded-2xl bg-[#FAF7F2] border border-neutral-300 space-y-3"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="flex items-center gap-3">
                      <span className="font-serif text-lg font-medium text-[#1C1B1A]">
                        {inq.name}
                      </span>
                      <span
                        className={`text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full ${
                          inq.status === 'NEW'
                            ? 'bg-amber-100 text-amber-800'
                            : inq.status === 'RESPONDED'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-neutral-200 text-neutral-700'
                        }`}
                      >
                        {inq.status}
                      </span>
                    </div>
                    <span className="text-[11px] text-neutral-400">
                      {new Date(inq.createdAt).toLocaleDateString()}
                    </span>
                  </div>

                  <div className="text-xs text-neutral-600 flex flex-wrap gap-4">
                    <span>Email: <strong>{inq.email}</strong></span>
                    <span>Phone: <strong>{inq.phone}</strong></span>
                    <span>Event: <strong>{inq.eventType}</strong></span>
                    {inq.budget && <span>Budget: <strong>{inq.budget}</strong></span>}
                  </div>

                  <p className="text-xs text-neutral-700 bg-white p-4 rounded-xl border border-neutral-200 leading-relaxed font-light">
                    "{inq.message}"
                  </p>

                  {inq.adminReply && (
                    <div className="text-xs text-neutral-700 bg-[#1C1B1A] text-[#FAF7F2] p-4 rounded-xl space-y-1">
                      <span className="text-[10px] text-[#C9A227] uppercase font-bold tracking-wider block">
                        Atelier Reply Sent:
                      </span>
                      <p>{inq.adminReply}</p>
                    </div>
                  )}

                  <div className="pt-2 flex justify-end gap-3">
                    <button
                      onClick={() => setReplyingInquiry(inq)}
                      className="px-4 py-2 rounded-full bg-[#1C1B1A] text-white hover:bg-neutral-800 text-xs font-semibold uppercase tracking-wider"
                    >
                      Reply to Patron
                    </button>
                    {inq.status !== 'ARCHIVED' && (
                      <button
                        onClick={() => {
                          updateInquiryStatus(inq.id, 'ARCHIVED');
                          toast({ title: 'Inquiry Archived' });
                        }}
                        className="px-3 py-1.5 rounded-full border border-neutral-300 text-xs text-neutral-600"
                      >
                        Archive
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 4: GALLERY MANAGER */}
        {activeTab === 'gallery' && (
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-neutral-300 shadow-md space-y-6 animate-fade-in">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-neutral-200">
              <div>
                <h3 className="font-serif text-2xl font-light text-[#1C1B1A]">
                  Haute Gallery Photography Portfolio
                </h3>
                <p className="text-xs text-neutral-500">
                  Manage high-resolution imagery displayed across the public gallery and hero sections.
                </p>
              </div>
              <button
                onClick={() => setShowAddImageModal(true)}
                className="px-5 py-2.5 rounded-full bg-[#C9A227] hover:bg-[#d8b030] text-[#1C1B1A] text-xs font-semibold uppercase tracking-wider flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                <span>Add Image</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {gallery.map((img) => (
                <div
                  key={img.id}
                  className="rounded-2xl overflow-hidden border border-neutral-300 bg-[#FAF7F2] shadow-sm flex flex-col justify-between"
                >
                  <div className="aspect-[4/3] overflow-hidden relative">
                    <img src={img.url} alt={img.title} className="w-full h-full object-cover" />
                    <span className="absolute top-2 left-2 px-2 py-0.5 rounded-full bg-black/70 text-[10px] text-[#C9A227] uppercase">
                      {img.category}
                    </span>
                  </div>
                  <div className="p-4 space-y-1">
                    <h4 className="font-serif text-sm font-medium text-[#1C1B1A] line-clamp-1">
                      {img.title}
                    </h4>
                    <p className="text-[11px] text-neutral-500">{img.location}</p>
                    <div className="pt-3 border-t border-neutral-200 flex justify-end">
                      <button
                        onClick={() => handleDeleteImage(img.id)}
                        className="text-red-500 hover:text-red-700 p-1"
                        title="Delete Image"
                        aria-label="Delete Image"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Booking Details Modal */}
      {viewingBooking && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in"
        >
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 space-y-6 max-h-[90vh] overflow-y-auto border border-neutral-300 text-xs">
            <div className="flex items-center justify-between pb-3 border-b">
              <div>
                <span className="text-[10px] font-mono text-neutral-400">
                  Ref: {viewingBooking.bookingNumber}
                </span>
                <h3 className="font-serif text-2xl font-light">{viewingBooking.eventType}</h3>
              </div>
              <button
                onClick={() => setViewingBooking(null)}
                className="text-neutral-400 hover:text-neutral-900 text-base"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-4 p-4 rounded-2xl bg-[#FAF7F2] border border-neutral-200">
                <div>
                  <span className="text-neutral-400 block text-[10px] uppercase">Patron:</span>
                  <span className="font-semibold text-neutral-800">{viewingBooking.clientName}</span>
                </div>
                <div>
                  <span className="text-neutral-400 block text-[10px] uppercase">Date:</span>
                  <span className="font-semibold text-neutral-800">{viewingBooking.eventDate}</span>
                </div>
                <div>
                  <span className="text-neutral-400 block text-[10px] uppercase">Tier:</span>
                  <span className="font-semibold text-neutral-800">{viewingBooking.packageTier}</span>
                </div>
                <div>
                  <span className="text-neutral-400 block text-[10px] uppercase">Guests:</span>
                  <span className="font-semibold text-neutral-800">{viewingBooking.guests}</span>
                </div>
                <div>
                  <span className="text-neutral-400 block text-[10px] uppercase">Retainer Paid:</span>
                  <span className="font-semibold text-emerald-700">
                    {viewingBooking.depositPaid ? `Yes ($${viewingBooking.depositAmount.toLocaleString()})` : 'Pending'}
                  </span>
                </div>
                <div>
                  <span className="text-neutral-400 block text-[10px] uppercase">Total Value:</span>
                  <span className="font-semibold text-neutral-800">${viewingBooking.totalAmount.toLocaleString()}</span>
                </div>
              </div>

              <div>
                <strong className="block mb-1 text-neutral-700">Venue & Scenography Notes:</strong>
                <p className="p-3 rounded-xl bg-neutral-50 border border-neutral-200 text-neutral-600 font-light">
                  {viewingBooking.notes || 'No special notes provided.'}
                </p>
              </div>

              {/* Status change actions */}
              <div className="pt-4 border-t border-neutral-200 space-y-2">
                <span className="text-xs uppercase font-medium text-neutral-500 block">
                  Change Production Status:
                </span>
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => handleStatusChange(viewingBooking.id, 'CONFIRMED')}
                    className="px-4 py-2 rounded-full bg-emerald-700 text-white font-medium hover:bg-emerald-800"
                  >
                    Approve (CONFIRMED)
                  </button>
                  <button
                    onClick={() => handleStatusChange(viewingBooking.id, 'COMPLETED')}
                    className="px-4 py-2 rounded-full bg-blue-700 text-white font-medium hover:bg-blue-800"
                  >
                    Mark COMPLETED
                  </button>
                  <button
                    onClick={() => handleStatusChange(viewingBooking.id, 'CANCELLED')}
                    className="px-4 py-2 rounded-full bg-red-700 text-white font-medium hover:bg-red-800"
                  >
                    Cancel Booking
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Gallery Image Modal */}
      {showAddImageModal && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in"
        >
          <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-4 border border-neutral-300 text-xs">
            <h3 className="font-serif text-2xl font-light">Publish Gallery Photograph</h3>
            <form onSubmit={handleAddImage} className="space-y-4">
              <div className="space-y-1">
                <label className="text-[11px] uppercase font-medium">Photograph Title *</label>
                <input
                  type="text"
                  required
                  value={newImage.title}
                  onChange={(e) => setNewImage({ ...newImage, title: e.target.value })}
                  placeholder="e.g. Grand Salon de Diane Reception"
                  className="w-full px-3 py-2 rounded-lg border border-neutral-300"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] uppercase font-medium">Image URL (Unsplash or direct) *</label>
                <input
                  type="url"
                  required
                  value={newImage.url}
                  onChange={(e) => setNewImage({ ...newImage, url: e.target.value })}
                  placeholder="https://images.unsplash.com/photo-..."
                  className="w-full px-3 py-2 rounded-lg border border-neutral-300"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[11px] uppercase font-medium">Category</label>
                  <select
                    value={newImage.category}
                    onChange={(e) => setNewImage({ ...newImage, category: e.target.value as any })}
                    className="w-full px-3 py-2 rounded-lg border border-neutral-300 bg-white"
                  >
                    <option value="Weddings">Weddings</option>
                    <option value="Corporate">Corporate</option>
                    <option value="Galas">Galas</option>
                    <option value="Private">Private</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-[11px] uppercase font-medium">Location</label>
                  <input
                    type="text"
                    value={newImage.location}
                    onChange={(e) => setNewImage({ ...newImage, location: e.target.value })}
                    placeholder="e.g. Versailles, France"
                    className="w-full px-3 py-2 rounded-lg border border-neutral-300"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[11px] uppercase font-medium">Caption</label>
                <input
                  type="text"
                  value={newImage.caption}
                  onChange={(e) => setNewImage({ ...newImage, caption: e.target.value })}
                  placeholder="Atmospheric architectural details..."
                  className="w-full px-3 py-2 rounded-lg border border-neutral-300"
                />
              </div>

              <div className="pt-2 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowAddImageModal(false)}
                  className="px-4 py-2 rounded-full border border-neutral-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-full bg-[#C9A227] text-[#1C1B1A] font-semibold"
                >
                  Publish To Portfolio
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Reply Inquiry Modal */}
      {replyingInquiry && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in"
        >
          <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-4 border border-neutral-300 text-xs">
            <h3 className="font-serif text-2xl font-light">Reply to {replyingInquiry.name}</h3>
            <p className="text-neutral-500 text-[11px]">Dispatching email to {replyingInquiry.email}</p>
            <form onSubmit={handleSendReply} className="space-y-4">
              <textarea
                required
                rows={4}
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                placeholder="Dear Patron, Thank you for inquiring regarding our atelier availability..."
                className="w-full p-3 rounded-xl border border-neutral-300 text-xs"
              />
              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setReplyingInquiry(null)}
                  className="px-4 py-2 rounded-full border border-neutral-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-full bg-[#1C1B1A] text-white font-semibold"
                >
                  Send Official Reply
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
