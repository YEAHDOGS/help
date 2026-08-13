# 🐾 Dogs Help — a way to give back

A donation platform for rescue dogs, built on the **~$21/month startup stack**:

| Tool | Role | Cost | Where it lives in this repo |
|---|---|---|---|
| [Claude](https://claude.ai) | coding | $20/mo | Built this project |
| [Supabase](https://supabase.com) | backend | Free | `src/lib/supabase.ts`, `supabase/migrations/` |
| [Vercel](https://vercel.com) | deploying | Free | Deploy target (zero config) |
| [Namecheap](https://namecheap.com) | domain | $12/yr | Buy your domain there |
| [Stripe](https://stripe.com) | payments | 2.9%/txn | `src/app/api/checkout`, `src/app/api/webhooks/stripe` |
| [GitHub](https://github.com) | version control | Free | You're looking at it |
| [Resend](https://resend.com) | emails | Free | `src/lib/resend.ts` (donation receipts) |
| [Clerk](https://clerk.com) | auth | Free | `src/app/layout.tsx`, `src/proxy.ts`, `/dashboard` |
| [Cloudflare](https://cloudflare.com) | DNS | Free | Point your Namecheap domain's nameservers there |
| [PostHog](https://posthog.com) | analytics | Free | `src/components/posthog-init.tsx` |
| [Sentry](https://sentry.io) | error tracking | Free | `instrumentation.ts`, `instrumentation-client.ts` |
| [Upstash](https://upstash.com) | Redis | Free | `src/lib/ratelimit.ts` (API rate limiting) |
| [Pinecone](https://pinecone.io) | vector DB | Free | `src/lib/pinecone.ts` (semantic dog search) |

**Every integration is optional.** The app builds and runs with **zero API keys** —
sample data, dormant auth, disabled checkout — and each feature lights up as you
add its env vars. Check `GET /api/health` (or the homepage status grid) to see
what's configured.

## What it does

- **Landing page** (`/`) — mission + live status grid of the stack
- **Dogs** (`/dogs`) — rescue-dog profiles with funding progress bars (Supabase, with sample fallback)
- **Donate** (`/donate`) — one-time donations via Stripe Checkout, rate-limited by Upstash
- **Dashboard** (`/dashboard`) — Clerk-protected donations overview
- **Receipts** — Stripe webhook records the donation in Supabase and emails a receipt via Resend
- **Search API** (`/api/search?q=...`) — semantic search over dog profiles via Pinecone

## Quick start

```bash
npm install
npm run dev        # → http://localhost:3000 (works with no keys)
```

## Wiring up the stack

Copy `.env.example` to `.env.local`, then work through the services in any order:

1. **Supabase** — create a project, run `supabase/migrations/0001_init.sql` in the
   SQL editor (creates `dogs` + `donations` tables, RLS, and seed data), and copy
   the URL + anon + service-role keys.
2. **Clerk** — create an app, copy the publishable + secret keys. `/dashboard`
   becomes sign-in protected automatically.
3. **Stripe** — copy your secret key. For webhooks, add an endpoint for
   `checkout.session.completed` pointing at `/api/webhooks/stripe` and copy the
   signing secret. Locally: `stripe listen --forward-to localhost:3000/api/webhooks/stripe`.
4. **Resend** — create an API key. Receipts send from `onboarding@resend.dev`
   until you verify your own domain and set `RESEND_FROM`.
5. **PostHog / Sentry / Upstash** — paste keys; pageviews, error tracking, and
   API rate limiting (10 req/10s per IP) switch on automatically.
6. **Pinecone** — create an index named `dogs-help` **with integrated embeddings**
   (e.g. `llama-text-embed-v2` mapped to a `text` field), upsert your dog
   profiles as records, and `/api/search` switches from keyword to semantic.

## Deploying (Vercel + Namecheap + Cloudflare)

1. Push to GitHub and import the repo at [vercel.com/new](https://vercel.com/new) —
   it detects Next.js, no config needed. Add your env vars in Project Settings.
2. Buy a domain on Namecheap.
3. Add the domain to Cloudflare (free plan), point Namecheap's nameservers at the
   ones Cloudflare gives you, then add the domain in Vercel and follow its DNS
   instructions (set the Cloudflare records to **DNS only** while validating).
4. Update the Stripe webhook endpoint to your production URL.

## Project layout

```
src/
  app/
    page.tsx                    # landing + stack status grid
    dogs/page.tsx               # dog profiles (Supabase or sample data)
    donate/                     # Stripe Checkout flow
    dashboard/page.tsx          # Clerk-protected donations dashboard
    api/
      checkout/route.ts         # POST → Stripe Checkout session
      webhooks/stripe/route.ts  # records donation, sends receipt
      search/route.ts           # Pinecone semantic search (keyword fallback)
      health/route.ts           # which integrations are configured
  components/                   # header, PostHog init
  lib/                          # one thin, guarded client per service
  proxy.ts                      # Clerk middleware (dormant without keys)
supabase/migrations/            # schema + seed
```

Total monthly cost to run: **~$21**. 🐶
