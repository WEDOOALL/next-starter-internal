/**
 * WEDOOALL observability — inlined in this template.
 *
 * Originally planned as `@wedooall/observability` package, extracted here to
 * keep the template self-contained. Can be promoted later.
 *
 * Initialises Sentry + PostHog server-side in `instrumentation.ts`.
 * Browser-side init is done by the apps directly (e.g. via PostHogProvider
 * Component) — no central module here.
 */

/**
 * Called by Next.js `instrumentation.ts` at server boot.
 * Idempotent — safe to call multiple times (no-op if env vars missing).
 */
export async function register(): Promise<void> {
  // Only initialise on the Node.js server runtime, not in Edge runtime
  // (Sentry/PostHog SDKs use Node-only APIs).
  if (process.env["NEXT_RUNTIME"] !== "nodejs") {
    return;
  }

  await initSentry();
  // PostHog Node SDK is initialised lazily on first capture() call;
  // see app code that imports `posthog-node` directly when needed.
}

async function initSentry(): Promise<void> {
  const dsn = process.env["NEXT_PUBLIC_SENTRY_DSN"];
  if (!dsn) {
    // Silent no-op if Sentry is not configured (dev mode without DSN)
    return;
  }

  // Dynamic import to keep Sentry out of the bundle when DSN is absent
  // and to avoid pulling its transitive deps into Edge runtime.
  const Sentry = await import("@sentry/nextjs");
  Sentry.init({
    dsn,
    tracesSampleRate: process.env["NODE_ENV"] === "production" ? 0.1 : 1.0,
    enabled: !!dsn,
    environment: process.env["NODE_ENV"],
    release: process.env["GIT_SHA"],
  });
}
