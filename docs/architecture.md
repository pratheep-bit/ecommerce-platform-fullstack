# System Architecture

## Overview

The platform follows a **three-tier architecture** with clear separation between client applications, the API server, and data stores. All communication between clients and the backend is through a versioned REST API.

---

## High-Level Design

```
                    ┌───────────────┐     ┌───────────────┐
                    │  React SPA    │     │  Flutter App  │
                    │  (Web Client) │     │  (Mobile)     │
                    └───────┬───────┘     └───────┬───────┘
                            │                     │
                            ▼                     ▼
                   ┌──────────────────────────────────────┐
                   │         FastAPI Application          │
                   │                                      │
                   │  ┌─────────────────────────────────┐ │
                   │  │       Middleware Pipeline        │ │
                   │  │  Request ID → CORS → Logging    │ │
                   │  └─────────────┬───────────────────┘ │
                   │                │                      │
                   │  ┌─────────────▼───────────────────┐ │
                   │  │     API Router (v1)              │ │
                   │  │  /auth  /products  /cart         │ │
                   │  │  /orders  /payments  /admin      │ │
                   │  │  /users  /webhooks               │ │
                   │  └─────────────┬───────────────────┘ │
                   │                │                      │
                   │  ┌─────────────▼───────────────────┐ │
                   │  │     Service Layer               │ │
                   │  │  RazorpayService                │ │
                   │  │  EmailService                   │ │
                   │  │  ShiprocketService              │ │
                   │  │  SMSService                     │ │
                   │  └─────────────┬───────────────────┘ │
                   │                │                      │
                   │  ┌─────────────▼───────────────────┐ │
                   │  │     Data Access Layer           │ │
                   │  │  SQLAlchemy 2.0 (Async)         │ │
                   │  │  Pydantic Schemas               │ │
                   │  └─────────────────────────────────┘ │
                   └───────────┬────────────┬─────────────┘
                               │            │
                    ┌──────────▼──┐  ┌──────▼──────────┐
                    │ PostgreSQL  │  │     Redis        │
                    │ (Supabase)  │  │  Rate Limiting   │
                    └─────────────┘  └─────────────────┘
```

---

## Backend Architecture

### Layered Structure

| Layer | Responsibility |
|-------|---------------|
| **Routes** (`api/v1/`) | HTTP request handling, input validation, response formatting |
| **Dependencies** (`api/deps.py`) | Authentication guards, rate limiters, DB session injection |
| **Services** (`services/`) | Business logic, external API integration |
| **Models** (`db/models.py`) | ORM models, database schema definition |
| **Schemas** (`schemas/`) | Request/response validation with Pydantic |
| **Core** (`core/`) | Configuration, security, middleware, logging |

### Request Flow

```
Client Request
    │
    ▼
┌─────────────────────┐
│  RequestID Middleware │  ←  Assigns unique ID for tracing
├─────────────────────┤
│  CORS Middleware      │  ←  Validates origin
├─────────────────────┤
│  Logging Middleware   │  ←  Logs method, path, status, timing
├─────────────────────┤
│  Route Handler        │  ←  Validates input via Pydantic schema
│    ↓                  │
│  Dependencies         │  ←  Auth check, rate limit, DB session
│    ↓                  │
│  Business Logic       │  ←  Service layer operations
│    ↓                  │
│  Database Query       │  ←  Async SQLAlchemy via asyncpg
├─────────────────────┤
│  Response Serializer  │  ←  Pydantic model → JSON
└─────────────────────┘
    │
    ▼
Client Response
```

---

## Data Model

### Entity Relationship

```
┌──────────┐     1:N     ┌──────────┐
│   User   │─────────────│ Address  │
└────┬─────┘             └──────────┘
     │
     │ 1:N
     ▼
┌──────────┐     1:N     ┌───────────┐
│  Order   │─────────────│ OrderItem │───── Product
└────┬─────┘             └───────────┘
     │
     │ 1:1              1:1
     ├──────────────── Payment
     │
     └──────────────── Shipment
```

### Key Models

| Model | Description |
|-------|-------------|
| `User` | Customer with mobile number (unique), OTP-verified |
| `Address` | Delivery addresses (home, office, other) |
| `Product` | Catalog items with price, MRP, stock, images, specs |
| `CartItem` | User ↔ Product mapping with quantity |
| `Order` | Purchase record with shipping address snapshot |
| `OrderItem` | Line items with product snapshot at purchase time |
| `Payment` | Razorpay transaction records |
| `Shipment` | Shipping status, AWB, courier, tracking |
| `AdminUser` | Admin panel credentials |
| `TokenBlacklist` | Revoked JWT tokens |
| `OTPLog` | OTP generation/verification audit trail |

---

## Order State Machine

```
                    ┌─────────┐
                    │ pending │ ← Order created, stock reserved
                    └────┬────┘
                         │
                    Payment verified
                         │
                    ┌────▼─────┐
                    │confirmed │ ← Stock committed
                    └────┬─────┘
                         │
                    Admin processes
                         │
                    ┌────▼──────┐
                    │processing │
                    └────┬──────┘
                         │
                    Shipped via Shiprocket
                         │
                    ┌────▼────┐
                    │ shipped │ ← AWB assigned
                    └────┬────┘
                         │
                    Delivery confirmed
                         │
                    ┌────▼──────┐
                    │ delivered │ ← Final state
                    └───────────┘

  Cancellation path (from pending/confirmed/processing):
                    ┌───────────┐
                    │ cancelled │ ← Stock released, refund if paid
                    └───────────┘
```

---

## Security Architecture

### Authentication Flow

```
1. Client sends mobile number → POST /api/v1/auth/send-otp
2. Server generates OTP, hashes with SHA256, stores in DB
3. OTP sent via Twilio SMS
4. Client submits OTP → POST /api/v1/auth/verify-otp
5. Server verifies hash, creates/finds user
6. Returns JWT access token (30min) + refresh token (7 days)
7. Client includes Bearer token in subsequent requests
8. On token expiry → POST /api/v1/auth/refresh (token rotation)
9. On logout → Token JTI added to blacklist
```

### Security Measures

- **OTP rate limiting**: Max 5 OTPs per hour per number
- **Attempt limiting**: OTP invalidated after 5 failed verification attempts
- **Token rotation**: Refresh token is blacklisted on use, new pair issued
- **Row-level locking**: `SELECT FOR UPDATE` on stock operations to prevent race conditions
- **Request ID tracing**: Every request tagged with UUID for audit trails
- **Admin isolation**: Separate auth system with bcrypt passwords

---

## Deployment Architecture

### Docker Compose (Development)

```yaml
Services:
  backend    →  FastAPI app (port 8000)
  frontend   →  Nginx serving React build (port 3000)
  db         →  PostgreSQL 15 Alpine (port 5432)
  redis      →  Redis 7 Alpine (port 6379)
```

All services include health checks and restart policies. Database and Redis use persistent volumes.

### Production (Render.com)

The backend deploys as a Docker web service on Render with:
- Auto-generated `SECRET_KEY` and `JWT_SECRET_KEY`
- Environment variables injected via dashboard
- Supabase-hosted PostgreSQL (external)
- Managed Redis add-on

---

## Design Decisions

| Decision | Rationale |
|----------|-----------|
| **Async SQLAlchemy** | Non-blocking DB queries to handle concurrent requests efficiently |
| **UUID primary keys** | Globally unique IDs, safe for distributed systems |
| **Stock reservation** | Two-phase commit prevents overselling without distributed locks |
| **Pydantic v2** | Fast validation, automatic OpenAPI schema generation |
| **JWT with blacklist** | Stateless auth with revocation capability |
| **Address snapshot in orders** | Preserves shipping details even if user updates/deletes address |
| **Background cleanup tasks** | Prevents orphaned reservations from blocking inventory |
