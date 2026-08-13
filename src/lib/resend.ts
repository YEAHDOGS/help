import { Resend } from "resend";
import { integrations } from "@/lib/integrations";

const FROM = process.env.RESEND_FROM ?? "Dogs Help <onboarding@resend.dev>";

export async function sendDonationReceipt(to: string, amountUsd: number) {
  if (!integrations.resend()) return;
  const resend = new Resend(process.env.RESEND_API_KEY!);
  await resend.emails.send({
    from: FROM,
    to,
    subject: "Thank you for helping a dog in need 🐾",
    html: `
      <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto;">
        <h1 style="color: #b45309;">Thank you! 🐶</h1>
        <p>Your donation of <strong>$${amountUsd.toFixed(2)}</strong> to Dogs Help was received.</p>
        <p>Every dollar goes toward food, shelter, and medical care for dogs waiting on their forever home.</p>
        <p style="color: #6b7280; font-size: 13px;">Dogs Help — a way to give back.</p>
      </div>
    `,
  });
}
