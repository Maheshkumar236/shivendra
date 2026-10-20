import test from 'node:test';
import assert from 'node:assert/strict';
import {
  isDateBooked,
  calculateDeposit,
  calculateMilestoneProgress,
  calculateEventCountdown,
  validateBookingStep,
} from './bookingRules.ts';
import type { Booking, Milestone } from '../types/index.ts';

const mockBookings: Booking[] = [
  {
    id: 'b-1',
    bookingNumber: 'LUM-2026-001',
    userId: 'u-1',
    clientName: 'Lady Genevieve',
    clientEmail: 'genevieve@example.com',
    clientPhone: '+33 6 12 34 56 78',
    eventType: 'Wedding',
    eventDate: '2026-11-15',
    guests: 180,
    venue: 'Château de Chantilly, France',
    budget: '$150,000+',
    packageTier: 'Bespoke',
    status: 'CONFIRMED',
    depositPaid: true,
    depositAmount: 12000,
    totalAmount: 60000,
    notes: 'Haute couture floral arch',
    milestones: [],
    createdAt: '2026-01-10T10:00:00Z',
  },
  {
    id: 'b-2',
    bookingNumber: 'LUM-2026-002',
    userId: 'u-2',
    clientName: 'Alexander Sterling',
    clientEmail: 'alex@example.com',
    clientPhone: '+1 212 555 0192',
    eventType: 'Corporate',
    eventDate: '2026-12-05',
    guests: 350,
    venue: 'The Plaza Hotel, NYC',
    budget: '$250,000+',
    packageTier: 'Signature',
    status: 'PENDING',
    depositPaid: false,
    depositAmount: 9000,
    totalAmount: 45000,
    notes: 'Annual Global Gala',
    milestones: [],
    createdAt: '2026-02-01T10:00:00Z',
  },
];

test('isDateBooked returns true only for CONFIRMED or COMPLETED bookings', () => {
  assert.equal(isDateBooked('2026-11-15', mockBookings), true, 'Confirmed date should be booked');
  assert.equal(isDateBooked('2026-12-05', mockBookings), false, 'Pending date should not block availability');
  assert.equal(isDateBooked('2026-07-20', mockBookings), false, 'Open date should be available');
  assert.equal(isDateBooked('', mockBookings), false, 'Empty date string returns false');
});

test('calculateDeposit calculates exactly 20% by default', () => {
  assert.equal(calculateDeposit(10000), 2000);
  assert.equal(calculateDeposit(55000), 11000);
  assert.equal(calculateDeposit(12500, 25), 3125);
  assert.equal(calculateDeposit(0), 0);
  assert.equal(calculateDeposit(-500), 0);
});

test('calculateMilestoneProgress accurately reports percentage', () => {
  const milestones: Milestone[] = [
    { id: 'm1', title: 'Concept Approval', dueDate: '2026-05-01', completed: true },
    { id: 'm2', title: 'Venue Contract', dueDate: '2026-06-01', completed: true },
    { id: 'm3', title: 'Tasting Session', dueDate: '2026-07-01', completed: false },
    { id: 'm4', title: 'Final Rehearsal', dueDate: '2026-08-01', completed: false },
  ];

  assert.equal(calculateMilestoneProgress(milestones), 50);
  assert.equal(calculateMilestoneProgress([]), 0);
  assert.equal(calculateMilestoneProgress([milestones[0]]), 100);
});

test('calculateEventCountdown computes future remaining days', () => {
  const ref = new Date('2026-10-20T12:00:00Z');
  const future = calculateEventCountdown('2026-10-25', ref);
  assert.equal(future.days, 5);
  assert.equal(future.isPast, false);

  const past = calculateEventCountdown('2026-09-01', ref);
  assert.equal(past.isPast, true);
});

test('validateBookingStep validates required fields per step', () => {
  // Step 1
  const step1Valid = validateBookingStep(1, { eventType: 'Wedding' }, mockBookings);
  assert.equal(step1Valid.isValid, true);
  const step1Invalid = validateBookingStep(1, {}, mockBookings);
  assert.equal(step1Invalid.isValid, false);
  assert.ok(step1Invalid.errors.eventType);

  // Step 2 date check
  const step2Valid = validateBookingStep(2, { eventDate: '2026-10-30' }, mockBookings);
  assert.equal(step2Valid.isValid, true);
  const step2Clash = validateBookingStep(2, { eventDate: '2026-11-15' }, mockBookings);
  assert.equal(step2Clash.isValid, false);
  assert.ok(step2Clash.errors.eventDate);

  // Step 4 client details check
  const step4Invalid = validateBookingStep(4, { clientName: '' }, mockBookings);
  assert.equal(step4Invalid.isValid, false);
  assert.ok(step4Invalid.errors.clientName);
  assert.ok(step4Invalid.errors.clientEmail);
});
