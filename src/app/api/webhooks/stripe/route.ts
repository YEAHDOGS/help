import { NextRequest, NextResponse } from "next/server";
import type Stripe from "stripe";
import { getStripe } from "@/lib/stripe";
import { getSupabase } from "@/lib/supabase";
import { sendDonationReceipt } from "@/lib/resend";

/**
 * POST /api/webhooks/stripe
 * Point a Stripe webhook (event: checkout.session.completed) here.
 * Records the donation in Supabase and emails a receipt via Resend.
 */
export async function POST(req: NextRequest) {
  const stripe = getStripe();
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!stripe || !secret) {
    return NextResponse.json(
      { error: "Stripe webhook is not configured." },
      { status: 503 }
    );
  }

  const signature = req.headers.get("stripe-signature");
  if (!signature) {
    return NextResponse.json({ error: "Missing signature." }, { status: 400 });
  }

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(await req.text(), signature, secret);
  } catch {
    return NextResponse.json({ error: "Invalid signature." }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object;
    const amountUsd = (session.amount_total ?? 0) / 100;
    const email = session.customer_details?.email ?? null;
    const dogId = session.metadata?.dog_id || null;

    const supabase = getSupabase();
    if (supabase) {
      await supabase.from("donations").insert({
        stripe_session_id: session.id,
        amount_usd: amountUsd,
        donor_email: email,
        dog_id: dogId?.startsWith("sample-") ? null : dogId,
      });
      if (dogId && !dogId.startsWith("sample-")) {
        await supabase.rpc("increment_raised", {
          p_dog_id: dogId,
          p_amount: amountUsd,
        });
      }
    }

    if (email) {
      await sendDonationReceipt(email, amountUsd).catch(() => {
        // Receipt email is best-effort; the donation is already recorded.
      });
    }
  }

  return NextResponse.json({ received: true });
}
