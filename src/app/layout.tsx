import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import { Header } from "@/components/header";
import { PostHogInit } from "@/components/posthog-init";
import { integrations } from "@/lib/integrations";
import "./globals.css";

export const metadata: Metadata = {
  title: "Dogs Help — a way to give back",
  description:
    "Fund food, shelter, and medical care for rescue dogs waiting on their forever home.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const page = (
    <html lang="en">
      <body className="min-h-screen antialiased">
        <PostHogInit />
        <Header />
        <main>{children}</main>
        <footer className="border-t border-amber-900/10 py-8 text-center text-sm text-amber-950/60">
          Dogs Help — a way to give back. 🐾
        </footer>
      </body>
    </html>
  );

  // ClerkProvider needs a publishable key, so auth stays dormant until
  // the Clerk env vars are set.
  return integrations.clerk() ? <ClerkProvider>{page}</ClerkProvider> : page;
}
