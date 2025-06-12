# Progressive Web App for Beauty Industry (SMBs)

## Overview

Develop a **Progressive Web Application (PWA)** tailored for SMBs in the beauty industry (estheticians, hairdressers). The application should provide appointment scheduling, WhatsApp bot integration, e-commerce, analytics dashboards, and supplier management.

**All implementation must follow the architecture, conventions, and technology stack defined in `CLAUDE.md`.**

---

## 📂 Features Breakdown

### Project Structure
public/
├── favicon.ico
├── icons
│   ├── icon-128x128.png
│   ├── icon-144x144.png
│   ├── icon-152x152.png
│   ├── icon-192x192.png
│   ├── icon-384x384.png
│   ├── icon-512x512.png
│   ├── icon-72x72.png
│   └── icon-96x96.png
├── manifest.json
├── offline.html
├── placeholder.svg
├── robots.txt
├── screenshots/
│   ├── appointments.png
│   └── home.png
└── sw.js
src/
├── components/
│   ├── ui/           # shadcn/ui component library (30+ components)
│   ├── Cart/         # Shopping cart components
│   ├── Dashboard/    # Analytics and stats components
│   ├── Shop/         # E-commerce components
│   └── Layout/       # Navigation components
├── pages/            # Route pages (Dashboard, Shop, Appointments, etc.)
├── contexts/         # React Context providers (CartContext)
├── hooks/            # Custom React hooks
└── lib/              # Utility functions


---

## ✅ Features Specification

### 1. Appointments
- Online scheduling with real-time availability.
- WhatsApp API chatbot integration.
- SMS notification support (recommended: Twilio).
- Anonymous booking: requires name + phone.
- Authenticated users: full appointment management.

### 2. E-commerce
- Product and service catalog with images and descriptions.
- “Send as Gift” option during checkout.
- CRUD for product management (with image upload).
- Excel import/export integration (recommend SheetJS).
- Subscription model support (recommend Stripe).

### 3. Business Dashboard
- Built with **Recharts**:
  - Appointments over time.
  - Sales performance trends.
  - Client retention rates.
  - Toggle between Top Products / Top Services.
- GDPR-compliant user data handling.
- Optional user behavior analytics: PostHog or Segment.

### 4. Supplier Portal
- Supplier CRUD interface with pagination, filtering, and search.
- Table columns: Supplier_Name, Contact_Person, Contact_Number, Email, Address, Payment_Terms, Delivery_Time, Notes, Fornece_Produtos.
- Access restricted to Manager/Admin roles.

### 5. Additional Features
- Booking trends visualized by day, week, month.
- LinkTree-style customizable page for social links.
- Full **PWA** compliance:
  - Installable on devices.
  - Offline fallback page (`offline.html`).
  - Manifest with icons and metadata.
  - Custom Service Worker (`sw.js`) for caching strategies.
- WhatsApp/SMS notification system configurable per business.
- Authentication:
  - Social login: Google, Apple.
  - Registration requires: First Name, Last Name, Mobile, Email, Password, Confirm Password, Privacy Policy acceptance.
- Role-based Access:
  - Anonymous → minimal booking.
  - Registered → full features.
  - Shopper / Manager / Admin → progressive feature access.
- **Multi-Business (B2B) Support**:
  - Manager can create isolated platform under their account with unique branding, logo, products, and services.
  - Icon upload (all required sizes) configurable by each Manager.

---

## 🛠 Architecture & Stack (Do not change)

- **Frontend**: React 18 + TypeScript + Vite
- **Styling**: Tailwind CSS + shadcn/ui
- **Routing**: React Router DOM v6
- **State Management**: Context API + TanStack Query
- **Forms**: React Hook Form + Zod
- **Database**: PostgreSQL (Supabase) or Firebase Firestore
- **Authentication**: Firebase Auth or Auth0
- **Charts**: Recharts
- **Hosting**: Vercel, Netlify, or Firebase Hosting
- **PWA Config**: Vite PWA Plugin + custom Service Worker

---

## ⚙ Development Workflow

- Follow this file (`CLAUDE.md`) strictly.
- Mobile-first, responsive, accessible design principles.
- Path aliases (`@/*`) used for clean imports.
- ESLint and Prettier configured for consistent code style.
- Compound component pattern for component architecture.
- Modular, scalable, and maintainable code practices required.

---

## 📦 Deliverable

Provide a modular, maintainable implementation plan and code, following this document, respecting the specified architecture, and prioritizing code quality, progressive enhancement, and scalability.
