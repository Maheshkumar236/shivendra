# Lumière Events — Haute Couture Event Planning & Production

An editorial, luxury event planning and management platform built for world-class weddings, high-level corporate summits, philanthropic museum galas, and global destination celebrations.

---

## 🌟 Demo Credentials & Personas

The application includes an instant **Role Switcher** in the top navigation bar, as well as email/password authentication:

| Persona | Role | Email | Password | Access & Context |
| :--- | :--- | :--- | :--- | :--- |
| **Éléonore Vance** | `ADMIN` | `admin@lumiere.events` | `admin` | Full Director Admin Panel, KPI dashboard, status approvals, gallery curation, inquiry replies. |
| **Clara Dupont-Laurent** | `CLIENT` | `clara@example.com` | `password` | French Riviera Wedding at Villa Ephrussi de Rothschild. Milestones checklist, contracts, and direct messages. |
| **Marcus Thorne** | `CLIENT` | `marcus@example.com` | `password` | The Metropolitan Museum of Art (Temple of Dendur) Philanthropy Gala. |
| **Guest / Visitor** | `GUEST` | *N/A* | *N/A* | Public pages, services, 20+ photo gallery, pricing, and 5-step booking wizard. |

---

## 🏛️ Key Features & Architecture

### 1. Public Editorial Experience
- **Cinematic Hero**: Tagline *"Unforgettable Moments, Flawlessly Executed"* with gold foil typography and dual CTAs.
- **Animated Stats**: 500+ Haute Events, 12 Years, 98% Client Satisfaction, 28 International Awards.
- **Services Ateliers**: Full detail sections for *Haute Couture Weddings*, *Corporate Summits*, *Cultural Galas*, and *Destination Soirées*.
- **Haute Gallery**: Filterable masonry grid (All, Weddings, Corporate, Galas, Private) with an accessible, keyboard-navigable Lightbox (Arrow keys & Escape).
- **About Atelier**: Heritage story of Éléonore Vance, core principles (Discretion, Precision, Artistry), and international press honors.
- **Pricing & Packages**: 3 tiers (*The Curated Elegance*, *The Haute Couturier*, and *The Lumière Sovereign Atelier*) with a side-by-side comparison matrix.
- **Direct Inquiries**: Validated contact form that dispatches directly to the admin inbox with interactive notifications.

### 2. Online Booking Wizard (`/book`)
- **Step 1: Event Type** (Wedding, Corporate, Gala, Destination, Private Party, Other).
- **Step 2: Date Picker** with real-time calendar clash validation (`isDateBooked`) and seasonal advisory notes.
- **Step 3: Atelier Tier Selection** with deposit retainer calculations.
- **Step 4: Celebration Details** (Guest count slider, venue preference, budget range, and special requests).
- **Step 5: Review & Retainer Payment** featuring simulated Stripe test checkout (20% deposit) or 7-day concierge temporary hold.
- **Confirmation & Email Dispatch**: Instant generation of booking reference (`LUM-2026-XXXX`), simulated email preview modal, and direct handoff to the Client Portal.

### 3. Client Portal (`/portal`)
- **Executive Countdown**: Live day/hour countdown to the target celebration date.
- **Interactive Milestone Checklist**: Toggle completion of critical tasks (e.g., *Venue Contract Signed*, *Floral 3D Renderings Approved*, *Tasting Session Finalized*) with real-time progress bar recalculation.
- **Confidential Document Vault**: Review contracts, floor plans, and mood boards, plus simulated file upload capability.
- **Concierge Messaging Thread**: Direct line with Éléonore Vance with automated atelier confirmations.
- **Invoice & Tranche Settlements**: Pay outstanding invoices with simulated Stripe checkout.

### 4. Admin Management Console (`/admin`)
- **Executive KPIs**: Total Commissions, Committed Production Volume ($1.2M+), Pending Retainers, and Inquiry queue.
- **Commissions Table**: Real-time search by client or venue, status filtering (`ALL`, `CONFIRMED`, `PENDING`, `COMPLETED`, `CANCELLED`), and booking status updater.
- **Haute Gallery Manager**: Publish new photographs with category tags, locations, captions, and delete capabilities.
- **Inquiry Inbox**: Review contact submissions and dispatch official responses directly to patrons.

---

## 🛠️ Tech Stack & Design System

- **Framework**: React 19 + TypeScript + Vite 8
- **Styling**: Tailwind CSS v4 with custom theme:
  - Warm Ivory (`#FAF7F2`)
  - Deep Charcoal (`#1C1B1A`)
  - Royal Gold / Champagne (`#C9A227`, gradients)
  - Soft Sage & Blush accents
- **Typography**: Editorial serif (*Cormorant Garamond*) + Crisp luxury sans (*Plus Jakarta Sans*)
- **Icons**: Lucide React
- **Unit Testing**: Native Node.js test runner (`node:test` & `node:assert/strict`)

---

## 🚀 Local Development Setup

```bash
# 1. Install dependencies
npm install

# 2. Run unit tests
node --test src/utils/bookingRules.test.ts

# 3. Start development server
npm run dev
```

Visit `http://localhost:3000` in your browser.
