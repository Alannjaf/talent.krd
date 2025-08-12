# Talent Platform — Architecture and Delivery Plan

This plan assumes: Clerk for auth, Neon (PostgreSQL) for the database, hosting on Netlify with a custom domain, and local Iraqi payment gateways (FIB, FastPay, NassWallet, areeba).

## Core product
- Talent profiles: bio, tags, location, media portfolio, pricing, availability
- Discovery: search, filters (category, location, price, rating), featured sections
- Booking & offers: request → quote/accept → payment → completion → review
- Messaging: talent ↔ customer threads, attachments, anti-spam controls
- Payments: pay-in via FIB/FastPay/NassWallet/areeba, webhooks, refunds
- Reviews & ratings: post-completion feedback, report/appeal flow
- Admin: user/content moderation, disputes, payouts reconciliation, dashboards

## Tech stack
- Web app: Next.js + TypeScript + Tailwind CSS (deployed on Netlify)
- Auth: Clerk (prebuilt components, session management)
- DB: Neon Postgres; ORM: Drizzle or Prisma
- API: Netlify Functions/Edge for server endpoints and webhooks
- Media: external object storage/CDN (e.g., Cloudinary/Bunny) for images/videos
- Observability: logging, error tracking (e.g., Sentry), analytics

## Data model (high level)
- `users` (id, clerk_id, role: talent|customer|admin)
- `talent_profiles` (user_id, display_name, bio, tags[], location, headline)
- `portfolio_items` (profile_id, media_url, title, description, visibility)
- `services` (profile_id, title, description, price, currency, duration)
- `bookings` (service_id, customer_id, status, schedule_start/end, price_agreed)
- `messages` (thread_id, sender_id, body, attachments[])
- `payment_transactions` (booking_id, provider, provider_ref, amount, currency, status, raw_payload)
- `reviews` (booking_id, rating, comment, reviewer_id)

Use Neon RLS with Clerk user IDs to restrict row access where appropriate.

## Payments integration
- Abstraction layer: `PaymentProvider` interface with drivers for FIB, FastPay, NassWallet, areeba.
- Endpoints:
  - `POST /api/payments/create` → returns redirect URL
  - `POST /api/payments/webhook/{provider}` → verifies signature, updates booking/transaction
  - `GET /api/payments/status?id=...` → optional reconciliation
- Webhooks: run in Netlify Functions; verify HMAC/signature; log all requests; idempotent updates.
- Currencies: IQD primary; present exchange info only if needed.

## Auth and access control
- Clerk for sign-in/sign-up; enrich user record in app DB on first login
- Roles: talent, customer, admin
- Protect write endpoints; apply RLS in Neon tied to `clerk_id`

## Deployment
- Netlify: connect repo, set environment variables
  - `CLERK_PUBLISHABLE_KEY`, `CLERK_SECRET_KEY`
  - `DATABASE_URL` (Neon), `DRIZZLE_...` or `PRISMA_...`
  - Payment secrets per provider
- Custom domain: configure DNS → Netlify, enable HTTPS
- CI/CD: preview deploys on PRs, production on main branch

## Milestones
1. Foundations (week 1–2): project setup, auth, DB scaffold, CI/CD
2. Profiles & portfolio (week 3–4): create/edit profile, upload media, public profile pages
3. Search & messaging (week 5–6): search UX, message threads, email notifications
4. Bookings (week 7–8): request/offer flow, service catalog
5. Payments (week 9–10): FIB + FastPay drivers, webhooks, receipts
6. QA & launch (week 11–12): polish, admin tools, performance, production cutover

## References
- Clerk × Neon: `https://clerk.com/docs/integrations/databases/neon`
- Netlify docs: `https://docs.netlify.com/`
- Payment docs:
  - FIB: `https://fib.iq/integrations/web-payments/`
  - FastPay: `https://secure.fast-pay.cash/docs/start`
  - NassWallet: `https://nass.iq/`
  - areeba (contact for docs): `https://www.areeba.com/`
