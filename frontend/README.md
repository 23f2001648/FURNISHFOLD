# FurnishFoldz — storefront

Next.js 15 (App Router) + TypeScript + Tailwind v4 + TanStack Query + Zustand, built against the FastAPI backend in `furnishfoldz-backend.zip`.

## Run
```bash
cp .env.example .env.local     # NEXT_PUBLIC_API_URL must point at <backend>/api/v1
npm install
npm run dev                    # http://localhost:3000
```
Backend CORS already allows `http://localhost:3000`. Start the API first (`uvicorn app.main:app --reload`) and run `python -m scripts.seed` for sample products.

## Where things are
- `lib/api/client.ts` — fetch wrapper: Bearer auth, one-shot refresh-token retry, backend `{error:{message}}` parsing
- `lib/api/endpoints.ts` — every backend call, typed
- `hooks/` + `features/` — auth, cart, wishlist, payment (Razorpay), route guard
- `app/(store)` storefront · `app/(auth)` login/register/reset

## Backend gaps to be aware of
| Frontend page | Missing on backend | Current behaviour |
|---|---|---|
| forgot/reset password | `POST /auth/forgot-password`, `/auth/reset-password` | UI built; shows "not enabled yet" on 404 |
| `/collections/[slug]` | per-collection product endpoint | shows collection header + full catalogue |
| Guest cart | cart is per-account | guests are sent to sign in when adding to cart |
| Cashfree | no `payment_session_id` returned | Razorpay + COD work; Cashfree shows a clear error |
| Contact / Blog | no endpoints | mailto form / static posts in `lib/constants/blog.ts` |
| Wishlist page | returns ids only | resolved against first 100 catalogue products |
| Cart line titles | cart returns variants without product title | shows SKU + options |
