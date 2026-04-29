<p align="center">
  <h1 align="center">🛒 Scalable E-Commerce Platform</h1>
  <p align="center">
    A production-ready, fullstack e-commerce system built with modern technologies.<br/>
    <strong>FastAPI · React · Flutter · PostgreSQL · Redis · Docker</strong>
  </p>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Backend-FastAPI-009688?style=for-the-badge&logo=fastapi&logoColor=white" />
  <img src="https://img.shields.io/badge/Frontend-React_18-61DAFB?style=for-the-badge&logo=react&logoColor=black" />
  <img src="https://img.shields.io/badge/Mobile-Flutter-02569B?style=for-the-badge&logo=flutter&logoColor=white" />
  <img src="https://img.shields.io/badge/Database-PostgreSQL-4169E1?style=for-the-badge&logo=postgresql&logoColor=white" />
  <img src="https://img.shields.io/badge/Cache-Redis-DC382D?style=for-the-badge&logo=redis&logoColor=white" />
  <img src="https://img.shields.io/badge/Deploy-Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white" />
</p>

---

## Overview

A fullstack e-commerce platform designed with **scalability, security, and developer experience** as core principles. The system supports the complete purchase lifecycle — from product discovery and cart management through payment processing and shipment tracking — across web and mobile clients.

Built with an **API-first architecture**, the platform cleanly separates concerns between a high-performance Python backend, a modern React SPA, and a cross-platform Flutter mobile app, all orchestrated through Docker for consistent development and deployment environments.

---

## Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        Client Layer                             │
│  ┌──────────────────┐  ┌──────────────────┐                     │
│  │   React SPA      │  │   Flutter App    │                     │
│  │   (TypeScript)   │  │   (Dart)         │                     │
│  │   Vite + ShadCN  │  │   Riverpod       │                     │
│  └────────┬─────────┘  └────────┬─────────┘                     │
└───────────┼──────────────────────┼──────────────────────────────┘
            │     HTTPS / REST     │
            ▼                      ▼
┌─────────────────────────────────────────────────────────────────┐
│                      API Gateway Layer                          │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │              FastAPI (Uvicorn / Gunicorn)                 │   │
│  │  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌────────────┐  │   │
│  │  │  Auth    │ │ Products │ │  Orders  │ │  Payments  │  │   │
│  │  │  Routes  │ │  Routes  │ │  Routes  │ │  Routes    │  │   │
│  │  └──────────┘ └──────────┘ └──────────┘ └────────────┘  │   │
│  │  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌────────────┐  │   │
│  │  │  Cart   │  │  Admin  │  │ Webhooks │ │  Users     │  │   │
│  │  │  Routes │  │  Routes │  │  Routes  │ │  Routes    │  │   │
│  │  └──────────┘ └──────────┘ └──────────┘ └────────────┘  │   │
│  └──────────────────────────────────────────────────────────┘   │
└───────────┬──────────────────────┬──────────────────────────────┘
            │                      │
            ▼                      ▼
┌──────────────────────┐  ┌──────────────────────┐
│   PostgreSQL 15      │  │   Redis 7            │
│   (Primary Store)    │  │   (Cache + Sessions) │
│   via Supabase       │  │   Rate Limiting      │
└──────────────────────┘  └──────────────────────┘
            │
            ▼
┌──────────────────────────────────────────────┐
│            External Services                  │
│  ┌──────────┐ ┌──────────┐ ┌──────────────┐  │
│  │ Razorpay │ │ Twilio   │ │  Shiprocket  │  │
│  │ Payments │ │ OTP/SMS  │ │  Shipping    │  │
│  └──────────┘ └──────────┘ └──────────────┘  │
└──────────────────────────────────────────────┘
```

---

## Tech Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| **Backend** | Python 3.11, FastAPI, SQLAlchemy 2.0 | REST API, business logic, ORM |
| **Frontend** | React 18, TypeScript, Vite, TailwindCSS | Single-page application |
| **Mobile** | Flutter 3.x, Dart, Riverpod | Cross-platform mobile app |
| **Database** | PostgreSQL 15 (Supabase) | Persistent data storage |
| **Cache** | Redis 7 | Rate limiting, session caching |
| **Payments** | Razorpay | Payment gateway integration |
| **SMS/OTP** | Twilio | OTP-based authentication |
| **Shipping** | Shiprocket | Order fulfillment & tracking |
| **Email** | SMTP (aiosmtplib) | Transactional notifications |
| **DevOps** | Docker, Docker Compose, Render | Containerized deployment |
| **Monitoring** | Sentry | Error tracking & performance |

---

## Features

### 🔐 Authentication & Security
- **OTP-based passwordless authentication** via SMS (Twilio)
- JWT access + refresh token rotation with blacklist support
- Rate-limited OTP requests (per-hour limits)
- Bcrypt password hashing for admin accounts
- Request ID middleware for distributed tracing

### 🛍️ Product Management
- Paginated product catalog with slug-based routing
- Rich product schema: images, specifications, MRP vs. selling price
- Admin CRUD operations with stock management
- Active/inactive product visibility control

### 🛒 Cart System
- Persistent server-side cart for authenticated users
- Guest cart merge on login (seamless handoff)
- Real-time stock validation on add/update
- Quantity limits (max 10 per item)

### 📦 Order Lifecycle
- **Stock reservation** on order creation (prevents overselling)
- **Stock commit** on payment verification
- **Auto-cancellation** of expired unpaid orders (30-min TTL via background task)
- Order number generation with timestamp + random suffix
- Full order history with pagination

### 💳 Payment Processing
- Razorpay integration with server-side order creation
- Cryptographic signature verification
- Idempotent payment verification (safe retries)
- Automatic refund on cancellation
- Webhook support for async payment events

### 📊 Admin Panel
- Secure admin authentication (email/password + JWT)
- Order management (status updates, bulk operations)
- Analytics dashboard (revenue, order counts, daily trends)
- Product CRUD (create, update stock, toggle visibility)
- Shiprocket integration for shipment creation

### 🚚 Shipping & Tracking
- Shiprocket API integration for label generation
- Real-time shipment status tracking
- AWB number and courier assignment
- Tracking URL generation for customers

### 📧 Notifications
- Transactional email service (order confirmation, payment receipt, refund)
- SMS notifications for OTP and order updates
- Async, fire-and-forget notification delivery

---

## Project Structure

```
├── backend/                    # Python FastAPI application
│   ├── app/
│   │   ├── api/                # API route handlers
│   │   │   ├── deps.py         # Dependency injection (auth, rate limiting)
│   │   │   └── v1/             # Versioned API endpoints
│   │   │       ├── auth.py     # OTP send/verify, token refresh, logout
│   │   │       ├── products.py # Product listing & detail
│   │   │       ├── cart.py     # Cart CRUD & merge
│   │   │       ├── orders.py   # Order creation, listing, cancellation
│   │   │       ├── payments.py # Razorpay create/verify
│   │   │       ├── users.py    # Profile & address management
│   │   │       ├── admin.py    # Admin operations & analytics
│   │   │       └── webhooks.py # Razorpay & Shiprocket webhooks
│   │   ├── core/               # Core utilities
│   │   │   ├── config.py       # Pydantic settings (env validation)
│   │   │   ├── security.py     # JWT, OTP, password hashing
│   │   │   ├── middleware.py   # Request ID middleware
│   │   │   ├── logging.py      # Structured logging
│   │   │   ├── retry.py        # Retry utilities for external APIs
│   │   │   └── order_state.py  # Order state machine
│   │   ├── db/                 # Database layer
│   │   │   ├── database.py     # Async engine & session factory
│   │   │   ├── models.py       # SQLAlchemy ORM models
│   │   │   └── migrations/     # Alembic migration scripts
│   │   ├── schemas/            # Pydantic request/response schemas
│   │   ├── services/           # Business logic services
│   │   │   ├── razorpay_service.py
│   │   │   ├── email_service.py
│   │   │   ├── shiprocket_service.py
│   │   │   └── twilio_sms.py
│   │   └── integrations/       # External API clients
│   │       ├── shiprocket.py
│   │       └── sms.py
│   ├── Dockerfile
│   ├── requirements.txt
│   ├── gunicorn.conf.py
│   ├── alembic.ini
│   └── seed_db.py              # Database seeding script
│
├── frontend/                   # React TypeScript application
│   ├── client/
│   │   ├── App.tsx             # Root component with routing
│   │   ├── pages/              # Page components
│   │   │   ├── Index.tsx       # Home / product showcase
│   │   │   ├── Cart.tsx        # Shopping cart
│   │   │   ├── Checkout.tsx    # Checkout flow
│   │   │   ├── Login.tsx       # OTP authentication
│   │   │   └── Account.tsx     # User profile & orders
│   │   ├── components/         # Reusable UI components
│   │   │   ├── Header.tsx
│   │   │   ├── Footer.tsx
│   │   │   └── ui/             # ShadCN UI primitives
│   │   ├── context/            # React context providers
│   │   ├── hooks/              # Custom React hooks
│   │   └── lib/                # Utility functions
│   ├── server/                 # SSR / BFF layer (Express)
│   ├── shared/                 # Shared types (client ↔ server)
│   ├── Dockerfile
│   ├── vite.config.ts
│   └── package.json
│
├── mobile/                     # Flutter mobile application
│   ├── lib/
│   │   ├── main.dart           # App entry point
│   │   ├── core/               # Theme, routing, constants
│   │   ├── screens/            # Feature screens
│   │   │   ├── auth/
│   │   │   ├── home/
│   │   │   ├── product/
│   │   │   ├── cart/
│   │   │   ├── checkout/
│   │   │   ├── orders/
│   │   │   └── profile/
│   │   ├── providers/          # Riverpod state management
│   │   ├── services/           # API service layer
│   │   └── widgets/            # Reusable UI widgets
│   └── pubspec.yaml
│
├── infra/                      # Infrastructure & deployment
│   ├── docker-compose.yml      # Full stack orchestration
│   └── render.yaml             # Render.com deployment config
│
├── docs/                       # Documentation
│   ├── architecture.md         # System design & decisions
│   └── api.md                  # API reference
│
├── .gitignore
└── README.md
```

---

## Key Engineering Highlights

### Modular Backend Design
The backend follows a clean **layered architecture** — routes handle HTTP concerns, services encapsulate business logic, and the database layer provides an async ORM abstraction. Each domain (auth, cart, orders, payments) is self-contained with its own router, schemas, and dependencies.

### Stock Reservation Pattern
A two-phase stock management system prevents overselling in concurrent environments:
1. **Reserve** — Stock is reserved (not deducted) when an order is created
2. **Commit** — Reserved stock is committed (deducted) only after payment verification
3. **Release** — If payment fails or the order expires, reserved stock is returned to the available pool

### Background Task Orchestration
The application runs async background loops for:
- **Order cleanup** — Cancels unpaid orders after 30 minutes, releasing reserved stock
- **Token cleanup** — Purges expired JWT blacklist entries daily

### API-First Architecture
All three clients (web, mobile, admin) consume the same versioned REST API (`/api/v1`), ensuring consistent behavior and enabling independent client development. The API is designed with proper:
- Request/response validation via Pydantic schemas
- Pagination on all list endpoints
- Idempotent payment verification
- Structured error responses

### Containerized Deployment
The entire stack is orchestrated via Docker Compose with health checks, service dependencies, and persistent volumes. Production deployment is configured for Render.com with auto-generated secrets.

---

## Getting Started

### Prerequisites

- **Docker** & **Docker Compose** (recommended)
- Or individually: Python 3.11+, Node.js 18+, Flutter 3.2+

### Quick Start (Docker)

```bash
# Clone the repository
git clone https://github.com/pratheep-bit/ECOMMERCE-SITE-CKM.git
cd ECOMMERCE-SITE-CKM

# Copy environment template
cp backend/.env.example backend/.env
# Edit backend/.env with your credentials (Supabase, Razorpay, Twilio, etc.)

# Start all services
docker-compose -f infra/docker-compose.yml up --build

# Services will be available at:
#   Backend API:  http://localhost:8000
#   Frontend:     http://localhost:3000
#   API Docs:     http://localhost:8000/docs (dev mode only)
```

### Manual Setup

<details>
<summary><strong>Backend</strong></summary>

```bash
cd backend
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
cp .env.example .env
# Edit .env with your configuration
uvicorn app.main:app --reload --port 8000
```
</details>

<details>
<summary><strong>Frontend</strong></summary>

```bash
cd frontend
npm install
npm run dev
# Opens at http://localhost:5173
```
</details>

<details>
<summary><strong>Mobile</strong></summary>

```bash
cd mobile
flutter pub get
flutter run
```
</details>

---

## Environment Variables

See [`backend/.env.example`](backend/.env.example) for the complete list. Key variables:

| Variable | Description |
|----------|-------------|
| `DATABASE_URL` | PostgreSQL connection string (async) |
| `REDIS_URL` | Redis connection URL |
| `JWT_SECRET_KEY` | Secret for JWT signing |
| `RAZORPAY_KEY_ID` | Razorpay API key |
| `RAZORPAY_KEY_SECRET` | Razorpay API secret |
| `TWILIO_ACCOUNT_SID` | Twilio SMS account SID |
| `SUPABASE_URL` | Supabase project URL |

---

## API Documentation

Interactive API docs are available at `/docs` (Swagger UI) and `/redoc` when running in development mode.

For a complete endpoint reference, see [`docs/api.md`](docs/api.md).

---

## Future Roadmap

- [ ] **Search & Filtering** — Elasticsearch integration for product search
- [ ] **Caching Layer** — Redis-backed response caching for product catalog
- [ ] **CI/CD Pipeline** — GitHub Actions for automated testing and deployment
- [ ] **Microservices Split** — Extract payments and notifications into independent services
- [ ] **WebSocket Notifications** — Real-time order status updates
- [ ] **Internationalization** — Multi-language and multi-currency support
- [ ] **Analytics Dashboard** — Grafana + Prometheus for operational metrics

---

## License

This project is built for educational and portfolio demonstration purposes.

---

<p align="center">
  Built with precision by <strong>Pratheep</strong>
</p>
