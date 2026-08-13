import Link from "next/link";
import { AuthButtons } from "@/components/auth-buttons";
import { integrations } from "@/lib/integrations";

export function Header() {
  const clerkEnabled = integrations.clerk();

  return (
    <header className="sticky top-0 z-10 border-b border-amber-900/10 bg-cream/90 backdrop-blur">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
        <Link href="/" className="text-lg font-bold tracking-tight">
          🐾 Dogs Help
        </Link>
        <nav className="flex items-center gap-6 text-sm font-medium">
          <Link href="/dogs" className="hover:text-amber-700">
            Dogs
          </Link>
          <Link href="/donate" className="hover:text-amber-700">
            Donate
          </Link>
          <Link href="/dashboard" className="hover:text-amber-700">
            Dashboard
          </Link>
          {clerkEnabled ? <AuthButtons /> : null}
        </nav>
      </div>
    </header>
  );
}
