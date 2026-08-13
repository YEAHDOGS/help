"use client";

import { SignInButton, UserButton, useAuth } from "@clerk/nextjs";

export function AuthButtons() {
  const { isLoaded, isSignedIn } = useAuth();
  if (!isLoaded) return null;

  return isSignedIn ? (
    <UserButton />
  ) : (
    <SignInButton mode="modal">
      <button className="rounded-full bg-amber-700 px-4 py-1.5 text-white hover:bg-amber-800">
        Sign in
      </button>
    </SignInButton>
  );
}
