export type EventType = 
  | 'Wedding'
  | 'Corporate'
  | 'Gala'
  | 'Private Party'
  | 'Destination'
  | 'Other';

export type BookingStatus = 'PENDING' | 'CONFIRMED' | 'COMPLETED' | 'CANCELLED';

export type UserRole = 'ADMIN' | 'CLIENT';

export interface User {
  id: string;
  name: string;
  email: string;
  password?: string;
  role: UserRole;
  phone?: string;
  avatar?: string;
  createdAt: string;
}

export interface Milestone {
  id: string;
  title: string;
  dueDate: string;
  completed: boolean;
  category?: string;
}

export interface Booking {
  id: string;
  bookingNumber: string;
  userId: string;
  clientName: string;
  clientEmail: string;
  clientPhone: string;
  eventType: EventType;
  eventDate: string; // YYYY-MM-DD
  guests: number;
  venue: string;
  budget: string;
  packageTier: 'Essential' | 'Signature' | 'Bespoke';
  status: BookingStatus;
  depositPaid: boolean;
  depositAmount: number;
  totalAmount: number;
  notes: string;
  milestones: Milestone[];
  createdAt: string;
}

export interface GalleryImage {
  id: string;
  url: string;
  title: string;
  category: 'Weddings' | 'Corporate' | 'Galas' | 'Private';
  caption: string;
  location: string;
  featured?: boolean;
  aspectRatio?: 'tall' | 'wide' | 'square';
}

export interface Inquiry {
  id: string;
  name: string;
  email: string;
  phone: string;
  eventType: EventType;
  preferredDate?: string;
  guests?: number;
  budget?: string;
  message: string;
  status: 'NEW' | 'RESPONDED' | 'ARCHIVED';
  createdAt: string;
  adminReply?: string;
}

export interface Message {
  id: string;
  bookingId: string;
  senderId: string;
  senderName: string;
  senderRole: UserRole;
  body: string;
  timestamp: string;
  isRead: boolean;
}

export interface DocumentItem {
  id: string;
  bookingId: string;
  name: string;
  category: 'Contract' | 'Invoice' | 'Mood Board' | 'Floor Plan';
  fileUrl: string;
  size: string;
  uploadedAt: string;
}

export interface Invoice {
  id: string;
  invoiceNumber: string;
  bookingId: string;
  clientName: string;
  eventTitle: string;
  amount: number;
  depositAmount: number;
  status: 'PAID' | 'PENDING' | 'OVERDUE';
  dueDate: string;
  createdAt: string;
}

export interface PackageTier {
  id: 'Essential' | 'Signature' | 'Bespoke';
  name: string;
  subtitle: string;
  priceStartingAt: number;
  depositPercentage: number;
  description: string;
  features: string[];
  popular?: boolean;
  recommendedFor: string;
}
