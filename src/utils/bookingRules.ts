import type { Booking, Milestone } from '../types/index';

/**
 * Checks if a given date string (YYYY-MM-DD) conflicts with any confirmed or completed bookings
 */
export function isDateBooked(dateString: string, existingBookings: Booking[]): boolean {
  if (!dateString) return false;
  return existingBookings.some((b) => {
    return b.eventDate === dateString && (b.status === 'CONFIRMED' || b.status === 'COMPLETED');
  });
}

/**
 * Calculates required deposit based on total amount and percentage (default: 20%)
 */
export function calculateDeposit(totalAmount: number, percentage = 20): number {
  if (totalAmount <= 0) return 0;
  return Math.round((totalAmount * percentage) / 100);
}

/**
 * Calculates milestone completion percentage (0 - 100)
 */
export function calculateMilestoneProgress(milestones: Milestone[] = []): number {
  if (!milestones || milestones.length === 0) return 0;
  const completedCount = milestones.filter((m) => m.completed).length;
  return Math.round((completedCount / milestones.length) * 100);
}

/**
 * Calculates countdown from now to the event date
 */
export function calculateEventCountdown(eventDateString: string, referenceDate: Date = new Date()): {
  days: number;
  hours: number;
  isPast: boolean;
  formatted: string;
} {
  if (!eventDateString) {
    return { days: 0, hours: 0, isPast: false, formatted: 'Date TBD' };
  }
  const eventTime = new Date(`${eventDateString}T12:00:00Z`).getTime();
  const refTime = referenceDate.getTime();
  const diffMs = eventTime - refTime;

  if (diffMs <= 0) {
    return { days: 0, hours: 0, isPast: true, formatted: 'Event concluded' };
  }

  const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));

  return {
    days,
    hours,
    isPast: false,
    formatted: `${days}d ${hours}h remaining`,
  };
}

/**
 * Validates booking wizard steps
 */
export interface StepValidationResult {
  isValid: boolean;
  errors: Record<string, string>;
}

export function validateBookingStep(
  step: number,
  formData: {
    eventType?: string;
    eventDate?: string;
    packageTier?: string;
    clientName?: string;
    clientEmail?: string;
    clientPhone?: string;
    guests?: number;
    budget?: string;
    termsAccepted?: boolean;
  },
  existingBookings: Booking[] = []
): StepValidationResult {
  const errors: Record<string, string> = {};

  if (step === 1) {
    if (!formData.eventType) {
      errors.eventType = 'Please select an event type';
    }
  } else if (step === 2) {
    if (!formData.eventDate) {
      errors.eventDate = 'Please select your desired event date';
    } else if (isDateBooked(formData.eventDate, existingBookings)) {
      errors.eventDate = 'This date is already fully booked. Please choose another date or contact our concierge.';
    }
  } else if (step === 3) {
    if (!formData.packageTier) {
      errors.packageTier = 'Please select an event curation tier';
    }
  } else if (step === 4) {
    if (!formData.clientName?.trim()) {
      errors.clientName = 'Full name is required';
    }
    if (!formData.clientEmail?.trim()) {
      errors.clientEmail = 'Email address is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.clientEmail)) {
      errors.clientEmail = 'Please enter a valid email address';
    }
    if (!formData.clientPhone?.trim()) {
      errors.clientPhone = 'Phone number is required for concierge coordination';
    }
    if (!formData.guests || formData.guests < 1) {
      errors.guests = 'Please specify estimated guest count (minimum 1)';
    }
    if (!formData.budget?.trim()) {
      errors.budget = 'Please select an approximate budget range';
    }
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}
