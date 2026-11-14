# 🥛 DoodhSetu — Shweta Enterprise Backend Tracker

> **Project**: DoodhSetu — Milk & Dairy Distribution Management System  
> **Stack**: Express 5 + TypeScript + PostgreSQL (Drizzle ORM) + Redis (ioredis) + Cloudinary + Zod  
> **Client**: React Native (Expo) app  
> **Last Updated**: 2026-11-11

---

## 📊 Overall Progress Summary

| Module                    | Status         | Progress |
|---------------------------|----------------|----------|
| Project Setup             | ✅ Done        | 100%     |
| Database Schema           | 🟡 Partial     | 35%      |
| Auth System               | ✅ Done        | 100%     |
| Retailer Management       | 🟡 Partial     | 20%      |
| Product Management        | ❌ Not Started | 0%       |
| Order Management          | ❌ Not Started | 0%       |
| Payment Management        | ❌ Not Started | 0%       |
| Outstanding Balance       | ❌ Not Started | 0%       |
| Inventory Management      | ❌ Not Started | 0%       |
| Reports & Analytics       | ❌ Not Started | 0%       |
| Routes & Visits           | ❌ Not Started | 0%       |
| Notifications             | ❌ Not Started | 0%       |
| System/Role Management    | ❌ Not Started | 0%       |
| Dashboard APIs            | ❌ Not Started | 0%       |
| Seed Scripts              | ❌ Not Started | 0%       |
| Error Handling (Global)   | ❌ Not Started | 0%       |
| Testing                   | ❌ Not Started | 0%       |

---

## 1. 🏗️ Project Setup & Infrastructure

- [x] Express 5 server with TypeScript
- [x] Drizzle ORM with PostgreSQL
- [x] Redis (ioredis) for token blacklisting
- [x] Cloudinary for image uploads
- [x] Zod for request/response validation
- [x] ESLint + Prettier configuration
- [x] Environment variable validation (`src/config/env.ts`)
- [x] DB singleton connection (`src/config/dbConnect.ts`)
- [x] Redis client with retry strategy (`src/config/redis.ts`)
- [x] Cloudinary config (`src/config/cloudinary.ts`)
- [x] Drizzle migration setup (`drizzle.config.ts`)
- [ ] `.env.example` is incomplete — only has `PORT` and `NODE_ENV`, missing `JWT_SECRET`, `DB_URL`, `REDIS_CLI`, `CLOUDINARY_*`
- [ ] Global error handler middleware (currently each controller catches its own errors)
- [ ] Rate limiting middleware
- [ ] CORS configuration
- [ ] Helmet / security headers
- [ ] Request logging middleware (e.g., Morgan)
- [ ] API versioning strategy
- [ ] Swagger / OpenAPI docs generation
- [ ] Seed script (`db:seed` in package.json references `src/db/seed/permissions.seed.ts` but directory doesn't exist)

---

## 2. 🗄️ Database Schema

### Existing Tables

- [x] **`users`** — `id`, `email` (max 25 chars), `password_hash`, `full_name`, `avatar_url`, `role_id` (FK → roles), `created_at`, `updated_at`, `password_changed_at`
- [x] **`roles`** — `id`, `role` (enum: `RETAILER`, `DISTRIBUTOR`)
- [x] **`sessions`** — `id`, `user_id` (FK → users), `refresh_token_hash`, `is_revoked`, `created_at`, `expires_at`
- [x] **`permissions`** — `id`, `code` (unique), `description`, `created_at`, `updated_at`
- [x] **`role_permissions`** — `id`, `role_id` (FK → roles), `permission_id` (FK → permissions), unique(role_id, permission_id)
- [x] **`retailers`** — `id`, `user_id` (FK → users), `shop_name`, `gst_no`, `phone`, `shop_photo_url`, `address`, `postal_code`, `area`, `city`, `latitude`, `longitude`, `is_active`, `created_at`, `updated_at`

### Tables Still Needed

- [ ] **`products`** — product catalog (name, description, unit, price, image, category, is_active, etc.)
- [ ] **`product_categories`** — category for products (milk, curd, paneer, etc.)
- [ ] **`orders`** — order header (retailer_id, order_date, status, total, delivery_date, etc.)
- [ ] **`order_items`** — order line items (order_id, product_id, quantity, unit_price, total)
- [ ] **`payments`** — payment records (retailer_id, amount, payment_mode, date, reference, etc.)
- [ ] **`outstanding_balances`** — retailer balance ledger
- [ ] **`balance_transactions`** — balance history/adjustments
- [ ] **`inventory`** — product stock levels
- [ ] **`inventory_transactions`** — stock movement log
- [ ] **`delivery_routes`** — route definitions
- [ ] **`route_retailers`** — retailers assigned to routes
- [ ] **`visits`** — retailer visit records
- [ ] **`notifications`** — in-app notifications

---

## 3. 🔐 Auth System — ✅ COMPLETED

### Routes (`/api/auth`)

- [x] `POST /register` — Register new user (with body validation, transaction: user + session + tokens)
- [x] `POST /login` — Login with email/password (bcrypt verify, session creation, tokens)
- [x] `GET /me` — Get current user profile (auth required, returns permissions)
- [x] `POST /refresh` — Refresh access token using refresh token
- [x] `POST /logout` — Logout (auth required, removes session, blacklists access token in Redis)
- [x] `GET /roles` — Get available user roles

### Auth Sub-Components

- [x] Auth middleware — JWT verify, Redis blacklist check, password-changed check, permission loading
- [x] Permission middleware — `requirePermission()`, `requireAllPermissions()`, `checkPermission()` factory
- [x] Token utils — `generateAccessToken` (15m), `generateRefreshToken` (7d), `verifyAccessToken`, `verifyRefreshToken`, `getTokenRemainingLife`
- [x] Bcrypt utils — `generateHash`, `verifyHash`
- [x] Session service — `removeSession`
- [x] User service — `fetchUserById` (excludes passwordHash), `createUser`
- [x] Permission service — `getUserPermissions`, `getUserByUserId`, `getPermissionsByRoleId`, `getUserRoleAndPermissions`, `hasPermission`, `hasAnyPermission`, `hasAllPermissions`
- [x] Zod request schemas — `registerBodySchema`, `loginBodySchema`, `refreshTokensBodySchema`
- [x] Zod response schemas — `registerResponseSchema`, `loginResponseSchema`, `meResponseSchema`, `refreshTokensResponseSchema`, `logoutResponseSchema`, `getUserRolesResponseSchema`
- [x] Response validation util — `sendValidatedResponse` (validates response against Zod before sending)

### Auth Notes / Issues

- ⚠️ `refreshTokens` controller hashes the refresh token with `generateHash` (bcrypt) then does an **exact match** on `refresh_token_hash` column — **bcrypt hashes are NOT deterministic**, so `hash(token) !== stored_hash`. This should use `verifyHash(storedHash, token)` instead. **This is a bug — refresh token flow is broken.**
- ⚠️ `verifyOwnershipOrPermission` is commented out in `permission.middleware.ts`
- ⚠️ `console.log` left in `me.controller.ts` and `auth.middleware.ts`
- ⚠️ `passwordHash` column allows NULL, but `register` always hashes — inconsistent

---

## 4. 🏪 Retailer Management — 🟡 PARTIAL

### Routes (`/api/retailer`)

- [x] `POST /register` — Register new retailer (with image stream upload to Cloudinary)
  - Uses `streamUpload` middleware (Busboy → Cloudinary pipeline)
  - Auto-creates a user account with `RETAILER` role and random password
  - Validates body with Zod (`createRetailerSchema`)
  - Rollbacks Cloudinary upload on DB failure

### Still Needed

- [ ] `GET /` — List all retailers (paginated, with search/filter)
- [ ] `GET /:id` — Get single retailer details
- [ ] `PUT /:id` — Update retailer info
- [ ] `PATCH /:id/status` — Activate/deactivate retailer
- [ ] `DELETE /:id` — Soft-delete/deactivate retailer
- [ ] `GET /:id/orders` — Get retailer's orders
- [ ] `GET /:id/payments` — Get retailer's payments
- [ ] `GET /:id/balance` — Get retailer's outstanding balance
- [ ] Auth + permission middleware on retailer routes (currently **no auth** on retailer register!)

### Retailer Notes / Issues

- ⚠️ Retailer register route has **NO auth middleware** — anyone can create a retailer
- ⚠️ Random password generated for retailer user but never sent/communicated to them
- ⚠️ `generateRandomPassword()` has a bug — uses `length` variable which is undefined (should be a parameter like `16`)
- ⚠️ No duplicate check for retailer (same user could register multiple retailers)

---

## 5. 📦 Product Management — ❌ NOT STARTED

### Needed

- [ ] DB schema: `products`, `product_categories`
- [ ] `POST /api/products` — Create product (with image upload)
- [ ] `GET /api/products` — List products (paginated, filterable by category)
- [ ] `GET /api/products/:id` — Get product details
- [ ] `PUT /api/products/:id` — Update product
- [ ] `PATCH /api/products/:id/price` — Update product price
- [ ] `DELETE /api/products/:id` — Deactivate product
- [ ] `POST /api/product-categories` — Create category
- [ ] `GET /api/product-categories` — List categories
- [ ] Zod schemas for all product endpoints
- [ ] Permission checks on all routes

---

## 6. 📋 Order Management — ❌ NOT STARTED

### Needed

- [ ] DB schema: `orders`, `order_items`
- [ ] `POST /api/orders` — Create order (retailer or distributor)
- [ ] `GET /api/orders` — List all orders (distributor)
- [ ] `GET /api/orders/my` — List own orders (retailer)
- [ ] `GET /api/orders/:id` — Get order details with items
- [ ] `PUT /api/orders/:id` — Update order
- [ ] `PATCH /api/orders/:id/status` — Update order status (pending → confirmed → dispatched → delivered → cancelled)
- [ ] `DELETE /api/orders/:id` — Cancel order
- [ ] Auto-calculate order total from items
- [ ] Update balance on order completion
- [ ] Update inventory on order dispatch
- [ ] Zod schemas for all order endpoints

---

## 7. 💰 Payment Management — ❌ NOT STARTED

### Needed

- [ ] DB schema: `payments`
- [ ] `POST /api/payments` — Record payment
- [ ] `GET /api/payments` — List all payments (distributor)
- [ ] `GET /api/payments/my` — List own payments (retailer)
- [ ] `GET /api/payments/:id` — Get payment details
- [ ] `PUT /api/payments/:id` — Update payment record
- [ ] `POST /api/payments/:id/refund` — Process refund
- [ ] Auto-update outstanding balance on payment
- [ ] Zod schemas for all payment endpoints

---

## 8. 💳 Outstanding Balance — ❌ NOT STARTED

### Needed

- [ ] DB schema: `outstanding_balances`, `balance_transactions`
- [ ] `GET /api/balances` — List all retailer balances (distributor)
- [ ] `GET /api/balances/my` — View own balance (retailer)
- [ ] `POST /api/balances/:id/adjust` — Manual adjustment
- [ ] `GET /api/balances/:id/history` — Balance transaction history
- [ ] Auto-update on order completion & payment recording
- [ ] Zod schemas

---

## 9. 📊 Inventory Management — ❌ NOT STARTED

### Needed

- [ ] DB schema: `inventory`, `inventory_transactions`
- [ ] `GET /api/inventory` — View current stock
- [ ] `PUT /api/inventory/:productId` — Update stock
- [ ] `POST /api/inventory/:productId/adjust` — Manual adjustment
- [ ] `GET /api/inventory/history` — View stock movement history
- [ ] Auto-deduct on order dispatch
- [ ] Zod schemas

---

## 10. 📈 Reports & Analytics — ❌ NOT STARTED

### Needed

- [ ] `GET /api/reports/sales` — Sales report (date range, retailer-wise)
- [ ] `GET /api/reports/payments` — Payment report
- [ ] `GET /api/reports/outstanding` — Outstanding balance report
- [ ] `GET /api/reports/export` — Export reports (CSV/PDF)
- [ ] `GET /api/analytics/dashboard` — Dashboard summary stats

---

## 11. 🚚 Routes & Visits — ❌ NOT STARTED

### Needed

- [ ] DB schema: `delivery_routes`, `route_retailers`, `visits`
- [ ] `POST /api/routes` — Create delivery route
- [ ] `GET /api/routes` — List routes
- [ ] `GET /api/routes/:id` — Route details with assigned retailers
- [ ] `PUT /api/routes/:id` — Update route
- [ ] `DELETE /api/routes/:id` — Deactivate route
- [ ] `POST /api/visits` — Record retailer visit
- [ ] `GET /api/visits` — List visit history
- [ ] `PUT /api/visits/:id` — Update visit record

---

## 12. 🔔 Notifications — ❌ NOT STARTED

### Needed

- [ ] DB schema: `notifications`
- [ ] `POST /api/notifications` — Send notification
- [ ] `GET /api/notifications` — List notifications
- [ ] `PATCH /api/notifications/:id/read` — Mark as read
- [ ] `DELETE /api/notifications/:id` — Delete notification
- [ ] Push notification integration (Firebase Cloud Messaging for React Native)

---

## 13. ⚙️ System / Role Management — ❌ NOT STARTED

### Needed (based on permissions defined)

- [ ] `GET /api/roles` — ✅ Exists (in auth routes)
- [ ] `POST /api/roles` — Create new role
- [ ] `PUT /api/roles/:id` — Update role
- [ ] `DELETE /api/roles/:id` — Deactivate role
- [ ] `GET /api/permissions` — View permission catalogue
- [ ] `POST /api/role-permissions` — Assign permission to role
- [ ] `DELETE /api/role-permissions` — Revoke permission from role

---

## 14. 🌱 Seed Scripts — ❌ NOT STARTED

> `package.json` has `db:seed` pointing to `src/db/seed/permissions.seed.ts` but the file/directory doesn't exist.

- [ ] Create `src/db/seed/` directory
- [ ] `permissions.seed.ts` — Seed all 52 permissions from `PERMISSIONS` constant
- [ ] `roles.seed.ts` — Seed DISTRIBUTOR and RETAILER roles
- [ ] `rolePermissions.seed.ts` — Assign permissions to roles based on `PERMISSIONS[].roles`
- [ ] `users.seed.ts` — Seed a default admin/distributor user
- [ ] Master seed script that runs all in correct order

---

## 15. 🐛 Known Bugs & Issues

| # | Severity | Location | Issue |
|---|----------|----------|-------|
| 1 | 🔴 Critical | `refresh.token.controller.ts` | Bcrypt hash comparison uses `eq()` instead of `verifyHash()` — refresh token flow is broken |
| 2 | 🔴 Critical | `retailer.routes.ts` | No auth middleware on retailer register — publicly accessible |
| 3 | 🟡 Medium | `password.utils.ts` | `generateRandomPassword()` uses undefined `length` variable — generates only 4-char password |
| 4 | 🟡 Medium | `.env.example` | Incomplete — missing `JWT_SECRET`, `DB_URL`, `REDIS_CLI`, `CLOUDINARY_*` vars |
| 5 | 🟡 Medium | `session.schema.ts` | `expiresAt` default uses `new Date()` at schema load time, not at insert time |
| 6 | 🟢 Low | `me.controller.ts` | `console.log("Check : ", userInfo.permissions)` left in production code |
| 7 | 🟢 Low | `auth.middleware.ts` | `console.log(decoded)` left in production code |
| 8 | 🟢 Low | `user.schema.ts` | Email varchar(25) is very short — many emails are longer |
| 9 | 🟢 Low | `index.ts` | `home.routes.ts` imported but never mounted; fallback handler uses `res.write()` instead of `res.send()` |
| 10 | 🟢 Low | `createUser.ts` | Legacy role fallback logic (`Retail` ↔ `RETAILER`) is messy — should be cleaned up |

---

## 16. 🧰 Utilities & Middleware (Existing)

### Utils
- [x] `bcrypt.utils.ts` — `generateHash`, `verifyHash`
- [x] `token.utils.ts` — JWT generate/verify for access & refresh tokens
- [x] `password.utils.ts` — Random password generator (has bug)
- [x] `cloudinary.util.ts` — Stream upload & delete from Cloudinary
- [x] `response.util.ts` — `sendValidatedResponse` (Zod-validates response before sending)
- [x] `logs.util.ts` — `logError`, `logInfo` logging utilities

### Middlewares
- [x] `auth.middleware.ts` — JWT auth + Redis blacklist + password change check + permission loading
- [x] `permission.middleware.ts` — Permission check factory (`requirePermission`, `requireAllPermissions`)
- [x] `busboyStreamUpload.middleware.ts` — Streaming file upload to Cloudinary via Busboy
- [x] `apiBodyValidator.middleware.ts` — Zod body validation
- [x] `apiParamValidator.middleware.ts` — Zod param validation
- [x] `apiQuerySearchValidator.middleware.ts` — Zod query validation
- [x] `apiResponseValidator.middleware.ts` — Zod response validation

### Core Zod Schemas
- [x] `email.schema.ts`, `password.schema.ts`, `phone.schema.ts`, `postalCode.schema.ts`, `role.schema.ts`, `coordinates.schema.ts`
- [x] `response.schema.ts` — `createApiResponseSchema`, `messageOnlyResponseSchema`, `createPaginatedResponseSchema`

---

## 17. 📌 Permissions Defined (52 total)

All permissions are defined in `src/constants/permissions.const.ts` but most modules haven't been built yet.

| Module                  | Permission Codes                                                                                     | API Built? |
|-------------------------|------------------------------------------------------------------------------------------------------|------------|
| Dashboard               | `DASHBOARD_VIEW`, `DASHBOARD_VIEW_REPORTS`                                                           | ❌         |
| User Management         | `USER_CREATE`, `USER_VIEW`, `USER_UPDATE`, `USER_DELETE`, `USER_CHANGE_ROLE`                         | ❌         |
| Retailer Management     | `RETAILER_CREATE`, `RETAILER_VIEW`, `RETAILER_VIEW_ALL`, `RETAILER_UPDATE`, `RETAILER_DELETE`        | 🟡 Partial |
| Product Management      | `PRODUCT_CREATE`, `PRODUCT_VIEW`, `PRODUCT_UPDATE`, `PRODUCT_UPDATE_PRICE`, `PRODUCT_DELETE`         | ❌         |
| Order Management        | `ORDER_CREATE`, `ORDER_VIEW`, `ORDER_VIEW_ALL`, `ORDER_VIEW_OWN`, `ORDER_UPDATE`, `ORDER_CANCEL`, `ORDER_UPDATE_OWN` | ❌ |
| Payment Management      | `PAYMENT_CREATE`, `PAYMENT_VIEW`, `PAYMENT_VIEW_ALL`, `PAYMENT_VIEW_OWN`, `PAYMENT_UPDATE`, `PAYMENT_REFUND` | ❌ |
| Outstanding Balance     | `BALANCE_VIEW_ALL`, `BALANCE_VIEW_OWN`, `BALANCE_ADJUST`, `BALANCE_VIEW_HISTORY`                     | ❌         |
| Inventory Management    | `INVENTORY_VIEW`, `INVENTORY_UPDATE`, `INVENTORY_ADJUST`, `INVENTORY_VIEW_HISTORY`                   | ❌         |
| Reports & Analytics     | `REPORT_SALES_VIEW`, `REPORT_PAYMENT_VIEW`, `REPORT_OUTSTANDING_VIEW`, `REPORT_EXPORT`, `ANALYTICS_VIEW` | ❌ |
| Routes & Visits         | `ROUTE_CREATE`, `ROUTE_VIEW`, `ROUTE_UPDATE`, `ROUTE_DELETE`, `VISIT_CREATE`, `VISIT_VIEW`, `VISIT_UPDATE` | ❌ |
| Notifications           | `NOTIFICATION_CREATE`, `NOTIFICATION_VIEW`, `NOTIFICATION_DELETE`, `NOTIFICATION_MANAGE`             | ❌         |
| System Management       | `ROLE_VIEW`, `ROLE_CREATE`, `ROLE_UPDATE`, `ROLE_DELETE`, `PERMISSION_VIEW`, `ROLE_PERMISSION_MANAGE`| ❌         |

---

## 🗺️ Recommended Next Steps (Priority Order)

1. **🔴 Fix critical bugs** — Refresh token flow, retailer auth, password generator
2. **🌱 Create seed scripts** — Roles, permissions, role-permissions (needed for dev/testing)
3. **📦 Product Management** — Schema + full CRUD (core business feature)
4. **📋 Order Management** — Schema + full CRUD (the core flow)
5. **💰 Payment Management** — Schema + recording/tracking
6. **💳 Outstanding Balance** — Auto-calculation from orders/payments
7. **📊 Inventory Management** — Stock tracking
8. **🏪 Complete Retailer CRUD** — List, view, update, deactivate
9. **🚚 Routes & Visits** — Delivery route planning
10. **🔔 Notifications** — In-app + push notifications
11. **📈 Reports & Analytics** — Business insights
12. **⚙️ System Management** — Role/permission CRUD
13. **🛡️ Server hardening** — CORS, rate limiting, helmet, global error handler
14. **📝 API documentation** — Swagger/OpenAPI
15. **🧪 Testing** — Unit + integration tests

