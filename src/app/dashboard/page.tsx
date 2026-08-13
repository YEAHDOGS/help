import { integrations } from "@/lib/integrations";
import { getSupabase } from "@/lib/supabase";

export const dynamic = "force-dynamic";

type Donation = {
  id: string;
  amount_usd: number;
  donor_email: string | null;
  created_at: string;
};

export default async function DashboardPage() {
  if (!integrations.clerk()) {
    return (
      <div className="mx-auto max-w-2xl px-6 py-24 text-center">
        <h1 className="text-3xl font-extrabold">Dashboard</h1>
        <p className="mt-4 text-amber-950/70">
          The dashboard is protected by Clerk. Add{" "}
          <code className="rounded bg-amber-100 px-1.5 py-0.5 text-sm">
            NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
          </code>{" "}
          and{" "}
          <code className="rounded bg-amber-100 px-1.5 py-0.5 text-sm">
            CLERK_SECRET_KEY
          </code>{" "}
          to your env to enable sign-in.
        </p>
      </div>
    );
  }

  const { auth } = await import("@clerk/nextjs/server");
  const { userId, redirectToSignIn } = await auth();
  if (!userId) return redirectToSignIn();

  const supabase = getSupabase();
  let donations: Donation[] = [];
  let total = 0;
  if (supabase) {
    const { data } = await supabase
      .from("donations")
      .select("id, amount_usd, donor_email, created_at")
      .order("created_at", { ascending: false })
      .limit(25);
    donations = (data as Donation[]) ?? [];
    total = donations.reduce((sum, d) => sum + Number(d.amount_usd), 0);
  }

  return (
    <div className="mx-auto max-w-4xl px-6 py-16">
      <h1 className="text-3xl font-extrabold">Donations dashboard</h1>
      {!supabase ? (
        <p className="mt-4 text-amber-950/70">
          Connect Supabase to see donations here (see README.md).
        </p>
      ) : (
        <>
          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            <div className="rounded-2xl border border-amber-900/10 bg-white p-6">
              <p className="text-sm text-amber-950/60">Recent donations</p>
              <p className="mt-1 text-3xl font-extrabold">{donations.length}</p>
            </div>
            <div className="rounded-2xl border border-amber-900/10 bg-white p-6">
              <p className="text-sm text-amber-950/60">Total (last 25)</p>
              <p className="mt-1 text-3xl font-extrabold">
                ${total.toLocaleString()}
              </p>
            </div>
          </div>
          <div className="mt-8 overflow-hidden rounded-2xl border border-amber-900/10 bg-white">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-amber-900/10 bg-amber-50/60">
                <tr>
                  <th className="px-4 py-3 font-semibold">Date</th>
                  <th className="px-4 py-3 font-semibold">Donor</th>
                  <th className="px-4 py-3 text-right font-semibold">Amount</th>
                </tr>
              </thead>
              <tbody>
                {donations.length === 0 ? (
                  <tr>
                    <td
                      colSpan={3}
                      className="px-4 py-8 text-center text-amber-950/50"
                    >
                      No donations yet — share the donate page! 🐾
                    </td>
                  </tr>
                ) : (
                  donations.map((d) => (
                    <tr key={d.id} className="border-b border-amber-900/5">
                      <td className="px-4 py-3">
                        {new Date(d.created_at).toLocaleDateString()}
                      </td>
                      <td className="px-4 py-3">
                        {d.donor_email ?? "Anonymous"}
                      </td>
                      <td className="px-4 py-3 text-right font-semibold">
                        ${Number(d.amount_usd).toLocaleString()}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}
