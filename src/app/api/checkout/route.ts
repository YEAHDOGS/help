import { NextRequest, NextResponse } from "next/server";
import { getStripe } from "@/lib/stripe";
import { checkRateLimit } from "@/lib/ratelimit";

/**
 * POST /api/checkout
 * Body: { amountUsd: number, dogId?: string, dogName?: string }
 * Creates a Stripe Checkout session for a one-time donation.
 */
export async function POST(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0] ?? "anonymous";
  if (!(await checkRateLimit(`checkout:${ip}`))) {
    return NextResponse.json(
      { error: "Too many requests, please slow down." },
      { status: 429 }
    );
  }

  const stripe = getStripe();
  if (!stripe) {
    return NextResponse.json(
      { error: "Stripe is not configured yet. Set STRIPE_SECRET_KEY." },
      { status: 503 }
    );
  }

  const body = await req.json().catch(() => ({}));
  const amountUsd = Number(body.amountUsd);
  if (!Number.isFinite(amountUsd) || amountUsd < 1 || amountUsd > 10_000) {
    return NextResponse.json(
      { error: "Donation amount must be between $1 and $10,000." },
      { status: 400 }
    );
  }

  const origin = req.headers.get("origin") ?? "http://localhost:3000";
  const dogName = typeof body.dogName === "string" ? body.dogName : undefined;

  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    line_items: [
      {
        price_data: {
          currency: "usd",
          unit_amount: Math.round(amountUsd * 100),
          product_data: {
            name: dogName ? `Donation for ${dogName}` : "Donation to Dogs Help",
            description: "One-time donation. Thank you for giving back. 🐾",
          },
        },
        quantity: 1,
      },
    ],
    metadata: {
      dog_id: typeof body.dogId === "string" ? body.dogId : "",
      dog_name: dogName ?? "",
    },
    success_url: `${origin}/donate?status=success`,
    cancel_url: `${origin}/donate?status=cancelled`,
  });

  return NextResponse.json({ url: session.url });
}
