/**
 * Central place to check which services from the stack are configured.
 * Every integration is optional: the app builds, runs, and demos with
 * zero keys, and each feature lights up as its env vars are added.
 */
export const integrations = {
  clerk: () => Boolean(process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY),
  supabase: () =>
    Boolean(
      process.env.NEXT_PUBLIC_SUPABASE_URL &&
        (process.env.SUPABASE_SERVICE_ROLE_KEY ||
          process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)
    ),
  stripe: () => Boolean(process.env.STRIPE_SECRET_KEY),
  resend: () => Boolean(process.env.RESEND_API_KEY),
  posthog: () => Boolean(process.env.NEXT_PUBLIC_POSTHOG_KEY),
  sentry: () => Boolean(process.env.NEXT_PUBLIC_SENTRY_DSN),
  upstash: () =>
    Boolean(
      process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN
    ),
  pinecone: () => Boolean(process.env.PINECONE_API_KEY),
};

export function integrationStatus() {
  return Object.fromEntries(
    Object.entries(integrations).map(([name, check]) => [name, check()])
  ) as Record<keyof typeof integrations, boolean>;
}
