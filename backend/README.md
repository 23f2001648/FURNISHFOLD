# FurnishFoldz — backend

FastAPI backend for FurnishFoldz, an e-commerce store for foldable,
space-saving furniture.

## Stack

- **API**: FastAPI + async SQLAlchemy 2.0 + Pydantic v2
- **DB**: PostgreSQL, migrations via Alembic
- **Auth**: JWT (access + refresh), bcrypt password hashing, role-based
  guards separating `customer` and `admin`
- **Background jobs**: Celery + Redis (order emails, invoices, shipment sync)
- **Payments**: Razorpay / Cashfree adapters behind a common interface
- **Shipping**: Shiprocket / Delhivery adapters behind a common interface
- **Notifications**: email (SMTP/SendGrid/SES) + WhatsApp Business Cloud API

## Project layout

Follows a layered architecture:

```
api/v1/        → thin HTTP routers: parse request, call a service, return a schema
services/      → business logic & orchestration (one transaction per use case)
repositories/  → all DB access, one repository per aggregate root
models/        → SQLAlchemy ORM tables
schemas/       → Pydantic request/response shapes
integrations/  → external API adapters (payment, shipping, email, WhatsApp)
workers/       → Celery app + background tasks
utils/         → pure helpers (pagination, slugs, pricing, file storage)
```

A request flows **router → service → repository → model**, never the
other way, and routers never touch the DB session directly except for
small ad-hoc read queries that don't warrant their own service.

## Local setup

```bash
cp .env.example .env            # fill in secrets/keys as needed
docker compose up --build       # api on :8000, postgres, redis, celery worker + beat
```

Or without Docker:

```bash
pip install -e ".[dev]"
alembic upgrade head
python -m scripts.seed              # optional: sample categories + products
python -m scripts.create_admin admin@furnishfoldz.in "StrongPass123" "Admin"
uvicorn app.main:app --reload
```

API docs: `http://localhost:8000/api/v1/docs`

## Database migrations

```bash
alembic revision --autogenerate -m "describe the change"
alembic upgrade head
```

## Tests

```bash
pytest                              # unit tests run with no DB needed
TEST_DATABASE_URL=... pytest app/tests/integration   # integration tests need Postgres
```

## Auth model

- `POST /api/v1/auth/register` and `/login` issue an access token (short
  lived) and a refresh token (long lived); `/auth/refresh` rotates them.
- Every protected route depends on `CurrentUser` (any logged-in user) or
  `CurrentAdmin` (role must be `admin`) from `app.core.dependencies`.
- Admin accounts are never created through the public API — use
  `scripts/create_admin.py` or promote a user's `role` directly.

## Checkout flow

1. Customer builds a cart (`/cart`), pricing previewed via `app.utils.pricing`.
2. `POST /orders` (`order_service.create_from_cart`) creates the `Order`
   + `OrderItem`s and **reserves** stock for each line item inside one
   transaction — a stock shortfall on any item rolls the whole order back.
3. `POST /payments/{order_id}/initiate` opens a gateway order (or marks
   COD) and returns what the frontend needs to launch the checkout widget.
4. `POST /payments/verify` checks the gateway signature; on success it
   calls `order_service.mark_paid`, which **commits** the stock
   reservation into a real deduction and flips the order to `confirmed`.
5. Admin books a shipment (`POST /shipments/{order_id}`), which calls
   the configured carrier and stores the tracking info.

## Environment variables

See `.env.example` for the full list — database/redis URLs, JWT secret,
payment + shipping + email + WhatsApp provider credentials, and file
storage (local disk or S3).
