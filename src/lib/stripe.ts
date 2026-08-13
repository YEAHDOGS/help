import Stripe from "stripe";
import { integrations } from "@/lib/integrations";

export function getStripe(): Stripe | null {
  if (!integrations.stripe()) return null;
  return new Stripe(process.env.STRIPE_SECRET_KEY!);
}
