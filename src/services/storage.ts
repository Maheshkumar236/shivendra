import {
  User,
  Booking,
  GalleryImage,
  Inquiry,
  Message,
  DocumentItem,
  Invoice,
  BookingStatus,
} from '../types/index';
import {
  SEED_USERS,
  SEED_BOOKINGS,
  SEED_GALLERY,
  SEED_INQUIRIES,
  SEED_MESSAGES,
  SEED_DOCUMENTS,
  SEED_INVOICES,
} from '../data/seedData';

const STORAGE_KEYS = {
  CURRENT_USER: 'lumiere_current_user',
  BOOKINGS: 'lumiere_bookings',
  GALLERY: 'lumiere_gallery',
  INQUIRIES: 'lumiere_inquiries',
  MESSAGES: 'lumiere_messages',
  DOCUMENTS: 'lumiere_documents',
  INVOICES: 'lumiere_invoices',
};

type Listener = () => void;
const listeners: Set<Listener> = new Set();

function notifyListeners() {
  listeners.forEach((listener) => {
    try {
      listener();
    } catch (e) {
      console.error('Listener callback error', e);
    }
  });
}

export function subscribeToStore(listener: Listener): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

// Storage helpers
function loadFromStorage<T>(key: string, fallback: T): T {
  if (typeof window === 'undefined') return fallback;
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function saveToStorage<T>(key: string, value: T): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(key, JSON.stringify(value));
    notifyListeners();
  } catch (e) {
    console.error('Failed to save to localStorage', e);
  }
}

// User & Auth State
export function getCurrentUser(): User | null {
  return loadFromStorage<User | null>(STORAGE_KEYS.CURRENT_USER, SEED_USERS[1]); // Default to Clara for instant luxury client experience
}

export function setCurrentUser(user: User | null): void {
  saveToStorage(STORAGE_KEYS.CURRENT_USER, user);
}

export function loginUser(email: string, password?: string): { success: boolean; user?: User; error?: string } {
  const users = SEED_USERS;
  const found = users.find((u) => u.email.toLowerCase() === email.toLowerCase());
  if (!found) {
    return { success: false, error: 'No account found with this email address' };
  }
  if (password && found.password && found.password !== password) {
    return { success: false, error: 'Incorrect credentials provided' };
  }
  setCurrentUser(found);
  return { success: true, user: found };
}

export function logoutUser(): void {
  setCurrentUser(null);
}

// Bookings
export function getBookings(): Booking[] {
  return loadFromStorage<Booking[]>(STORAGE_KEYS.BOOKINGS, SEED_BOOKINGS);
}

export function getBookingsForUser(userId: string): Booking[] {
  const all = getBookings();
  return all.filter((b) => b.userId === userId || b.clientEmail === getCurrentUser()?.email);
}

export function createBooking(newBookingData: Omit<Booking, 'id' | 'bookingNumber' | 'createdAt' | 'milestones'>): Booking {
  const current = getBookings();
  const year = new Date().getFullYear();
  const randomSuffix = Math.floor(1000 + Math.random() * 9000);
  const bookingNumber = `LUM-${year}-${randomSuffix}`;
  
  const initialMilestones = [
    { id: `m-${Date.now()}-1`, title: 'Discovery & Creative Direction Brief Signed', dueDate: newBookingData.eventDate, completed: true, category: 'Onboarding' },
    { id: `m-${Date.now()}-2`, title: 'Curated Venue Scouting & Initial Hold', dueDate: newBookingData.eventDate, completed: false, category: 'Venue' },
    { id: `m-${Date.now()}-3`, title: 'Scenography & Floral Architecture Palette', dueDate: newBookingData.eventDate, completed: false, category: 'Design' },
    { id: `m-${Date.now()}-4`, title: 'Tasting & Grand Sommelier Pairing', dueDate: newBookingData.eventDate, completed: false, category: 'Culinary' },
    { id: `m-${Date.now()}-5`, title: 'Final Production Call & Master Itinerary', dueDate: newBookingData.eventDate, completed: false, category: 'Production' },
  ];

  const newBooking: Booking = {
    ...newBookingData,
    id: `book-${Date.now()}`,
    bookingNumber,
    createdAt: new Date().toISOString(),
    milestones: initialMilestones,
  };

  const updated = [newBooking, ...current];
  saveToStorage(STORAGE_KEYS.BOOKINGS, updated);

  // Auto-generate invoice
  const invoices = getInvoices();
  const newInvoice: Invoice = {
    id: `inv-${Date.now()}`,
    invoiceNumber: `INV-${year}-${Math.floor(100 + Math.random() * 900)}`,
    bookingId: newBooking.id,
    clientName: newBooking.clientName,
    eventTitle: `${newBooking.eventType} (${newBooking.packageTier} Tier) - Deposit Retainer`,
    amount: newBooking.depositAmount,
    depositAmount: newBooking.depositAmount,
    status: newBooking.depositPaid ? 'PAID' : 'PENDING',
    dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    createdAt: new Date().toISOString().split('T')[0],
  };
  saveToStorage(STORAGE_KEYS.INVOICES, [newInvoice, ...invoices]);

  return newBooking;
}

export function updateBookingStatus(bookingId: string, status: BookingStatus): void {
  const current = getBookings();
  const updated = current.map((b) => (b.id === bookingId ? { ...b, status } : b));
  saveToStorage(STORAGE_KEYS.BOOKINGS, updated);
}

export function toggleMilestone(bookingId: string, milestoneId: string): void {
  const current = getBookings();
  const updated = current.map((b) => {
    if (b.id !== bookingId) return b;
    const milestones = b.milestones.map((m) =>
      m.id === milestoneId ? { ...m, completed: !m.completed } : m
    );
    return { ...b, milestones };
  });
  saveToStorage(STORAGE_KEYS.BOOKINGS, updated);
}

// Gallery
export function getGalleryImages(): GalleryImage[] {
  return loadFromStorage<GalleryImage[]>(STORAGE_KEYS.GALLERY, SEED_GALLERY);
}

export function addGalleryImage(img: Omit<GalleryImage, 'id'>): GalleryImage {
  const current = getGalleryImages();
  const newImage: GalleryImage = {
    ...img,
    id: `gal-${Date.now()}`,
  };
  saveToStorage(STORAGE_KEYS.GALLERY, [newImage, ...current]);
  return newImage;
}

export function deleteGalleryImage(id: string): void {
  const current = getGalleryImages();
  const updated = current.filter((item) => item.id !== id);
  saveToStorage(STORAGE_KEYS.GALLERY, updated);
}

// Inquiries
export function getInquiries(): Inquiry[] {
  return loadFromStorage<Inquiry[]>(STORAGE_KEYS.INQUIRIES, SEED_INQUIRIES);
}

export function createInquiry(data: Omit<Inquiry, 'id' | 'status' | 'createdAt'>): Inquiry {
  const current = getInquiries();
  const newInquiry: Inquiry = {
    ...data,
    id: `inq-${Date.now()}`,
    status: 'NEW',
    createdAt: new Date().toISOString(),
  };
  saveToStorage(STORAGE_KEYS.INQUIRIES, [newInquiry, ...current]);
  return newInquiry;
}

export function replyToInquiry(id: string, replyText: string): void {
  const current = getInquiries();
  const updated = current.map((inq) =>
    inq.id === id ? { ...inq, status: 'RESPONDED' as const, adminReply: replyText } : inq
  );
  saveToStorage(STORAGE_KEYS.INQUIRIES, updated);
}

export function updateInquiryStatus(id: string, status: 'NEW' | 'RESPONDED' | 'ARCHIVED'): void {
  const current = getInquiries();
  const updated = current.map((inq) => (inq.id === id ? { ...inq, status } : inq));
  saveToStorage(STORAGE_KEYS.INQUIRIES, updated);
}

// Messages
export function getMessages(bookingId?: string): Message[] {
  const all = loadFromStorage<Message[]>(STORAGE_KEYS.MESSAGES, SEED_MESSAGES);
  if (!bookingId) return all;
  return all.filter((m) => m.bookingId === bookingId);
}

export function sendMessage(msg: Omit<Message, 'id' | 'timestamp' | 'isRead'>): Message {
  const current = loadFromStorage<Message[]>(STORAGE_KEYS.MESSAGES, SEED_MESSAGES);
  const newMsg: Message = {
    ...msg,
    id: `msg-${Date.now()}`,
    timestamp: new Date().toISOString(),
    isRead: false,
  };
  const updated = [...current, newMsg];
  saveToStorage(STORAGE_KEYS.MESSAGES, updated);

  // If client sent a message, simulate planner concierge reply after brief moment
  if (msg.senderRole === 'CLIENT') {
    setTimeout(() => {
      const autoReply: Message = {
        id: `msg-reply-${Date.now()}`,
        bookingId: msg.bookingId,
        senderId: 'user-admin',
        senderName: 'Éléonore Vance',
        senderRole: 'ADMIN',
        body: 'Thank you for your update. Our production atelier has noted this in your master itinerary. We will confirm details within our next atelier session.',
        timestamp: new Date().toISOString(),
        isRead: false,
      };
      const messagesNow = loadFromStorage<Message[]>(STORAGE_KEYS.MESSAGES, SEED_MESSAGES);
      saveToStorage(STORAGE_KEYS.MESSAGES, [...messagesNow, autoReply]);
    }, 1800);
  }

  return newMsg;
}

// Documents
export function getDocuments(bookingId?: string): DocumentItem[] {
  const all = loadFromStorage<DocumentItem[]>(STORAGE_KEYS.DOCUMENTS, SEED_DOCUMENTS);
  if (!bookingId) return all;
  return all.filter((d) => d.bookingId === bookingId);
}

export function addDocument(doc: Omit<DocumentItem, 'id' | 'uploadedAt'>): DocumentItem {
  const current = loadFromStorage<DocumentItem[]>(STORAGE_KEYS.DOCUMENTS, SEED_DOCUMENTS);
  const newDoc: DocumentItem = {
    ...doc,
    id: `doc-${Date.now()}`,
    uploadedAt: new Date().toISOString(),
  };
  saveToStorage(STORAGE_KEYS.DOCUMENTS, [newDoc, ...current]);
  return newDoc;
}

// Invoices
export function getInvoices(bookingId?: string): Invoice[] {
  const all = loadFromStorage<Invoice[]>(STORAGE_KEYS.INVOICES, SEED_INVOICES);
  if (!bookingId) return all;
  return all.filter((inv) => inv.bookingId === bookingId);
}

export function payInvoice(invoiceId: string): void {
  const current = getInvoices();
  const updated = current.map((inv) => (inv.id === invoiceId ? { ...inv, status: 'PAID' as const } : inv));
  saveToStorage(STORAGE_KEYS.INVOICES, updated);
}

// Reset store to seeds if desired
export function resetStoreToDefaults(): void {
  if (typeof window === 'undefined') return;
  Object.values(STORAGE_KEYS).forEach((k) => localStorage.removeItem(k));
  notifyListeners();
}
