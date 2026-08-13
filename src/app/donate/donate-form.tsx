"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import posthog from "posthog-js";

const PRESETS = [10, 25, 50, 100];

export function DonateForm() {
  const params = useSearchParams();
  const dogId = params.get("dog") ?? undefined;
  const dogName = params.get("name") ?? undefined;
  const status = params.get("status");

  const [amount, setAmount] = useState(25);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function donate() {
    setBusy(true);
    setError(null);
    if (posthog.__loaded) {
      posthog.capture("donation_started", { amount, dogId });
    }
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amountUsd: amount, dogId, dogName }),
      });
      const data = await res.json();
      if (!res.ok || !data.url) {
        throw new Error(data.error ?? "Something went wrong.");
      }
      window.location.href = data.url;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
      setBusy(false);
    }
  }

  return (
    <div className="mx-auto max-w-md">
      {status === "success" && (
        <div className="mb-6 rounded-xl border border-green-200 bg-green-50 p-4 text-green-800">
          Thank you! Your donation was received — check your email for a
          receipt. 🐾
        </div>
      )}
      {status === "cancelled" && (
        <div className="mb-6 rounded-xl border border-amber-200 bg-amber-50 p-4 text-amber-800">
          No worries — your card wasn&apos;t charged.
        </div>
      )}

      <div className="rounded-2xl border border-amber-900/10 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-bold">
          {dogName ? `Donate for ${dogName}` : "Make a donation"}
        </h2>
        <div className="mt-4 grid grid-cols-4 gap-2">
          {PRESETS.map((preset) => (
            <button
              key={preset}
              onClick={() => setAmount(preset)}
              className={`rounded-lg border py-2 font-semibold ${
                amount === preset
                  ? "border-amber-700 bg-amber-700 text-white"
                  : "border-amber-900/15 hover:bg-amber-50"
              }`}
            >
              ${preset}
            </button>
          ))}
        </div>
        <label className="mt-4 block text-sm font-medium text-amber-950/70">
          Custom amount (USD)
          <input
            type="number"
            min={1}
            max={10000}
            value={amount}
            onChange={(e) => setAmount(Number(e.target.value))}
            className="mt-1 w-full rounded-lg border border-amber-900/15 px-3 py-2"
          />
        </label>
        <button
          onClick={donate}
          disabled={busy}
          className="mt-6 w-full rounded-full bg-amber-700 py-3 font-semibold text-white hover:bg-amber-800 disabled:opacity-50"
        >
          {busy ? "Redirecting to Stripe…" : `Donate $${amount || 0}`}
        </button>
        {error && <p className="mt-3 text-sm text-red-600">{error}</p>}
        <p className="mt-4 text-center text-xs text-amber-950/50">
          Payments handled securely by Stripe.
        </p>
      </div>
    </div>
  );
}
