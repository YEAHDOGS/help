import Link from "next/link";
import { integrationStatus } from "@/lib/integrations";

const stack: { name: string; role: string; key: string }[] = [
  { name: "Claude", role: "coding", key: "claude" },
  { name: "Supabase", role: "backend", key: "supabase" },
  { name: "Vercel", role: "deploying", key: "vercel" },
  { name: "Namecheap", role: "domain", key: "namecheap" },
  { name: "Stripe", role: "payments", key: "stripe" },
  { name: "GitHub", role: "version control", key: "github" },
  { name: "Resend", role: "emails", key: "resend" },
  { name: "Clerk", role: "auth", key: "clerk" },
  { name: "Cloudflare", role: "DNS", key: "cloudflare" },
  { name: "PostHog", role: "analytics", key: "posthog" },
  { name: "Sentry", role: "error tracking", key: "sentry" },
  { name: "Upstash", role: "Redis", key: "upstash" },
  { name: "Pinecone", role: "vector DB", key: "pinecone" },
];

export default function Home() {
  const status = integrationStatus() as Record<string, boolean>;

  return (
    <div className="mx-auto max-w-5xl px-6">
      <section className="py-24 text-center">
        <p className="mb-4 text-sm font-semibold uppercase tracking-widest text-amber-700">
          A way to give back
        </p>
        <h1 className="mx-auto max-w-2xl text-5xl font-extrabold tracking-tight">
          Every dog deserves a second chance.
        </h1>
        <p className="mx-auto mt-6 max-w-xl text-lg text-amber-950/70">
          Dogs Help funds food, shelter, and medical care for rescue dogs
          waiting on their forever home. 100% of donations go to the dogs.
        </p>
        <div className="mt-10 flex justify-center gap-4">
          <Link
            href="/dogs"
            className="rounded-full bg-amber-700 px-8 py-3 font-semibold text-white shadow hover:bg-amber-800"
          >
            Meet the dogs
          </Link>
          <Link
            href="/donate"
            className="rounded-full border border-amber-700 px-8 py-3 font-semibold text-amber-800 hover:bg-amber-50"
          >
            Donate
          </Link>
        </div>
      </section>

      <section className="pb-24">
        <h2 className="text-center text-sm font-semibold uppercase tracking-widest text-amber-950/50">
          Built on the ~$21/month startup stack
        </h2>
        <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
          {stack.map((item) => {
            const configured = status[item.key];
            const wired = item.key in status;
            return (
              <div
                key={item.name}
                className="rounded-xl border border-amber-900/10 bg-white/60 p-4"
              >
                <div className="flex items-center justify-between">
                  <span className="font-semibold">{item.name}</span>
                  {wired ? (
                    <span
                      title={configured ? "Configured" : "Add keys in .env"}
                      className={`h-2.5 w-2.5 rounded-full ${
                        configured ? "bg-green-500" : "bg-amber-300"
                      }`}
                    />
                  ) : null}
                </div>
                <p className="mt-1 text-sm text-amber-950/60">{item.role}</p>
              </div>
            );
          })}
        </div>
        <p className="mt-6 text-center text-sm text-amber-950/50">
          <span className="mr-1 inline-block h-2 w-2 rounded-full bg-green-500" />
          configured
          <span className="mx-1 ml-4 inline-block h-2 w-2 rounded-full bg-amber-300" />
          waiting on API keys — see README.md
        </p>
      </section>
    </div>
  );
}
