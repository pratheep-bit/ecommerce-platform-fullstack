# API Reference

**Base URL:** `http://localhost:8000/api/v1`

All endpoints return JSON. Authentication is via Bearer JWT tokens unless noted otherwise.

---

## Table of Contents

- [Authentication](#authentication)
- [Users](#users)
- [Products](#products)
- [Cart](#cart)
- [Orders](#orders)
- [Payments](#payments)
- [Admin](#admin)
- [Health](#health)

---

## Authentication

### Send OTP

```
POST /auth/send-otp
```

Send a one-time password to the provided mobile number.

**Request Body:**
```json
{
  "mobile_number": "+919876543210"
}
```

**Response: `200 OK`**
```json
{
  "message": "OTP sent successfully",
  "success": true
}
```

**Rate Limit:** 5 requests per hour per mobile number.

---

### Verify OTP

```
POST /auth/verify-otp
```

Verify OTP and receive JWT tokens. Creates user account on first login.

**Request Body:**
```json
{
  "mobile_number": "+919876543210",
  "otp": "482910"
}
```

**Response: `200 OK`**
```json
{
  "access_token": "eyJhbGciOi...",
  "refresh_token": "eyJhbGciOi...",
  "token_type": "bearer",
  "expires_in": 1800
}
```

---

### Refresh Token

```
POST /auth/refresh
```

Exchange a refresh token for a new access/refresh token pair.

**Request Body:**
```json
{
  "refresh_token": "eyJhbGciOi..."
}
```

**Response: `200 OK`**
```json
{
  "access_token": "eyJhbGciOi...",
  "refresh_token": "eyJhbGciOi...",
  "token_type": "bearer",
  "expires_in": 1800
}
```

---

### Logout

```
POST /auth/logout
Authorization: Bearer <access_token>
```

Blacklists the current access token.

**Response: `200 OK`**
```json
{
  "message": "Logged out successfully",
  "success": true
}
```

---

## Users

### Get Profile

```
GET /users/me
Authorization: Bearer <access_token>
```

**Response: `200 OK`**
```json
{
  "id": "a1b2c3d4-...",
  "mobile_number": "+919876543210",
  "name": "Pratheep",
  "email": "pratheep@example.com",
  "is_verified": true,
  "created_at": "2025-01-15T10:30:00Z"
}
```

### Update Profile

```
PUT /users/me
Authorization: Bearer <access_token>
```

**Request Body:**
```json
{
  "name": "Pratheep S",
  "email": "pratheep@example.com"
}
```

---

### Addresses

#### List Addresses
```
GET /users/addresses
Authorization: Bearer <access_token>
```

#### Create Address
```
POST /users/addresses
Authorization: Bearer <access_token>
```

**Request Body:**
```json
{
  "name": "Pratheep",
  "mobile": "+919876543210",
  "line1": "42 MG Road",
  "line2": "Near Central Mall",
  "city": "Coimbatore",
  "state": "Tamil Nadu",
  "pincode": "641001",
  "country": "India",
  "address_type": "home",
  "landmark": "Opposite SBI Branch",
  "is_default": true
}
```

#### Update Address
```
PUT /users/addresses/{address_id}
Authorization: Bearer <access_token>
```

#### Delete Address
```
DELETE /users/addresses/{address_id}
Authorization: Bearer <access_token>
```

---

## Products

### List Products

```
GET /products?page=1&page_size=10&is_active=true
```

**No authentication required.**

**Response: `200 OK`**
```json
{
  "items": [
    {
      "id": "f5e6d7c8-...",
      "name": "Premium Karungali Mala",
      "slug": "premium-karungali-mala",
      "description": "Handcrafted ebony wood mala...",
      "short_description": "108 bead meditation mala",
      "price": 1299.00,
      "mrp": 1999.00,
      "stock": 50,
      "images": ["https://cdn.example.com/mala-1.jpg"],
      "specifications": {"material": "Ebony Wood", "beads": 108},
      "is_active": true,
      "created_at": "2025-01-10T08:00:00Z",
      "updated_at": "2025-01-15T12:00:00Z"
    }
  ],
  "total": 1,
  "page": 1,
  "page_size": 10
}
```

### Get Product

```
GET /products/{product_id_or_slug}
```

Accepts either UUID or slug.

---

## Cart

All cart endpoints require authentication.

### Get Cart

```
GET /cart
Authorization: Bearer <access_token>
```

**Response: `200 OK`**
```json
{
  "items": [
    {
      "id": "c1d2e3f4-...",
      "product_id": "f5e6d7c8-...",
      "quantity": 2,
      "product": { "...product fields..." },
      "created_at": "2025-01-20T14:30:00Z"
    }
  ],
  "subtotal": 2598.00,
  "item_count": 2
}
```

### Add to Cart

```
POST /cart/add
Authorization: Bearer <access_token>
```

**Request Body:**
```json
{
  "product_id": "f5e6d7c8-...",
  "quantity": 1
}
```

### Update Cart Item

```
PUT /cart/{cart_item_id}
Authorization: Bearer <access_token>
```

**Request Body:**
```json
{
  "quantity": 3
}
```

### Remove from Cart

```
DELETE /cart/{cart_item_id}
Authorization: Bearer <access_token>
```

### Clear Cart

```
POST /cart/clear
Authorization: Bearer <access_token>
```

### Merge Guest Cart

```
POST /cart/merge
Authorization: Bearer <access_token>
```

Merges client-side guest cart items into the authenticated user's server cart.

**Request Body:**
```json
[
  { "product_id": "f5e6d7c8-...", "quantity": 2 }
]
```

---

## Orders

All order endpoints require authentication.

### Create Order

```
POST /orders
Authorization: Bearer <access_token>
```

Creates an order from the current cart. Stock is **reserved** (not deducted).

**Request Body:**
```json
{
  "address_id": "a1b2c3d4-..."
}
```

**Response: `200 OK`**
```json
{
  "id": "o1r2d3e4-...",
  "order_number": "ORD250120143045AXYZ",
  "status": "pending",
  "subtotal": 2598.00,
  "shipping_fee": 0.00,
  "tax": 467.64,
  "discount": 0.00,
  "total": 3065.64,
  "shipping_name": "Pratheep",
  "shipping_city": "Coimbatore",
  "items": [...],
  "created_at": "2025-01-20T14:30:45Z",
  "updated_at": "2025-01-20T14:30:45Z"
}
```

### List Orders

```
GET /orders?page=1&page_size=10
Authorization: Bearer <access_token>
```

### Get Order

```
GET /orders/{order_id_or_number}
Authorization: Bearer <access_token>
```

Accepts UUID or order number string.

### Track Order

```
GET /orders/{order_id}/track
Authorization: Bearer <access_token>
```

**Response: `200 OK`**
```json
{
  "order_number": "ORD250120143045AXYZ",
  "order_status": "shipped",
  "shipment_status": "in_transit",
  "courier_name": "Delhivery",
  "awb_number": "DL1234567890",
  "tracking_url": "https://track.delhivery.com/...",
  "tracking_history": [...],
  "estimated_delivery": "2025-01-25T18:00:00Z"
}
```

### Cancel Order

```
POST /orders/{order_id}/cancel
Authorization: Bearer <access_token>
```

Cancels the order and releases reserved stock. Auto-initiates refund if payment was captured.

---

## Payments

All payment endpoints require authentication.

### Create Payment

```
POST /payments/create
Authorization: Bearer <access_token>
```

Creates a Razorpay order for the given order.

**Request Body:**
```json
{
  "order_id": "o1r2d3e4-..."
}
```

**Response: `200 OK`**
```json
{
  "razorpay_order_id": "order_ABC123",
  "razorpay_key_id": "rzp_live_xxxxx",
  "amount": 306564,
  "currency": "INR",
  "order_id": "o1r2d3e4-..."
}
```

### Verify Payment

```
POST /payments/verify
Authorization: Bearer <access_token>
```

Verifies the Razorpay payment signature. On success: commits stock, confirms order, clears cart.

**Request Body:**
```json
{
  "razorpay_order_id": "order_ABC123",
  "razorpay_payment_id": "pay_XYZ789",
  "razorpay_signature": "abc123def456..."
}
```

---

## Admin

Admin endpoints use a separate authentication system (email + password).

### Admin Login

```
POST /admin/login
```

**Request Body:**
```json
{
  "email": "admin@platform.com",
  "password": "secure_password"
}
```

### Dashboard Analytics

```
GET /admin/analytics
Authorization: Bearer <admin_token>
```

**Response: `200 OK`**
```json
{
  "total_orders": 156,
  "total_revenue": 485230.00,
  "orders_today": 12,
  "revenue_today": 38400.00,
  "pending_orders": 8,
  "shipped_orders": 23,
  "delivered_orders": 112,
  "orders_by_status": { "pending": 8, "confirmed": 13, "..." : "..." },
  "revenue_by_day": [
    { "date": "2025-01-20", "revenue": 38400.00, "orders": 12 }
  ]
}
```

### Update Order Status

```
PATCH /admin/orders/{order_id}
Authorization: Bearer <admin_token>
```

**Request Body:**
```json
{
  "status": "shipped"
}
```

### Create Shipment

```
POST /admin/orders/{order_id}/ship
Authorization: Bearer <admin_token>
```

Creates a Shiprocket shipment for the order.

**Request Body:**
```json
{
  "length": 20,
  "breadth": 15,
  "height": 10,
  "weight": 0.5
}
```

### Process Refund

```
POST /admin/orders/{order_id}/refund
Authorization: Bearer <admin_token>
```

**Request Body:**
```json
{
  "amount": 1500.00,
  "reason": "Customer requested partial refund"
}
```

---

## Health

### Health Check

```
GET /health
```

**No authentication required.**

**Response: `200 OK`**
```json
{
  "status": "healthy",
  "app": "Ecommerce API",
  "version": "v1",
  "environment": "production"
}
```

---

## Error Responses

All errors follow a consistent format:

```json
{
  "detail": "Human-readable error message"
}
```

### Validation Errors (`422`)

```json
{
  "detail": "Validation error",
  "errors": [
    { "field": "body.mobile_number", "message": "String should match pattern..." }
  ]
}
```

### Common Status Codes

| Code | Meaning |
|------|---------|
| `200` | Success |
| `400` | Bad request (validation, business rule violation) |
| `401` | Unauthorized (missing or invalid token) |
| `404` | Resource not found |
| `422` | Validation error (schema mismatch) |
| `429` | Rate limit exceeded |
| `500` | Internal server error |
