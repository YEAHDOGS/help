import * as Sentry from "@sentry/nextjs";

// Sentry error tracking (server + edge). No-ops until a DSN is set.
export async function register() {
  Sentry.init({
    dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
    tracesSampleRate: 0.1,
  });
}

export const onRequestError = Sentry.captureRequestError;
